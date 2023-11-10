
async function getAsaBalance(asa, address, appId, round) {
    //comment out asa below for production
    //console.log(asa)
    //if ( round === 0 ) {
    //console.log([asa, address, round, appId])
    //}

    let roundUrl = "round=" + round;
    let baseUrl = indexer + "accounts/" + address + "?";

    let totalUrl = baseUrl + roundUrl;
    try {
      //console.log(totalUrl);

      let data = await fetch(totalUrl);
      //console.log(totalUrl)
      let dataJSON = await data.json();

      let found = false;

      let foundApp = false;

      let option = "";

      let assets = dataJSON?.account.assets;

      let appStates = dataJSON?.account["apps-local-state"];

      let asaBalance = 0;

      for (let i = 0; i < appStates.length && foundApp === false; i++) {
        if (appStates[i].id === appId) {
          try {
            let states = appStates[i]["key-value"];
            states.forEach((state) => {
              if (state.key === "cHJvcDE=") {
                option = atob(state.value.bytes);
                //console.log(option)
                foundApp = true;
              }
            });
          } catch (e) {
            //console.log(e);
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
      ////console.log('current', e);
      return { asaBalance: 0, option: "hello world" };
    }
  }

  async function confirmTxn(txid, sender, amount) {
    try {
      await algosdk.waitForConfirmation(algodclient, txid, 10);

      let txData = await fetch(indexer + "transactions/" + txid);
      let txJSON = await txData.json();
      return (
        txJSON.transaction.sender === sender &&
        txJSON.transaction["payment-transaction"].receiver === wizard.addr &&
        txJSON.transaction["payment-transaction"].amount >= amount &&
        Date.now() / 1000 - txJSON.transaction["round-time"] <= 60
      );
    } catch (error) {
      //console.log(error);
      return false;
    }
  }

  async function calcPrice(nameLength) {
    if (nameLength > 5) {
      nameLength = 5;
    }

    let data = await fetch("https://price.xplorerapi.io/price/algo-usd");
    let currentPrice = (await data.json()).price;

    let algoEquivalent = (priceChart[nameLength] / currentPrice) * 1000000;
    return algoEquivalent;
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