import { createRequire } from "module";
import nacl from "tweetnacl";
import algosdk from "algosdk";
import dotenv from "dotenv";
import fetch from "node-fetch";
import bannedBase from "./bannedArray.mjs";
import badBase from "./badArray.mjs";
import { INDEXER_URL, NODE_URL } from "@xballot/sdk";

bannedBase.forEach((entry, i) => {
  bannedBase[i] = entry.toLowerCase();
});

badBase.forEach((entry, i) => {
  badBase[i] = entry.toLowerCase();
});

let updated = {
  daos: 0,
  users: 0,
  banned: 0,
  primary: 0,
};

let banned = [...bannedBase, ...badBase];

const priceChart = {
  1: 100,
  2: 50,
  3: 30,
  4: 10,
  5: 1,
};

// discounts?

const require = createRequire(import.meta.url);

dotenv.config();

let daos = {};

let domains = {};

let userIndex = {};

const mnemonic = process.env.WIZARD_KEY;

let wizard = algosdk.mnemonicToSecretKey(mnemonic);

const MainNode = NODE_URL;
const indexer = INDEXER_URL;

console.log("MainNode: " + MainNode);
console.log("Indexer: " + indexer);

const token = "";
const server = MainNode;
const port = "";
const algodclient = new algosdk.Algodv2(token, server, port);

var express = require("express");
var app = express();

var fs = require("fs");

const cors = require("cors");

loadFile("backup");

app.use(cors(), express.json());

app.get("/index/:name", function (req, res) {
  switch (req.params.name) {
    case "banned":
      res.send(banned);
      break;

    case "daos":
      res.send(daos);
      break;

    case "domains":
      res.send(domains);
      break;
    case "userIndex":
      res.send(userIndex);
      break;
    case "updated":
      res.send(updated);
      break;

    default:
      res.send({ message: "not found" });
      break;
  }
});

app.post("/upload/:name", async function (req, res) {
  switch (req.params.name) {
    case "init":
      console.log(req.body);

      try {
        console.log(req.body);

        let length = req.body.domain.slice(0, 25).length;

        let price = await calcPrice(length);

        console.log("Estimated price should be " + price);
        console.log("data0.5 firing", req.body.txid, req.body.recipient, price);
        let confirmed = await confirmTxn(
          req.body.txid,
          req.body.recipient,
          price
        );

        console.log(
          "Confirmed funding for dao " + req.body.appId + ": " + confirmed
        );

        if (confirmed) {
          let assetId = await createAndSendAsset(
            parseInt(req.body.appId),
            req.body.recipient,
            req.body.domain
          );
          console.log(
            "data3 firing",
            parseInt(req.body.appId),
            req.body.recipient,
            req.body.domain
          );

          if (typeof assetId === "number") {
            updated.daos = Date.now();

            saveFile(
              "backup",
              JSON.stringify({
                daos: daos,
                banned: banned,
                domains: domains,
                userIndex: userIndex,
              })
            );

            res.send({ message: "Listed successfully!", assetId: assetId });
          } else {
            res.send({ message: "error occured" });
          }
        } else {
          res.send({ message: "payment failed" });
        }
      } catch (e) {
        console.log(e);
        res.send({ message: "Error occured" });
      }
      break;

      case "enable":

      try {
          let appId = req.body.appId
          if (daos[appId] && !daos[appId]?.enabled && req.body.recipient === daos[appId]?.creator) {

              let response = await sendAsset(daos[appId].creator, daos[appId].asset)
              if (response.txId) {
                  console.log("Sent nft response: ", response)
                  daos[appId].enabled = true

                  updated.daos = Date.now()

                  saveFile("backup", JSON.stringify({ daos: daos, banned: banned, domains: domains, userIndex: userIndex }))
                 res.send({ message: response.txId })
              }


          }
      }
      catch (e) {
          console.log(e)
          res.send({message: "error occured"})
      }
      break;

    case "removeBanned":
      try {
        let signed = req.body.signed;
        let address = req.body.address;
        let key = req.body.key;

        let deBoxed = algoVerify(signed, address);

        if (deBoxed.verified) {
          console.log("deleting " + key + " from banned...");
          let index = banned.indexOf(key);
          delete banned[index];
          updated.banned = Date.now();
          saveFile(
            "backup",
            JSON.stringify({
              daos: daos,
              banned: banned,
              domains: domains,
              userIndex: userIndex,
            })
          );
          res.send({ message: "removed" });
        }
      } catch (e) {
        console.log(e);
        res.send({ message: "error occured" });
      }

      break;
    case "changePrimary":
      try {
        let signed = req.body.signed;
        let address = req.body.address;
        let key = req.body.key;

        let deBoxed = algoVerifyUser(signed, address);

        if (deBoxed.verified) {
          console.log("changing primary app to " + key);
          let prevFirst = userIndex[address][0];
          let index2 = userIndex[address].indexOf(key);
          userIndex[address][0] = key;
          userIndex[address][index2] = prevFirst;

          updated.primary = Date.now();
          saveFile(
            "backup",
            JSON.stringify({
              daos: daos,
              banned: banned,
              domains: domains,
              userIndex: userIndex,
            })
          );
          res.send({ message: "changed" });
        }
      } catch (e) {
        console.log(e);
        res.send({ message: "error occured" });
      }

      break;
    default:
      break;
  }
});

function saveFile(name, body) {
  let newPath = "/data/db/" + name + ".txt";

  //let newPath = path.resolve(newPathBase)

  fs.writeFile(newPath, body, (err) => {
    if (err) {
      console.log("Error saving");
    } else {
      console.log("It's saved!");
      console.log("Path: ", newPath);
    }
  });
}

function loadFile(name) {
  let newPath = "/data/db/" + name + ".txt";

  if (fs.existsSync(newPath)) {
    let fileContents = fs.readFileSync(newPath);
    let obj = JSON.parse(fileContents.toString());
    //console.log(obj)
    daos = obj.daos;
    banned = obj.banned;
    domains = obj.domains;
    userIndex = obj.userIndex;
    console.log("Loaded database");
    return obj;
  } else {
    console.log("No database found. Will be created on next backup.");
    return {};
  }
}

app.listen(8888, function () {
  console.log("Node server now listening on port 8888!");
});

function appIdToMetadataHash(appId) {
  const hexString = appId.toString(16);
  const paddedHexString = hexString.padStart(64, "0");
  const metadataHash = new Uint8Array(32);
  for (let i = 0; i < metadataHash.length; i++) {
    metadataHash[i] = parseInt(paddedHexString.slice(i * 2, i * 2 + 2), 16);
  }
  return metadataHash;
}

async function sendTransactionWithRetry(
  signedTransaction,
  maxRetries = 2,
  delay = 5000
) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      let response = await algodclient
        .sendRawTransaction(signedTransaction.blob)
        .do();
      return response;
    } catch (error) {
      if (error.statusCode === 429) {
        console.log(
          `Request rate limited. Retrying after ${delay / 1000} seconds...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay)); // wait before retrying
      } else {
        throw error; // if error is not due to rate limit, rethrow it
      }
    }
  }

  throw new Error(`Failed to send transaction after ${maxRetries} attempts`);
}

async function waitForConfirmationWithRetry(
  txid,
  maxRetries = 2,
  delay = 5000
) {
  for (let i = 0; i < maxRetries; i++) {
    console.log("Waiting...", txid);
    try {
      await algosdk.waitForConfirmation(algodclient, txid, 10);
      return;
    } catch (error) {
      if (error.statusCode === 429) {
        console.log(
          `Request rate limited. Retrying after ${delay / 1000} seconds...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay)); // wait before retrying
      } else {
        throw error; // if error is not due to rate limit, rethrow it
      }
    }
  }

  throw new Error(`Failed to get confirmation after ${maxRetries} attempts`);
}

async function createAndSendAsset(appIndex = 0, recipient, domain = "") {
  console.log("createAndSendAsset fired 1");
  try {
    let metadataHash = appIdToMetadataHash(appIndex);
    console.log("Metadata Hash:", metadataHash);

    let params = await algodclient.getTransactionParams().do();

    if (!banned.includes(domain.toLowerCase())) {
      console.log("data2 firing", params);
      let createNftTxn =
        algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
          assetName: domain.slice(0, 25),
          assetURL: "template-ipfs://{ipfscid:0:dag-pb:reserve:sha2-256}",
          assetMetadataHash: metadataHash,
          clawback: wizard.addr,
          decimals: 0,
          note: undefined,
          defaultFrozen: false,
          freeze: wizard.addr,
          from: wizard.addr,
          manager: wizard.addr,
          reserve: "YG7UAFPHC34EWYGCEXEKGIVUBOQSRSFLQ3LADEDF2NWYLANHI5YS2XVRN4",
          suggestedParams: params,
          total: 1,
          unitName: "XBD",
        });

      let createSigned = algosdk.signTransaction(createNftTxn, wizard.sk);

      let response0 = await sendTransactionWithRetry(createSigned);
      console.log("createAndSendAsset fired 2", response0);
      let response2 = await algosdk.waitForConfirmation(
        algodclient,
        createSigned.txID,
        6
      );
      console.log("createAndSendAsset fired 3", response2);
      let txData = await fetch(indexer + "transactions/" + createSigned.txID);
      let txJSON = await txData.json();
      let assetId = txJSON.transaction["created-asset-index"];

      if (assetId !== undefined) {
        params = await algodclient.getTransactionParams().do();

        let appCallTxn = algosdk.makeApplicationNoOpTxn(
          wizard.addr,
          params,
          appIndex,
          [new Uint8Array(Buffer.from("enable")), algosdk.encodeUint64(assetId)]
        );

        let createSigned = algosdk.signTransaction(appCallTxn, wizard.sk);

        let appResponse = await sendTransactionWithRetry(createSigned);

        console.log(appResponse);

        banned.push(domain.slice(0, 25));

        daos[appIndex] = {
          creator: recipient,
          enabled: false,
          asset: assetId,
          domain: domain.slice(0, 25),
        };

        domains[domain.slice(0, 25)] = appIndex;

        if (typeof userIndex === "object") {
          updateUsers();
        } else {
          userIndex = {};
          updateUsers();
        }

        function updateUsers() {
          if (userIndex[recipient]) {
            userIndex[recipient].push(appIndex);
          } else {
            userIndex[recipient] = [appIndex];
          }
        }

        //console.log(daos)
        return assetId;
      }
    } else {
      throw new Error("domain name banned");
    }
  } catch (e) {
    console.log("Error while creating and sending asset:", e);
  }
}

async function confirmTxn(txid, sender, amount) {
  try {
    await waitForConfirmationWithRetry(txid);

    let txData = await fetch(indexer + "transactions/" + txid);
    console.log("txData", txData);
    let txJSON = await txData.json();
    console.log("txJSON", txJSON);
    console.log(Date.now() / 1000 - txJSON.transaction["round-time"]);
    if (
      txJSON.transaction.sender === sender &&
      txJSON.transaction["payment-transaction"].receiver === wizard.addr &&
      txJSON.transaction["payment-transaction"].amount >= amount &&
      Date.now() / 1000 - txJSON.transaction["round-time"] <= 60
    ) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function sendAsset(recipient, asset) {

  try {

      let params = await algodclient.getTransactionParams().do()


      let assetTransferTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: wizard.addr,
          to: recipient,
          amount: 1,
          suggestedParams: params,
          assetIndex: parseInt(asset),
      })

      let createSigned = algosdk.signTransaction(assetTransferTxn, wizard.sk)

      let response0 = await algodclient.sendRawTransaction(createSigned.blob).do()
      return response0
  }
  catch (e) {
      console.log(e)
  }
}

async function calcPrice(nameLength) {
  if (nameLength > 5) {
    nameLength = 5;
  }

  let data = await fetch("https://price.algoexplorerapi.io/price/algo-usd");
  let currentPrice = (await data.json()).price;

  let algoEquivalent = (priceChart[nameLength] / currentPrice) * 1000000;
  return algoEquivalent;
}

function algoVerify(signedMessageString, address) {
  console.log(signedMessageString);

  if (address === wizard.addr) {
    try {
      let signedUint = cBuffer(signedMessageString);

      console.log(signedUint);

      let pk = algosdk.decodeAddress(address);

      console.log("pk.publicKey", pk.publicKey);

      let message = nacl.sign.open(signedUint, pk.publicKey);
      console.log("message: ", message);

      let then = deBuffer(message);
      console.log("decoded message: ", then);

      let now = Date.now();

      console.log("now: ", now);

      if (Math.abs(now - then) < 10000) {
        return { verified: true, message: message };
      } else {
        return { verified: false };
      }
    } catch (e) {
      console.log(e);
      return { verified: false };
    }
  } else {
    return { verified: false };
  }
}

function algoVerifyUser(signedMessageString, address) {
  console.log(signedMessageString);

  try {
    let signedUint = cBuffer(signedMessageString);

    console.log(signedUint);

    let pk = algosdk.decodeAddress(address);

    console.log("pk.publicKey", pk.publicKey);

    let message = nacl.sign.open(signedUint, pk.publicKey);
    console.log("message: ", message);

    if (message !== null) {
      let then = deBuffer(message);
      console.log("decoded message: ", then);

      return { verified: true, message: message };
    } else {
      return { verified: false };
    }
  } catch (e) {
    console.log(e);
    return { verified: false };
  }
}

function cBuffer(text) {
  let array = [];
  for (let i = 0; i < text.length; i++) {
    array.push(text.charCodeAt(i));
  }

  let buffer = Uint8Array.from(array);
  return buffer;
}

function deBuffer(uintArray) {
  let string = "";

  uintArray.forEach((entry) => {
    string += String.fromCharCode(entry);
  });
  return string;
}

//createAndSendAsset().then(data => console.log(data))
