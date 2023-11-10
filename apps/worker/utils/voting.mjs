import fetch from "node-fetch";
import {
  getSettingsObject,
  getRoundCached,
  getProfileResponseCached,
} from "./utils.mjs";
import { BALANCE_INDEXER_URL, INDEXER_URL } from "@xballot/sdk";
import {
  parseQuadraticVotes,
  parseWeightedVotes,
  parseRankedChoiceVotes,
  parseApprovalVotes,
  parseSingleChoiceVotes,
  parseOpenVotes,
} from "./parseVoting.mjs";

const atob = (base64) => {
  return Buffer.from(base64, "base64").toString("binary");
};



async function voteGetter(appId, assetId, max, min) {
  try {
    let profileData = await getProfileResponseCached();
    let currentRound = await getRoundCached();
    if (currentRound < max) {
      max = currentRound;
    }

    let opted = {
      tallies: {},
      optedIn: [],
    };

    let pageIndex = 1;
    let nextToken = undefined;
    let roundUrl = "&min-round=" + min + "&max-round=" + max;
    let url2 = "limit=500&application-id=";
    let baseUrl = INDEXER_URL + "transactions?";

    // Create cache objects
    let settingsCache = {};
    let profileDataCache = {};
    let delegationsBalance = {};

    // Preprocess profileData to store it in cache
    for (let sender in profileData) {
      if (profileData.hasOwnProperty(sender)) {
        profileDataCache[sender] = profileData[sender][0];
      }
    }

    // Check for delegations in each user profile
    for (let sender in profileDataCache) {
      let senderProfile = profileDataCache[sender];
      let settings = await getSettingsObject(senderProfile); // Get settings
      let delegations = settings?.delegations; // Get delegations
      if (Array.isArray(delegations)) {
        for (let delegation of delegations) {
          // If the delegation is for the current app and has not expired
          if (
            (delegation.appId == appId || delegation.appId === null) &&
            delegation.round < max
          ) {
            let delegate = delegation.delegate;
            if (!delegationsBalance.hasOwnProperty(delegate)) {
              delegationsBalance[delegate] = 0; // Initialize delegate balance
            }
            let balance = await getBalance(sender, assetId, max); // Get delegator balance
            delegationsBalance[delegate] += balance; // Add delegator balance to delegate balance
          }
        }
      }
    }

    async function getPage() {
      let pagePiece = pageIndex !== 1 ? "&next=" + nextToken : "";
      let fullUrl = baseUrl + url2 + appId + roundUrl + pagePiece;
      let data;
      try {
        data = await fetch(fullUrl);
        if (!data.ok) {
          //console.error(`HTTP error! status: ${data.status}`);
          return;
        }
      } catch (err) {
        console.error("Failed to fetch data: ", err);
        return;
      }

      let dataJSON;
      try {
        dataJSON = await data.json();
      } catch (err) {
        console.error("Failed to parse JSON: ", err);
        return;
      }

      nextToken = dataJSON["next-token"] || undefined;
      pageIndex++;
      let length = dataJSON.transactions?.length;

      for (let i = 0; i < length; i++) {
        let sender = dataJSON.transactions[i].sender;
        if (!opted.hasOwnProperty(sender)) {
          opted[sender] = {};
        }

        let hasDelegated = false; // New variable to track delegation status

        if (profileDataCache.hasOwnProperty(sender)) {
          let senderProfile = profileDataCache[sender];
          if (!settingsCache.hasOwnProperty(sender)) {
            settingsCache[sender] = await getSettingsObject(senderProfile);
          }
          let settings = settingsCache[sender];
          let userAppDelegations = settings?.delegations;
          if (Array.isArray(userAppDelegations)) {
            for (let delegation of userAppDelegations) {
              if (
                (delegation.appId == appId || delegation.appId === null) &&
                delegation.round < max
              ) {
                //console.log( `Sender ${sender} has delegated their voting power - has 0 voting power.`);
                hasDelegated = true;
                break;
              }
            }
          }
        }

        if (hasDelegated) continue;

        let args =
          dataJSON.transactions[i]["application-transaction"][
            "application-args"
          ];

        args.forEach((arg, j) => {
          args[j] = atob(arg);
        });

        if (args[0] === "vote") {
          let balance = await getBalance(sender, assetId, max);
          //console.log("balance", balance);
          if (delegationsBalance.hasOwnProperty(sender)) {
            balance += delegationsBalance[sender]; // Add delegated balance to the voter's balance
          }
          if (balance !== null) {
            let stringData = args.toString();
            let cleanData = stringData.replace("vote,", "");
            let signature = dataJSON.transactions[i].signature.sig;
            let txid = dataJSON.transactions[i].id;
            let votedAt = new Date(dataJSON.transactions[i]["round-time"] * 1000);

            opted[sender] = {
              votes: balance,
              option: cleanData,
              signature: signature,
              txid: txid,
              votedAt: votedAt,
            };

            let option = args[1].toLowerCase();

            if (opted.tallies.hasOwnProperty(option)) {
              opted.tallies[option] += balance;
            } else {
              opted.tallies[option] = balance;
            }
          }
        }
      }
    }

    await getPage();

    while (nextToken !== undefined) {
      await getPage();
    }

    return opted;
  } catch (e) {
    console.log("getVotes", e);
  }
}

async function getBalance(address, asset, round, retries = 3) {
  while (retries > 0) {
    try {
      let response = await fetch(
        BALANCE_INDEXER_URL +
          "balances/filter?address=" +
          address +
          "&round=" +
          round +
          "&closest=true"
      );
      if (!response.ok) {
        console.log(`HTTP error! status: ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let dataJSON = await response.json();
      let assets = dataJSON.asas || {};

      // Asset amount is directly accessed from the assets object
      let amount = assets[asset] || 0;

      return amount;
    } catch (e) {
      if (e.code === "ECONNRESET" || e.message.startsWith("HTTP error")) {
        console.log("getBalance retrying after 1 second");
        await new Promise((res) => setTimeout(res, 1000));
      } else {
        return null; // there was an error in processing the data
      }
    }
    retries--;
  }

  console.error("getBalance failed after 3 retries");
  return null;
}

function getValidVotes(voteOption, choices, strategyType) {
  const choiceSet = new Set(choices.map((choiceObj) => choiceObj.choice));

  const strategyHandlers = {
    quadratic: parseQuadraticVotes,
    weighted: parseWeightedVotes,
    "ranked-choice": parseRankedChoiceVotes,
    approval: parseApprovalVotes,
    "single-choice": parseSingleChoiceVotes,
    open: parseOpenVotes,
    basic: parseSingleChoiceVotes,
  };

  const handler =
    strategyHandlers[strategyType?.text] ||
    parseSingleChoiceVotes;
  const parsedData = handler(voteOption, choiceSet);

  return parsedData || false;
}

function formatRoundTallies(roundTallies, optionNames) {
  const roundResults = [];

  roundTallies.forEach((tally, index) => {
    const sortedOptions = Object.entries(tally).sort((a, b) => b[1] - a[1]);

    const roundResult = {
      round: index + 1,
      tallies: {},
    };

    let rank = 1;
    Object.keys(tally).forEach((option) => {
      if (optionNames[option]) {
        roundResult.tallies[optionNames[option]] = {
          rank: rank,
          votes: tally[option],
          name: optionNames[option],
        };
        rank++;
      }
    });

    roundResults.push(roundResult);
  });

  return roundResults;
}

function applyRankedChoice(votesArray, chainVotes) {
  // Extract option names from the votesArray
  const optionNames = {};
  votesArray.forEach((voteData) => {
    if (voteData.option) {
      voteData.option.split(", ").forEach((optionText) => {
        const matches = optionText.match(
          /\(([1-9][0-9]*)(?:st|nd|rd|th)\) (.+)/
        );
        if (matches) {
          //console.log(`Found match: ${matches[1]} - ${matches[2]}`);
          optionNames[matches[2]] = matches[1];
        } else {
          console.log(`No match found for: ${optionText}`);
        }
      });
    }
  });


// Helper function to parse vote data
function parseVoteData(voteData) {
  if (voteData.option) {
    const choice = voteData.option.split(", ")
      .map((choice) => {
        const match = choice.match(/\(([1-9][0-9]*)(?:st|nd|rd|th)\) (.+)/);
        if (match) {
          return match[2];
        }
        return null;
      })
      .filter((choice) => choice !== null);
    const balance = voteData.votes;
    return {
      choice: choice,
      balance: balance,
    };
  } else {
    return {
      choice: [],
      balance: 0,
    };
  }
}


  // Convert vote data to RankedChoiceVote objects
  const votes = votesArray.map(parseVoteData);
  const totalVotes = votes.reduce((total, vote) => total + vote.balance, 0);

  // Replace the remainingOptions initialization
  let remainingOptions = new Set(Object.keys(optionNames));
  let roundTallies = [];

  while (remainingOptions.size > 1) {
    const currentRoundTallies = {};
    remainingOptions.forEach((option) => (currentRoundTallies[option] = 0));

    votes.forEach((vote) => {
      const topOption = vote.choice.find((option) =>
        remainingOptions.has(option)
      );
      if (topOption) {
        currentRoundTallies[topOption] += vote.balance;
      }
    });

    roundTallies.push(currentRoundTallies);

    const sortedOptions = Object.entries(currentRoundTallies).sort(
      (a, b) => b[1] - a[1]
    );

    const winner = sortedOptions[0][0];
    const maxVotes = sortedOptions[0][1];

    if (maxVotes > totalVotes / 2) {
      return {
        winner: winner,
        totalVotes,
        roundTallies,
        optionNames,
        votes: chainVotes,
      };
    }

    const minVotes = sortedOptions[sortedOptions.length - 1][1];
    const eliminatedOptions = new Set(
      sortedOptions
        .filter(([option, votes]) => votes === minVotes)
        .map(([option]) => option)
    );

    eliminatedOptions.forEach((option) => {
      remainingOptions.delete(option);
    });

    votes.forEach((vote) => {
      vote.choice = vote.choice.filter(
        (option) => !eliminatedOptions.has(option)
      );
    });
  }

  const winner = remainingOptions.values().next().value;
  return {
    winner: winner,
    totalVotes,
    roundTallies,
    optionNames,
    votes: chainVotes,
  };
}

export { getValidVotes, applyRankedChoice, formatRoundTallies, voteGetter };
