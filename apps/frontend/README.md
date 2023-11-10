# Getting index of all apps

## Centralized method

fetch `"backend domain here" + "/index/daos"`

## Decentralized method

get all app calls from the "wizard" address

#### Getting historical votes

get app calls with application argument `"start"`, which triggers a new voting session. The first round is the confirmed round of this transaction. The last round is global delta for this transaction `entry.value.uint`

historical vote proposal indexer can be found in `src/getHistorical.js`

#### Getting historical vote tallies

All transactions to a given app within a given round are fetched. The balance of a specified token is then fetched for each address at the last available round. The app local state byte value with the key `"prop1"` is also extracted from the historical account info . The balance is equal to the votes and is added to the cumulative value of the key.

```jsx
async function voteGetter(appId = 155480578, assetId=10458941,max=100000000,min=0) {

  try {

    let currentRound = await getRound();

    if (currentRound < max) {
      max = currentRound;
    }

    let opted = {
      tallies: {},
    };

    let pageIndex = 1;

    let nextToken = undefined

    let roundUrl = '&min-round=' + min + '&max-round=' + max;

    let url2 = 'limit=500&application-id=';

    let baseUrl = 'https://testnet-idx.algonode.cloud/v2/transactions?';

    async function getPage() {
      let pagePiece = (pageIndex !== 1) ? "&next=" + nextToken : ""
      let fullUrl = baseUrl + url2 + appId + roundUrl + pagePiece
      console.log(fullUrl)
      let data = await fetch(fullUrl);
      let dataJSON = await data.json();

      //console.log(dataJSON);
      nextToken = dataJSON["next-token"] || undefined
      pageIndex++;
      let length = dataJSON.transactions.length;

      for (let i = 0; i < length; i++) {
        if (!Object.keys(opted).includes(dataJSON.transactions[i].sender)) {
          let data = await getAsaBalance(
            assetId,
            dataJSON.transactions[i].sender,
            max,
            parseInt(appId,10),
          );
          opted[dataJSON.transactions[i].sender] = { votes: 0, option: '' };
          opted[dataJSON.transactions[i].sender].votes = data.votes;
          opted[dataJSON.transactions[i].sender].option = data.option;
          if (Object.keys(opted.tallies).includes(data.option.toLowerCase())) {
            opted.tallies[data.option.toLowerCase()] += data.votes;
          } else {
            opted.tallies[data.option.toLowerCase()] = data.votes;
          }
        }
      }
    }

    await getPage();

    if (nextToken !== undefined) {
      //console.log('detected multiple pages');
      for (let i = 2; (i < 100 && nextToken !== undefined); i++) {
        //console.log(nextToken)
        //console.log('getting next page');
        await getPage();
      }
    }

    return opted;
  } catch (e) {
    //console.log(e);
  }
}

async function getAsaBalance(asa, address, proposal?.maxRound, appId) {
  //comment out asa below for production

  //asa = 553286659

  try {
    let roundUrl = 'round=' + round;

    let baseUrl = 'https://testnet-idx.algonode.cloud/v2/accounts/' + address + '?';

    let totalUrl = baseUrl + roundUrl;

    console.log(totalUrl);

    let data = await fetch(totalUrl);
    let dataJSON = await data.json();

    let found = false;

    let foundApp = false;

    let option = '';

    let assets = dataJSON?.account.assets;

    let appStates = dataJSON?.account['apps-local-state'];

    let asaBalance = 0;

    console.log(dataJSON);

    console.log('assets', assets);

    for (let i = 0; i < appStates.length && foundApp === false; i++) {
      if (appStates[i].id === appId) {
        try {
          let states = appStates[i]['key-value'];
          console.log('states', states);
          states.forEach((state) => {
            if (state.key === 'cHJvcDE=') {
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
      if (assets[i]['asset-id'] === asa) {
        found = true;
        asaBalance = assets[i].amount;
      }
    }

    return { votes: asaBalance, option: option };
  } catch (e) {
    console.log(e);
    return { asaBalance: 0, option: '' };
  }
}
```
