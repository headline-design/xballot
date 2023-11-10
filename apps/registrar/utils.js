import { INDEXER_URL } from "@xballot/sdk";

async function getAsaBalance(asa, address, round, appId) {
  //comment out asa below for production

  //asa = 553286659

  try {
    let roundUrl = "round=" + round;

    let baseUrl =
      INDEXER_URL + "accounts/" + address + "?";

    let totalUrl = baseUrl + roundUrl;

    console.log(totalUrl);

    let data = await fetch(totalUrl);
    let dataJSON = await data.json();

    let found = false;

    let foundApp = false;

    let option = "";

    let assets = dataJSON?.account.assets;

    let appStates = dataJSON?.account["apps-local-state"];

    let asaBalance = 0;

    console.log(dataJSON);

    console.log("assets", assets);

    for (let i = 0; i < appStates.length && foundApp === false; i++) {
      if (appStates[i].id === appId) {
        try {
          let states = appStates[i]["key-value"];
          console.log("states", states);
          states.forEach((state) => {
            if (state.key === "cHJvcDE=") {
              option = window.atob(state.value.bytes);
              foundApp = true;
            }
          });
        } catch (e) {
          console.log(e);
        }
      }
    }

    for (let i = 0; i < assets.length && found === false; i++) {
      if (assets[i]["asset-id"] === asa) {
        found = true;
        asaBalance = assets[i].amount;
      }
    }

    return { votes: asaBalance, option: option };
  } catch (e) {
    console.log(e);
    return { asaBalance: 0, option: "" };
  }
}

async function voteGetter(appId = 552635992, max = 26032190, assetId) {
  let min = max - 21600;

  let opted = {
    tallies: {},
  };

  let pageIndex = 1;
  let pageCount = 1;

  let roundUrl = "&min-round=" + min + "&max-round=" + max;

  let url2 = "&limit=50000&application-id=";

  let baseUrl = INDEXER_URL + "transactions?page=";

  async function getPage() {
    let data = await fetch(baseUrl + pageIndex + url2 + appId + roundUrl);
    let dataJSON = await data.json();
    pageCount = dataJSON["num-total-pages"];
    console.log("page count: ", pageCount);
    console.log(dataJSON);
    let length = dataJSON.transactions.length;

    for (let i = 0; i < length; i++) {
      if (!Object.keys(opted).includes(dataJSON.transactions[i].sender)) {
        let data = await getAsaBalance(
          assetId,
          dataJSON.transactions[i].sender,
          max,
          parseInt(appId)
        );
        opted[dataJSON.transactions[i].sender] = { votes: 0, option: "" };
        opted[dataJSON.transactions[i].sender].votes = data.votes;
        opted[dataJSON.transactions[i].sender].option = data.option;
        if (Object.keys(opted.tallies).includes(data.option)) {
          opted.tallies[data.option] += data.votes;
        } else {
          opted.tallies[data.option] = data.votes;
        }
      }
    }
    console.log(opted);
  }

  await getPage();

  if (pageCount > 1) {
    console.log("detected multiple pages");
    for (let i = 2; i <= pageCount; i++) {
      console.log("getting page " + pageIndex + " of " + pageCount);
      await getPage();
      pageIndex++;
    }
  }
}
