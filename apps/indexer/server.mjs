import fetch from "node-fetch";
import express from "express";
import {
  REGISTRAR_URL,
  INDEXER_URL,
  INDEXER_ALT_URL,
  INDEXER_HEALTH_URL,
  INDEXER_HEALTH_ALT_URL,
} from "@xballot/sdk";

let addressArray = [];
let firstRound = undefined;
let indexer = INDEXER_URL;
var domains = [];

//format: {appId:{round: 1:[]}}

const roundBalances = {};

var app = express();

function cacheFunction(func, timeout) {
  let cache = {};
  return async function (...args) {
    let key = JSON.stringify(args);
    if (cache[key] && Date.now() - cache[key].timestamp < timeout) {
      return cache[key].value;
    } else {
      let value = await func(...args);
      cache[key] = {
        value: value,
        timestamp: Date.now(),
      };
      return value;
    }
  };
}

// Cache timeout values
const CACHE_TIMEOUT_ROUND = 4000; // 4 seconds
const CACHE_TIMEOUT_ADDRESSES = 60000; // 1 minutes
const CACHE_TIMEOUT_OPTED = 60000; // 1 minutes

// Cache functions
const getRoundCached = cacheFunction(getRound, CACHE_TIMEOUT_ROUND);
const getAddressesCached = cacheFunction(getAddresses, CACHE_TIMEOUT_ADDRESSES);
const getAllOptedCached = cacheFunction(getAllOpted, CACHE_TIMEOUT_OPTED);

app.get("/balances/:type", function (req, res) {
  switch (req.params.type) {
    case "all":
      res.send(roundBalances);
      break;
    case "filter":
      try {
        //console.log(req.query)

        let filtered = {};

        if (req.query?.closest === "true") {
          filtered = closest(req.query.address, req.query.round);
          //console.log(filtered)
        } else {
          filtered = filter(req.query.address, req.query.round);
          //console.log(filtered)
        }

        res.send(filtered);
      } catch (e) {
        res.send({ msg: "not found" });
      }
      break;
    default:
      res.send({});
      break;
  }
});

app.listen(8888, function () {
  console.log("Node server now listening on port 8888!");
});

async function getAddresses() {
  try {
    let allMembers = []; // the list that will store all member addresses
    let data = await fetch(REGISTRAR_URL + "index/daos");
    let data1 = await data.json();
    for (const [key, value] of Object.entries(data1)) {
      try {
        const appId = parseInt(key);
        const members = await getAllOptedCached(appId, 0, 0);
        //console.log("members", members);

        // add members to allMembers
        allMembers = allMembers.concat(members);

        let domainTemplate = {
          members,
          appId: parseInt(appId),
        };

        if (domains[appId]) {
          Object.assign(domains[appId], domainTemplate);
        } else {
          domains[appId] = { ...domainTemplate };
        }
      } catch (error) {
        console.error(`Error in updating space: ${error}`);
      }
    }
    let dataJSON = allMembers;
    return dataJSON; // return all member addresses
  } catch (e) {
    return [];
  }
}

async function getAllOpted(appId = 155480578, max = 0, min = 0) {
  try {
    let currentRound = await getRoundCached();
    console.log(currentRound)
    if (currentRound < max) {
      max = currentRound;
    }

    let opted = [];

    let pageIndex = 1;

    let nextToken = undefined;

    let roundUrl = "&min-round=" + min + "&max-round=" + max;

    let url2 = "limit=500&application-id=";

    let baseUrl = indexer + "transactions?";

    async function getPage() {
      let pagePiece = pageIndex !== 1 ? "&next=" + nextToken : "";
      let fullUrl = baseUrl + url2 + appId + roundUrl + pagePiece;
      let data = await fetch(fullUrl);

      if (!data.ok) {
        console.log(
          `Failed to fetch from primary indexer URL, switching to alternate URL...`
        );
        baseUrl = INDEXER_ALT_URL + "transactions?";
        fullUrl = baseUrl + url2 + appId + roundUrl + pagePiece;
        data = await fetch(fullUrl);
      }

      let dataJSON = await data.json();

      nextToken = dataJSON["next-token"] || undefined;
      pageIndex++;
      let length = dataJSON.transactions.length;

      for (let i = 0; i < length; i++) {
        if (!opted.includes(dataJSON.transactions[i].sender)) {
          opted.push(dataJSON.transactions[i].sender);
        }
      }
    }

    await getPage();

    if (nextToken !== undefined) {
      //console.log('detected multiple pages');
      for (let i = 2; i < 100 && nextToken !== undefined; i++) {
        //console.log(nextToken)
        //console.log('getting next page');
        await getPage();
      }
    }

    return opted;
  } catch (error) {
    console.log(error);
  }
}

async function getNewTxns(minRound) {
  try {
    let data = await fetch(indexer + "blocks/" + minRound);

    if (!data.ok) {
      console.log(
        `Failed to fetch from primary indexer URL, switching to alternate URL...`
      );
      indexer = INDEXER_ALT_URL;
      data = await fetch(indexer + "blocks/" + minRound);
    }

    let dataJSON = await data.json();

    let txns = dataJSON?.transactions;

    console.log(txns.length + " transactions in block " + minRound);

    for (let i = 0; i < txns.length; i++) {
      let txn = txns[i];

      let addr = undefined;

      switch (txn["tx-type"]) {
        case "pay":
          if (addressArray.includes(txn.sender)) {
            addr = txn.sender;
            await getBalances([addr]);
          }

          if (addressArray.includes(txn["payment-transaction"].receiver)) {
            addr = txn["payment-transaction"].receiver;
            await getBalances([addr]);
          }

          break;
        case "axfer":
          if (addressArray.includes(txn.sender)) {
            addr = txn.sender;
            await getBalances([addr]);
          }

          if (
            addressArray.includes(txn["asset-transfer-transaction"].receiver)
          ) {
            addr = txn["asset-transfer-transaction"].receiver;
            await getBalances([addr]);
          }

          break;
        default:
          break;
      }
    }

    for (let i = 0; i < addressArray.length; i++) {
      if (roundBalances[addressArray[i]] === undefined) {
        await getBalances([addressArray[i]]);
      }
    }
  } catch (e) {
    console.log("block fetch error occured");
    console.log(e);
    return [];
  }
}

runWorker();

async function runWorker() {
    try {
      if (firstRound === undefined) {
        firstRound = await getRoundCached();
      }

      console.log("running worker...");

      addressArray = await getAddressesCached();

      await getNewTxns(firstRound);

      let round = await getRoundCached();
      console.log(round)

      if (round > firstRound) {
        for (let i = firstRound + 1; i <= round; i++) {
          await getNewTxns(i);
        }
        firstRound = round;
      }

      setTimeout(runWorker, 1000);
    } catch (e) {
      setTimeout(runWorker, 1000);
console.log('error on worker', e);
    }
  }

async function getBalances(addresses) {
  for (let i = 0; i < addresses.length; i++) {
    try {
      if (roundBalances?.[addresses[i]]?.[firstRound] === undefined) {
        let start = Date.now();

        let pageIndex = 1;

        let nextToken = undefined;

        let url = indexer + "accounts/" + addresses[i] + "/assets";

        let asaBalances = {}; // Initialize asaBalances here

        let minRound; // Initialize minRound here

        async function getPage() {
          let pagePiece = pageIndex !== 1 ? "&next=" + nextToken : "";
          let fullUrl = url + "?limit=500" + pagePiece;

          //console.log(fullUrl);

          let data = await fetch(fullUrl);

          if (!data.ok) {
            console.log(
              `Failed to fetch from primary indexer URL, switching to alternate URL...`
            );
            url = INDEXER_ALT_URL + "accounts/" + addresses[i] + "/assets";
            fullUrl = url + "?limit=500" + pagePiece;
            data = await fetch(fullUrl);
          }

          let dataJSON = await data.json();
          nextToken = dataJSON["next-token"] || undefined;
          pageIndex++;

          minRound = dataJSON["current-round"]; // Update minRound for each page

          if (minRound !== undefined) {
            //console.log("attempting to update balance for address: ", addresses[i]);
            //console.log("round: ", minRound);

            // Update asaBalances for each asset in this page
            dataJSON.assets.forEach(
              (asa) => (asaBalances[asa["asset-id"]] = asa.amount)
            );
          } else {
            console.log("error occurred for fetching account " + addresses[i]);
          }
        }

        await getPage();

        if (nextToken !== undefined) {
          for (let i = 2; i < 100 && nextToken !== undefined; i++) {
            await getPage();
          }
        }

        // Assign the accumulated balances to the respective roundBalances entry
        if (roundBalances[addresses[i]]) {
          roundBalances[addresses[i]][String(minRound)] = {
            asas: asaBalances,
            round: minRound,
          };
        } else {
          roundBalances[addresses[i]] = {
            [String(minRound)]: {
              asas: asaBalances,
              round: minRound,
            },
          };
        }

        let end = Date.now();
        console.log("Time for one address: " + (end - start) + " ms");
      }
    } catch (e) {
      console.log("error occurred for fetching account " + addresses[i]);
    }
  }
}

async function getRound() {
  let response = await fetch(INDEXER_HEALTH_URL);

  if (!response.ok) {
    console.log(
      `Failed to fetch from primary health URL, switching to alternate URL...`
    );
    response = await fetch(INDEXER_HEALTH_ALT_URL);
  }

  let dataJSON = await response.json();

  console.log("Round: " + dataJSON.round);
  return dataJSON.round;
}

function filter(address, round) {
  try {
    if (roundBalances[address][round] !== undefined) {
      return roundBalances[address][round];
    } else {
      return { message: "not found" };
    }
  } catch (e) {
    console.log(e);
    return { message: "not found" };
  }
}

function closest(address, cRound) {
  let minDif = 1000000000000;

  try {
    let winner = 0;

    Object.keys(roundBalances[address]).forEach((round) => {
      let dif = Math.abs(round - cRound);
      if (dif < minDif) {
        minDif = dif;
        winner = round;
      }
    });
    return roundBalances[address][winner];
  } catch (e) {
    console.log(e);
    return { message: "error occured" };
  }
}
