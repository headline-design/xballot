import algosdk from "algosdk";
import fetch from "node-fetch";
import {
  getValidVotes,
  applyRankedChoice,
  formatRoundTallies,
  voteGetter,
} from "./voting.mjs";
import {
  INDEXER_HEALTH_URL,
  INDEXER_URL,
  IPFS_URL,
  REGISTRAR_URL,
} from "@xballot/sdk";

const atob = (base64) => {
  return Buffer.from(base64, "base64").toString("binary");
};

let tokenCache = {};

const indexer = INDEXER_URL;

async function readGlobalState(index) {
  let appData = await fetch(INDEXER_URL + "applications/" + index);
  let appJSON = await appData.json();
  return appJSON.application.params["global-state"];
}

async function getSettingsObject(appId = 0) {
  try {
    let params = await readGlobalState(appId);
    let ipfsHash = "";
    let creator = "";
    let controller = "";
    let asset = "";

    params.forEach((state) => {
      if (atob(state.key) === "DaoDescription") {
        ipfsHash = state.value.bytes;
      }
      if (atob(state.key) === "Creator") {
        creator = algosdk.encodeAddress(
          Buffer.from(state.value.bytes, "base64")
        );
      }
      if (atob(state.key) === "controller") {
        controller = algosdk.encodeAddress(
          Buffer.from(state.value.bytes, "base64")
        );
      }
      if (atob(state.key) === "createdAsset") {
        asset = state.value.uint;
      }
    });

    if (ipfsHash !== "") {
      let textHash = atob(ipfsHash);
      let ipfsData = await fetch(IPFS_URL + textHash);

      if (!ipfsData.headers.get("content-type")?.includes("application/json")) {
        //console.error('Received incorrect content-type');
        return "";
      }

      let ipfsJson;
      try {
        ipfsJson = await ipfsData.json();
      } catch (error) {
        //console.error(`Error parsing response to JSON: ${error}`);
        return "";
      }

      if (
        creator &&
        (ipfsJson.creator === undefined || ipfsJson.creator === "")
      ) {
        ipfsJson.creator = creator;
      }
      if (
        controller &&
        (ipfsJson.controller === undefined || ipfsJson.controller === "")
      ) {
        ipfsJson.controller = controller;
      }
      if (asset && (ipfsJson.asset === undefined || ipfsJson.asset === "")) {
        ipfsJson.asset = asset;
      }

      return ipfsJson;
    } else {
      let ipfsJson = {};
      if (creator) {
        ipfsJson.creator = creator;
      }
      if (controller) {
        ipfsJson.controller = controller;
      }
      if (asset) {
        let data = await fetch(indexer + `assets/${asset}`);
        let dataJSON = await data.json();
        let name = dataJSON['asset']?.params.name;
        ipfsJson.asset = asset;
        ipfsJson.domain = name;
      }
      return ipfsJson;
    }
  } catch (e) {
    //console.log(e);
    return "";
  }
}

async function getRound() {
  let data = await fetch(INDEXER_HEALTH_URL);

  let dataJSON;
  try {
    dataJSON = await data.json();
  } catch (error) {
    //console.error(`Error parsing response to JSON: ${error}`);
    return "";
  }

  //console.log("Round: " + dataJSON.round)
  return dataJSON.round;
}

async function getAllOpted(appId = 155480578, max = 0, min = 0) {
  try {
    let currentRound = await getRoundCached();
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
      //console.log(fullUrl);
      let dataJSON = await data.json();

      nextToken = dataJSON["next-token"] || undefined;
      pageIndex++;
      let length = dataJSON.transactions.length;

      for (let i = 0; i < length; i++) {
        if (
          !opted.some(
            (member) => member.address === dataJSON.transactions[i].sender
          )
        ) {
          let member = {
            address: dataJSON.transactions[i].sender,
            joinedAt: new Date(dataJSON.transactions[i]["round-time"] * 1000),
          };
          opted.push(member);
        }
      }
    }

    await getPage();

    if (nextToken !== undefined) {
      for (let i = 2; i < 100 && nextToken !== undefined; i++) {
        await getPage();
      }
    }

    return opted;
  } catch (error) {
    //console.log(error);
  }
}

async function getProposalFromHash(hash) {
  try {
    let data = await fetchWithRetry(IPFS_URL + hash, 1, 1000);
    return await data.json();
  } catch (error) {
    console.error("An error occurred while fetching ipfs data: ", error);
    return null; // return null or any other value to indicate that there was an error
  }
}

async function getHistoricalVotes(appId, minRound) {
  try {
    let settings = await getSettingsObject(appId);
    //console.log("firing 1");
    let txnsArray = [];

    let pageIndex = 1;
    let nextToken = undefined;

    let url2 = "&limit=500&application-id=";

    let baseUrl = indexer + "transactions?type=appl&min-round=" + minRound;

    async function getPage() {
      let pagePiece = pageIndex !== 1 ? "&next=" + nextToken : "";
      let pageUrl = baseUrl + url2 + appId + pagePiece;

      try {
        //console.log(pageUrl)
        let data = await fetch(pageUrl);
        if (!data.ok) {
          //console.error(`HTTP error! status: ${data.status}`);
          return; // return, or handle the error in another appropriate way
        }

        let dataJSON;
        try {
          //console.log('firing 2')
          dataJSON = await data.json();
        } catch (error) {
          console.error(`Error parsing JSON: ${error}`);
          return; // return, or handle the error in another appropriate way
        }
        nextToken = dataJSON["next-token"] || undefined;
        pageIndex++;
        if (dataJSON && dataJSON.transactions) {
          txnsArray.push(...dataJSON.transactions);
        }
      } catch (error) {
        console.error(
          "An error occurred while fetching historical votes: ",
          error
        );
      }
    }

    await getPage();

    if (nextToken !== undefined) {
      for (let i = 2; i < 100 && nextToken !== undefined; i++) {
        await getPage();
      }
    }

    let voteHistory = [];

    txnsArray.forEach((txn) => {
      let time = txn["round-time"];
      let createdAt = new Date(txn["round-time"] * 1000);
      let startRound = txn["confirmed-round"];
      let txid = txn.id;
      let args = [];
      if (txn["application-transaction"]) {
        args = txn["application-transaction"]["application-args"] || [];
      }

      let decoded = [];
      args.forEach((arg) => {
        decoded.push(atob(arg));
      });
      let ipfsHash = "";
      let maxRound = 0;
      let sender = "";

      if (decoded.includes("start")) {
        sender = txn.sender;

        let dArray = txn["global-state-delta"] || [];
        dArray.forEach((obj) => {
          switch (atob(obj.key)) {
            case "pDescription":
              ipfsHash = atob(obj.value.bytes);
              break;
            case "maxRound":
              maxRound = obj.value.uint;
              break;
            default:
              break;
          }
        });

        voteHistory.push({
          time: time,
          createdAt: createdAt,
          txid: txid,
          ipfsHash: ipfsHash,
          maxRound: maxRound,
          minRound: startRound,
          settings: settings,
          creator: sender,
        });
      }
    });

    for (let i = 0; i < voteHistory.length; i++) {
      try {
        let pDescription = await getProposalFromHash(voteHistory[i].ipfsHash);
        voteHistory[i].pDescription = pDescription;

        let token = parseInt(pDescription.token);

        voteHistory[i].token = token;

        let tokenData = undefined;

        if (tokenCache[token] != undefined) {
          tokenData = tokenCache[token];
        } else {
          //console.log(" fetching data for token " + token)
          tokenData = await getTokenData(token);
          tokenCache[token] = tokenData;
        }

        voteHistory[i].tokenData = tokenData;

        let currentTime = Math.floor(Date.now() / 1000);
        let scores_state = "pending";
        if (
          currentTime >= pDescription?.start &&
          currentTime <= pDescription?.end
        ) {
          scores_state = "active";
        } else if (currentTime > pDescription?.end) {
          scores_state = "closed";
        }
        voteHistory[i].scores_state = scores_state;
      } catch (error) {
        //console.error("An error occurred while fetching data: ", error);
        //throw error;
      }
    }

    return voteHistory.reverse();
  } catch (error) {
    return [];
    //console.error("An error occurred while getting historical votes: ", error);
    //throw error;
  }
}

async function getMinMax(
  txid = "T7BZSWPTMYKVCHYAQBDDRZUXQUJTNO3URPPOKDMWIUDNW3O7T25Q"
) {
  //console.log(txid)
  try {
    let data = await fetch(indexer + "transactions/" + txid);
    let dataJSON = await data.json();
    let min = dataJSON.transaction["confirmed-round"];
    let max = 1000000000000000;
    let appState = dataJSON.transaction["global-state-delta"];

    appState.forEach((state) => {
      if (atob(state.key) === "maxRound") {
        max = state.value.uint;
        //console.log(max)
      }
    });

    return { min: min, max: max };
  } catch (e) {
    //console.log(e);
    return { min: 0, max: 1000000000000000 };
  }
}

async function getVotes(
  txid,
  appId,
  assetId,
  max,
  min,
  strategyType,
  choices,
  isFirstTimeFetch = false
) {
  if (
    txid !== null &&
    assetId !== null &&
    assetId !== undefined &&
    max !== null &&
    max !== 0 &&
    min !== null &&
    min !== 0
  ) {
    try {
      let approvalTotal = 0;
      let minMax = await getMinMax(txid);
      let dataGetter = await voteGetter(appId, assetId, minMax.max, minMax.min);
      let tallies = {};

      const votes = Object.fromEntries(
        Object.entries(dataGetter)
          .filter(([key]) => key !== "tallies" && key !== "optedIn")
          .filter(([key, voterData]) => {
            if (voterData.option) {
              try {
                return getValidVotes(voterData.option, choices, strategyType);
              } catch (error) {
                console.error(
                  "An error occurred while validating votes:",
                  error
                );
                // Handle the error appropriately (e.g., skip this entry or assign a default value)
                return false; // Return false to exclude the entry with invalid votes
              }
            }
            return false;
          })
      );

      switch (true) {
        case strategyType.text === "quadratic" ||
          strategyType.text === "weighted":
          let wChoices = choices.map((choice) => {
            return choice.choice;
          });

          //console.log("global choices: ", wChoices)

          //console.log("votes")
          //console.log(votes)

          let v = {};

          Object.keys(votes).forEach((e) => {
            let oj = convertToObj(votes[e].option);

            Object.keys(oj).forEach((percent) => {
              if (v[e] === undefined) {
                v[e] = {};
              }
              Object.assign(v[e], {
                [oj[percent]]: (Number(percent) / 100) * votes[e].votes,
              });
            });
          });

          //console.log(v)

          wChoices.forEach((choice) => {
            tallies[choice] = 0;

            Object.keys(v).forEach((addr) => {
              tallies[choice] += v[addr][choice];
            });
          });

          //console.log("tallies")
          //console.log(tallies)

          break;
        case strategyType.text === "approval":
          //console.log("approval votes")
          //console.log(votes)

          Object.keys(votes).forEach((addr) => {
            let power = votes[addr].votes;

            approvalTotal += power;

            if (power === undefined) {
              power = 0;
            }

            let votedOn = multiSplit(votes[addr].option, [","]);

            votedOn.forEach((choice) => {
              choice = choice.trim();
              if (tallies[choice]) {
                tallies[choice] += power;
              } else {
                tallies[choice] = power;
              }
            });
          });

          break;
        case strategyType.text === "ranked-choice":
          const votesArray = Object.entries(dataGetter)
            .filter(([key]) => key !== "tallies" && key !== "optedIn")
            .map(([key, value]) => value);
          //console.log(votesArray);
          const chainVotes = Object.fromEntries(
            Object.entries(dataGetter).filter(
              ([key]) => key !== "tallies" && key !== "optedIn"
            )
          );
          //console.log(chainVotes);
          const rankedChoiceResult = applyRankedChoice(votesArray, chainVotes);
          const formattedRoundTallies = formatRoundTallies(
            rankedChoiceResult.roundTallies,
            rankedChoiceResult.optionNames
          );
          //console.log("formatRoundTallies", formattedRoundTallies);

          let obj = {
            winner: rankedChoiceResult.winner,
            total: rankedChoiceResult.totalVotes,
            votes: rankedChoiceResult.votes,
            roundTallies: formattedRoundTallies,
            tallies:
              rankedChoiceResult.roundTallies[
                rankedChoiceResult.roundTallies.length - 1
              ],
          };

          //console.log("ranked:" , obj)

          return obj;

        default:
          Object.keys(votes).forEach((addr) => {
            let trimChoice = votes[addr].option.trim();
            let choice = trimChoice.toLowerCase();
            if (tallies[choice]) {
              tallies[choice] += votes[addr].votes;
            } else {
              tallies[choice] = votes[addr].votes;
            }
          });
          break;
      }

      let total = 0;

      if (strategyType.text !== "approval") {
        total = Object.values(tallies).reduce((acc, curr) => acc + curr, 0);
      } else {
        total = approvalTotal;
      }

      //console.log(tallies);

      let info = { total, tallies, votes };
      return info;
    } catch (e) {
      if (isFirstTimeFetch && e.message.includes("no votes")) {
        console.log("First time fetching and no votes found", txid);
        return { total: 0, tallies: {}, votes: {} };
      } else {
        console.log("Error occurred in tallyVotes", e, txid);
        return undefined;
      }
    }
  } else {
    if (isFirstTimeFetch) {
      // Handling the first-time fetch when there are no votes
      console.log("First time fetching and no votes found", txid);
      return { total: 0, tallies: {}, votes: {} };
    } else {
      console.log("Error occurred in tallyVotes: no votes", txid);
      return undefined;
    }
  }
}

async function getTokenData(assetId) {
  await sleep(200);

  let tokenData = {};

  try {
    let data = await fetch(indexer + `assets/${assetId}`);

    let dataJSON = await data.json();

    //console.log(dataJSON)

    let decimals = dataJSON["asset"]?.params.decimals;
    let unitName = dataJSON["asset"]?.params["unit-name"];
    let name = dataJSON["asset"]?.params.name;
    let total = dataJSON["asset"]?.params.total;

    tokenData = {
      assetId: assetId || 0,
      decimals: decimals || 0,
      unitName: unitName || "none",
      name: name || "none",
      total: total || 0,
    };
    return tokenData;
  } catch (e) {
    console.log("Error occured in getTokenData", e);
    return tokenData;
  }
}

async function getBalances(address, assetArray = [], all = false) {
  try {
    let baseUrl = indexer + "accounts/";

    let data = await fetch(baseUrl + address);
    let dataJSON = await data.json();

    let algos = dataJSON.account.amount;

    let assets = {};

    if (dataJSON.account?.assets) {
      dataJSON.account.assets.forEach((aobject) => {
        if (!all) {
          if (assetArray.includes(aobject["asset-id"])) {
            assets[aobject["asset-id"]] = aobject.amount;
          }
        } else {
          assets[aobject["asset-id"]] = aobject?.amount || 0;
        }
      });
    }

    return {
      algo: algos,
      assets: assets,
    };
  } catch (e) {
    //console.log(e)
    return {
      algo: 0,
      assets: {},
    };
  }
}

async function getUserProposals(ana, assetId, amount, minRound, reports) {
  if (typeof ana === "number") {
    if (minRound === undefined) {
      minRound = 0;
    }
    let currentRound = await getRoundCached();
    let address = algosdk.getApplicationAddress(parseInt(ana));
    let asaBalance = null;
    let txnsArray = {
      proposals: {},
    };
    let pageIndex = 1;
    let nextToken = undefined;

    let url2 = "limit=500&" + "min-round=" + minRound + "&type=pay&address=";
    let baseUrl = indexer + "transactions?";

    async function getPage() {
      let pagePiece = pageIndex !== 1 ? "&next=" + nextToken : "";
      let pageUrl = baseUrl + url2 + address + pagePiece;
      let data = await fetch(pageUrl);

      if (!data.ok) {
        //console.error(`HTTP error! status: ${data.status}`);
        return; // return, or handle the error in another appropriate way
      }

      let dataJSON;
      try {
        dataJSON = await data.json();
      } catch (error) {
        console.error(`Error parsing JSON: ${error}`);
        return; // return, or handle the error in another appropriate way
      }
      nextToken = dataJSON["next-token"] || undefined;
      pageIndex++;

      for (let i = 0; i < dataJSON.transactions.length; i++) {
        //console.log("parsing post " + i);
        let txn = dataJSON.transactions[i];
        let message = "";
        let postData = "";
        let threadData = "";
        let actionType = "";
        let ipfsHash = false;

        try {
          message = atob(txn.note);
          ipfsHash = message.length === 46 && message.startsWith("Qm");
          if (!ipfsHash) {
            threadData = JSON.parse(message);
          }
        } catch (error) {
          //console.error(`Failed to decode message for transaction ${txn.id}: ${error}`);
          continue;
        }

        // Perform balance check only when threadData.type is not "report" and threadData.proposalId is not present
        if (
          assetId !== null &&
          amount !== null &&
          threadData.type !== "report" &&
          !threadData.proposalId
        ) {
          let balances = await getBalances(txn.sender, [parseInt(assetId)]);
          asaBalance = balances.assets[assetId.toString()];
        }

        let template = {
          sender: txn.sender,
          timeStamp: txn["round-time"],
          roundStamp: currentRound,
          id: txn.id,
        };

        if (ipfsHash) {
          postData = await getProposalFromHash(ipfsHash && message);
          txnsArray[txn.id] = {
            thread: {},
            data: postData,
            type: "post",
            ...template,
          };
        } else {
          try {
            if (threadData.type === "report") {
              let appId;
              let txnId = txn.id;

              if (
                threadData.properties &&
                typeof threadData.properties === "object" &&
                !Array.isArray(threadData.properties)
              ) {
                appId = threadData.properties.appId;
              }
              if (!reports[appId]) {
                reports[appId] = {};
              }

              reports[appId][txnId] = {
                data: threadData,
                type: "report",
                ...template,
              };
            }
            if (threadData.proposalId) {
              txnsArray.proposals[txn.id] = threadData;
              threadData.id = txn.id;
              //console.log(txnsArray.proposals[txn.id])
            } else if (asaBalance >= parseInt(amount)) {
              txnsArray[txn.id] = {
                data: threadData,
                type: "thread",
                ...template,
              };
            }
          } catch (error) {
            //console.error(`Failed to parse message for transaction ${txn.id}: ${error}`);
            continue;
          }
        }
      }
    }

    await getPage();
    if (nextToken !== undefined) {
      for (let i = 2; i < 100 && nextToken !== undefined; i++) {
        await getPage();
      }
    }

    let keys = Object.keys(txnsArray);

    keys.forEach((key) => {
      try {
        let postId = txnsArray[key].data.postId;

        if (txnsArray[key].type !== "post" && postId) {
          txnsArray[postId].thread[key] = { ...txnsArray[key] };
          delete txnsArray[key];
        }
      } catch (e) {}
    });

    txnsArray = processThreads(txnsArray);
    return txnsArray;
  } else {
    //alert(
    //"error occurred for app id " + ana + " which is type of " + typeof ana
    //);
    return {};
  }
}

async function getUserDomains(addr) {
  let data = await fetch(REGISTRAR_URL + "index/userIndex");
  let dataJSON = await data.json();
  if (dataJSON[addr] && !all) {
    return dataJSON[addr];
  } else {
    return [];
  }
}

function fetchWithRetry(url, maxRetries, timeout) {
  return new Promise((resolve, reject) => {
    const fetchWithTimeout = (url, retriesLeft) => {
      fetch(url)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          if (retriesLeft > 0) {
            setTimeout(() => {
              fetchWithTimeout(url, retriesLeft - 1);
            }, timeout);
          } else {
            reject(error);
          }
        });
    };

    fetchWithTimeout(url, maxRetries);
  });
}

function calculateVoteTally(votes, strategyType, choices) {
  let tallies = {};

  switch (strategyType.text) {
    case "quadratic":
    case "weighted":
      choices.forEach((choice) => {
        tallies[choice.choice] = 0;
        Object.keys(votes).forEach((addr) => {
          tallies[choice.choice] +=
            (Number(votes[addr][choice.choice]) / 100) * votes[addr].votes;
        });
      });
      break;
    case "approval":
      Object.keys(votes).forEach((addr) => {
        let power = votes[addr].votes || 0;
        let votedOn = votes[addr].option
          .split(",")
          .map((choice) => choice.trim());
        votedOn.forEach((choice) => {
          if (tallies[choice]) {
            tallies[choice] += power;
          } else {
            tallies[choice] = power;
          }
        });
      });
      break;
    default:
      Object.keys(votes).forEach((addr) => {
        if (votes[addr].option !== undefined) {
          let trimChoice = votes[addr].option.trim();
          let choice = trimChoice.toLowerCase();
          if (tallies[choice]) {
            tallies[choice] += votes[addr].votes;
          } else {
            tallies[choice] = votes[addr].votes;
          }
        } else {
          console.error(
            `'option' property of vote at address ${addr} is undefined.`
          );
        }
      });
      break;
  }
  return tallies;
}

async function fetchProfileResponse() {
  let response = await fetch(REGISTRAR_URL + "index/userIndex");
  return response.json();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

var multiSplit = function (str, delimeters) {
  var result = [str];
  if (typeof delimeters == "string") delimeters = [delimeters];
  while (delimeters.length > 0) {
    for (var i = 0; i < result.length; i++) {
      var tempSplit = result[i].split(delimeters[0]);
      result = result
        .slice(0, i)
        .concat(tempSplit)
        .concat(result.slice(i + 1));
    }
    delimeters.shift();
  }
  return result;
};

function convertToObj(string) {
  string = string.replace(/for/g, "");

  let array = multiSplit(string, ["%", ","]);
  let obj = {};
  for (let i = 0; i < array.length; i += 2) {
    obj[array[i]] = array[i + 1].trim();
  }
  return obj;
}

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

function mergeAndModifyTxns(portals, appId, posts) {
  let txnsArray = { ...portals[appId].posts, ...posts };

  let keys = Object.keys(txnsArray);

  keys.forEach((key) => {
    try {
      let postId = txnsArray[key].data.postId;

      if (txnsArray[key].type !== "post" && postId) {
        txnsArray[postId].thread[key] = { ...txnsArray[key] };
        delete txnsArray[key];
      }
    } catch (e) {
      console.error(e);
    }
  });

  return txnsArray;
}

function processThreads(txnsArray) {
  let postKeys = Object.keys(txnsArray);

  postKeys.forEach((key) => {
    let thread = txnsArray[key].thread;

    if (thread) {
      Object.keys(thread).forEach((commentKey) => {
        if (thread[commentKey].data.commentId) {
          let replyId = thread[commentKey].data.commentId;

          if (thread[replyId]?.subThread !== undefined) {
            Object.assign(thread[replyId].subThread, {
              [commentKey]: thread[commentKey],
            });
          } else {
            if (thread[replyId] !== undefined) {
              thread[replyId].subThread = {};
              Object.assign(thread[replyId].subThread, {
                [commentKey]: thread[commentKey],
              });
            }
          }
          delete thread[commentKey];
        }
      });
    } else {
      //console.log("no thread", txnsArray[key]);
    }
  });

  return txnsArray;
}

let getProfileResponseCached = cacheFunction(fetchProfileResponse, 30000);
let getRoundCached = cacheFunction(getRound, 4000);

export {
  getSettingsObject,
  getUserDomains,
  getVotes,
  getTokenData,
  getAllOpted,
  getHistoricalVotes,
  getRound,
  getProposalFromHash,
  getMinMax,
  getUserProposals,
  getProfileResponseCached,
  getRoundCached,
  cacheFunction,
  fetchProfileResponse,
  calculateVoteTally,
  mergeAndModifyTxns,
  processThreads,
};
