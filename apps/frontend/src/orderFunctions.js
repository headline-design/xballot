import Pipeline from '@pipeline-ui-2/pipeline/index';
import algosdk from 'algosdk';
import toast from 'react-hot-toast';
import { getEndpoints } from 'utils/endPoints';
import { getBalances } from 'utils/functions';
import { shorten } from 'helpers/utils';

//const wizard = 'PKTWYZJM6PGXQ4LHTBUOZKAG5DIVIWQCAYAJGSN6HYF7THWL4BPVBN3J5I';
//wizard hex = 0x7bcacb3e048390a351ddb4a7fbfaaa87bad1327e8f80ec7a18cce22890d592dc
//use node hexAddrGen.mjs to generate new hexes for teal contract

const endPoints = getEndpoints();
const MainNode = endPoints.node;

const token = '';
const server = MainNode;
const port = '';

async function getRound() {
  const endPoints = getEndpoints();

  let data = await fetch(endPoints.indexerHealth);
  let dataJSON = await data.json();
  return dataJSON.round;
}

async function salvage(nftId, assetId, appId, userInfo) {
  let appAddress = algosdk.getApplicationAddress(appId);
  let txid = await Pipeline.appCall(
    appId,
    ['salvage'],
    [appAddress],
    [parseInt(nftId), parseInt(assetId)],
  );
  //console.log(txid);

  if (txid !== 'undefined') {
    return txid;
  }
}

async function checkMyAsaOpt(asa, address, amount = false) {
  const endPoints = getEndpoints();
  let data = await fetch(endPoints.indexer + 'accounts/' + address);
  let dataJSON = await data.json();
  let asaBalance = 0;
  let detected = false;
  if (dataJSON.account.assets !== undefined) {
    dataJSON.account.assets.forEach((element) => {
      if (element['asset-id'] === asa) {
        asaBalance = element.amount;
        detected = true;
      }
    });
    return !amount ? detected : asaBalance;
  } else {
    return !amount ? false : asaBalance;
  }
}

const main = (wizardHex) => `#pragma version 8
// check if the app is being created
// if so save creator
int 0
txn ApplicationID
==
bz not_creation
byte "Creator"
txn Sender
app_global_put
byte "controller"
txn Sender
app_global_put
byte "index"
int 0
app_global_put
int 1
return
not_creation:
// check if this is deletion
int DeleteApplication
txn OnCompletion
==
bz not_deletion
//check if deletor is creator
byte "Creator"
app_global_get
txn Sender
==
bz failed
int 1
return
not_deletion:
//---
// check if this is update
int UpdateApplication
txn OnCompletion
==
bz not_update
byte "Creator"
app_global_get
txn Sender
==
bz failed
int 1
return
not_update:
// check for closeout
int CloseOut
txn OnCompletion
==
bnz close_out
//start the vote
txna ApplicationArgs 0
byte "start"
==
bnz start
//register
txna ApplicationArgs 0
byte "register"
==
bnz register
//vote
txna ApplicationArgs 0
byte "vote"
==
bnz vote
txna ApplicationArgs 0
byte "describe"
==
bnz describe
txna ApplicationArgs 0
byte "pdescribe"
==
bnz pdescribe
txna ApplicationArgs 0
byte "transfer"
==
bnz transfer
txna ApplicationArgs 0
byte "enable"
==
bnz enable
txna ApplicationArgs 0
byte "control"
==
bnz setControl
transfer:
byte "Creator"
app_global_get
txn Sender
==
bz failed
byte "Creator"
txna Accounts 1
app_global_put
int 1
return
enable:
global GroupSize
int 1
==
bz failed
byte ${wizardHex}
gtxn 0 Sender
==
bz failed
byte "createdAsset"
txna ApplicationArgs 1
btoi
app_global_put
byte "enabled"
int 1
app_global_put
int 1
return
pdescribe:
byte "Creator"
app_global_get
txn Sender
==
byte "controller"
app_global_get
txn Sender
==
||
bz failed
byte "pDescription"
txna ApplicationArgs 1
app_global_put
int 1
return
describe:
//byte "desc"
//byte "testing box"
//box_put
byte "Creator"
app_global_get
txn Sender
==
byte "controller"
app_global_get
txn Sender
==
||
bz failed
byte "DaoDescription"
txna ApplicationArgs 1
app_global_put
int 1
return
vote:
global Round
byte "maxRound"
app_global_get
<
bz failed
byte "index"
app_global_get
int 0
byte "index"
app_local_get
!=
bz failed
int 0
byte "index"
byte "index"
app_global_get
app_local_put
int 0
byte "prop1"
txna ApplicationArgs 1
app_local_put
int 1
return
setControl:
byte "Creator"
app_global_get
txn Sender
==
bz failed
//txn Sender
//txn Accounts 1
//!=
//bz failed
byte "controller"
txn Accounts 1
app_global_put
int 1
return
start:
//check if creator has nft
//txn Sender
//byte "createdAsset"
//app_global_get
//asset_holding_get AssetBalance
//pop
//int 0
//>
txn Sender
byte "Creator"
app_global_get
==
txn Sender
byte "controller"
app_global_get
==
||
bz failed
byte "maxRound"
app_global_get
global Round
<
bz failed
byte "maxRound"
txna ApplicationArgs 2
btoi
app_global_put
byte "pDescription"
txna ApplicationArgs 1
app_global_put
byte "index"
int 1
byte "index"
app_global_get
+
app_global_put
int 1
return
register:
int OptIn
txn OnCompletion
==
bz failed
int 0
byte "delegateVote"
byte "null"
app_local_put
int 0
byte "index"
int 0
app_local_put
int 0
byte "reinforcement"
int 0
app_local_put
int 1
return
//call if this is a closeout op
close_out:
int 1
return
failed:
int 0
return
finished:
int 1
return`;

const clear = `#pragma version 8
int 1
return`;

async function getAsaBalance(asa, address, round, appId) {
  //comment out asa below for production
  //asa = 553286659

  try {
    const endPoints = getEndpoints();
    let roundUrl = 'round=' + round;
    let baseUrl = endPoints.indexer + 'accounts/' + address + '?';
    let totalUrl = baseUrl + roundUrl;

    let data = await fetch(totalUrl);
    let dataJSON = await data.json();

    let found = false;
    let foundApp = false;
    let option = '';
    let assets = dataJSON?.account.assets;
    let appStates = dataJSON?.account['apps-local-state'];
    let asaBalance = 0;

    for (let i = 0; i < appStates.length && foundApp === false; i++) {
      if (appStates[i].id === appId) {
        try {
          let states = appStates[i]['key-value'];
          states.forEach((state) => {
            if (state.key === 'cHJvcDE=') {
              option = window.atob(state.value.bytes);
              foundApp = true;
            }
          });
        } catch (e) {
          // handle errors in states.forEach()
        }
      }
    }

    if (Pipeline.main) {
      for (let i = 0; i < assets.length && found === false; i++) {
        if (assets[i]['asset-id'] === asa) {
          found = true;
          asaBalance = assets[i].amount;
        }
      }
    } else {
      asaBalance = dataJSON.account.amount;
    }

    return { votes: asaBalance, option: option };
  } catch (e) {
    return { asaBalance: 0, option: '' };
  }
}

async function voteGetter(
  appId = 155480578,
  assetId = 10458941,
  max = 100000000,
  min = 0,
  optedOnly = true,
) {
  try {
    const endPoints = getEndpoints();
    let currentRound = await getRound();

    if (currentRound < max) {
      max = currentRound;
    }

    let opted = {
      tallies: {},
      optedIn: [],
    };

    let pageIndex = 1;

    let nextToken = undefined;

    let roundUrl = '&min-round=' + min + '&max-round=' + max;

    let url2 = 'limit=500&application-id=';

    let baseUrl = endPoints.indexer + 'transactions?';

    async function getPage() {
      let pagePiece = pageIndex !== 1 ? '&next=' + nextToken : '';
      let fullUrl = baseUrl + url2 + appId + roundUrl + pagePiece;
      //console.log(fullUrl);
      let data = await fetch(fullUrl);
      let dataJSON = await data.json();

      //console.log(dataJSON);
      nextToken = dataJSON['next-token'] || undefined;
      pageIndex++;
      let length = dataJSON.transactions.length;

      for (let i = 0; i < length; i++) {
        if (!Object.keys(opted).includes(dataJSON.transactions[i].sender)) {
          let data = await getAsaBalance(
            assetId,
            dataJSON.transactions[i].sender,
            max,
            parseInt(appId, 10),
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
      for (let i = 2; i < 100 && nextToken !== undefined; i++) {
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

async function reqDomain(domain, appId, assetId) {
  const endPoints = getEndpoints();
  let url = endPoints.backend;

  let options = {
    method: 'POST',
    body: undefined,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let user2 = {
    appId: appId,
    recipient: Pipeline.address,
    domain: domain.toLowerCase(),
  };

  let newOptions = { ...options };
  newOptions.body = JSON.stringify(user2);

  let serverResponse = await fetch(url + 'upload/enable', newOptions);
  let dataJSON = await serverResponse.json();
  console.log(dataJSON);

  if (dataJSON.message !== undefined) {
    if (dataJSON.message.length === 52) {
      toast(shorten(dataJSON.message));
    }
  } else {
    toast('Error occured');
  }
}

async function getProposalObject(appId = undefined) {
  if (appId === 'undefined') {
    appId = parseInt(document.getElementById('appId').value);
  }

  try {
    let params = await Pipeline.readGlobalState(appId);

    let ipfsHash = '';

    params.forEach((state) => {
      if (window.atob(state.key) === 'pDescription') {
        ipfsHash = state.value.bytes;
      }
    });

    if (ipfsHash !== '') {
      let proposalHash = window.atob(ipfsHash);

      let ipfsData = await fetch(endPoints.ipfs + proposalHash);
      let ipfsDataJSON = await ipfsData.json();
      console.log(ipfsDataJSON);
      return ipfsDataJSON;
    }
  } catch (e) {
    return undefined;
    //console.log(e);
  }
}

async function getProposalHash(appId = undefined) {
  if (appId === 'undefined') {
    appId = parseInt(document.getElementById('appId').value);
  }

  try {
    let params = await Pipeline.readGlobalState(appId);

    let ipfsHash = '';

    params.forEach((state) => {
      if (window.atob(state.key) === 'pDescription') {
        ipfsHash = state.value.bytes;
      }
    });

    if (ipfsHash !== '') {
      let textHash = window.atob(ipfsHash);
      return textHash;
    }
  } catch (e) {
    //console.log(e);
  }
}

async function readGlobalState(index) {
  const endPoints = getEndpoints();
  let appData = await fetch(endPoints.indexer + 'applications/' + index);
  let appJSON = await appData.json();
  return appJSON.application.params['global-state'];
}

async function getSettingsObject(appId = undefined) {
  if (appId === 'undefined') {
    appId = parseInt(document.getElementById('appId').value);
  }

  try {
    let params = await readGlobalState(appId);
    const endPoints = getEndpoints();
    let ipfsHash = '';

    params.forEach((state) => {
      if (window.atob(state.key) === 'DaoDescription') {
        ipfsHash = state.value.bytes;
      }
    });

    if (ipfsHash !== '') {
      let textHash = window.atob(ipfsHash);

      let ipfsData = await fetch(endPoints.ipfs + textHash);
      let ipfsDataJSON = await ipfsData.json();
      //console.log(ipfsDataJSON);
      return ipfsDataJSON;
    }
  } catch (e) {
    return undefined;
    //console.log(e);
  }
}

async function getSettingsHash(appId = undefined) {
  if (appId === 'undefined') {
    appId = parseInt(document.getElementById('appId').value);
  }

  try {
    let params = await Pipeline.readGlobalState(appId);

    let ipfsHash = '';

    params.forEach((state) => {
      if (window.atob(state.key) === 'DaoDescription') {
        ipfsHash = state.value.bytes;
      }
    });

    if (ipfsHash !== '') {
      let textHash = window.atob(ipfsHash);
      return textHash;
    }
  } catch (e) {
    //console.log(e);
  }
}

async function getAppIdFromDomain(domain) {
  const endPoints = getEndpoints();
  let data = await fetch(endPoints.backend + 'index/domains');
  let dataJSON = await data.json();
  return dataJSON[domain];
}

async function getMinMax(txid = 'T7BZSWPTMYKVCHYAQBDDRZUXQUJTNO3URPPOKDMWIUDNW3O7T25Q') {
  try {
    const endPoints = getEndpoints();
    let data = await fetch(endPoints.indexer + 'transactions/' + txid);
    let dataJSON = await data.json();
    let min = dataJSON.transaction['confirmed-round'];
    let max = 1000000000000000;
    let appState = dataJSON.transaction['global-state-delta'];

    appState.forEach((state) => {
      if (window.atob(state.key) === 'maxRound') {
        max = state.value.uint;
      }
    });

    return { min: min, max: max };
  } catch (e) {
    return { min: 0, max: 1000000000000000 };
  }
}

async function isUserOnly(appId) {
  try {
    const endPoints = getEndpoints();
    let url = endPoints.indexer + 'applications/' + appId;
    let data = await fetch(url);

    let dataJSON = await data.json();

    let appState = dataJSON.application.params['global-state'];

    let index = 1;

    appState.forEach((entry) => {
      if (window.atob(entry.key) === 'index') {
        index = entry.value.uint;
      }
    });
    return index < 1;
  } catch (e) {
    return true;
  }
}

async function isOptedButton(addr, appId) {
  const endPoints = getEndpoints();
  let opted = false;

  try {
    const response = await fetch(endPoints.indexer + 'accounts/' + addr);
    const dataJSON = await response.json();
    const appStates = dataJSON.account?.['apps-local-state'];

    if (appStates) {
      for (let i = 0; i < appStates.length; i++) {
        if (appStates[i].id === parseInt(appId)) {
          opted = true;
          break;
        }
      }
    }
  } catch (error) {
    console.log(error);
  }

  return opted;
}

async function isOpted(addr, appId) {
  const endPoints = getEndpoints();
  // Exit early if the addr is not provided (user is not logged in)
  if (!addr) {
    return false;
  }

  let opted = false;
  let data = await fetch(endPoints.indexer + 'accounts/' + addr);
  let dataJSON = await data.json();
  let appStates = dataJSON.account?.['apps-local-state'];

  if (appStates) {
    //console.log(appStates);
    for (let i = 0; i < appStates.length; i++) {
      if (appStates[i].id === parseInt(appId)) {
        opted = true;
        break;
      }
    }
  }
  return opted;
}

async function getAllOpted(appId = 155480578, max = 0, min = 0) {
  try {
    const endPoints = getEndpoints();
    let currentRound = await getRound();

    if (currentRound < max) {
      max = currentRound;
    }

    let opted = [];

    let pageIndex = 1;

    let nextToken = undefined;

    let roundUrl = '&min-round=' + min + '&max-round=' + max;

    let url2 = 'limit=500&application-id=';

    let baseUrl = endPoints.indexer + 'transactions?';

    async function getPage() {
      let pagePiece = pageIndex !== 1 ? '&next=' + nextToken : '';
      let fullUrl = baseUrl + url2 + appId + roundUrl + pagePiece;
      //console.log(fullUrl);
      let data = await fetch(fullUrl);
      let dataJSON = await data.json();

      //console.log(dataJSON);
      nextToken = dataJSON['next-token'] || undefined;
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
  } catch (e) {
    //console.log(e);
  }
}

async function getUserApps(addr) {
  const endPoints = getEndpoints();
  let appsData = [];
  try {
    if (addr) {
      let pageIndex = 1;
      let nextToken = undefined;
      let url = endPoints.indexer + 'accounts/' + addr + '/apps-local-state?include-all=false';
      let minRound;

      async function getPage() {
        let pagePiece = pageIndex !== 1 ? '&next=' + nextToken : '';
        let fullUrl = url + '&limit=500' + pagePiece;
        let response = await fetch(fullUrl);

        // throw an error if response is not ok
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        let dataJSON = await response.json();

        nextToken = dataJSON['next-token'] || undefined;
        pageIndex++;
        minRound = dataJSON['current-round'];

        if (minRound !== undefined) {
          dataJSON['apps-local-states'].forEach((app) => {
            appsData.push(app); // Push app data into appsData array
          });
        } else {
          console.log('error occurred for fetching account ' + addr);
        }
      }

      await getPage();

      if (nextToken !== undefined) {
        for (let i = 2; i < 100 && nextToken !== undefined; i++) {
          await getPage();
        }
      }
    }
    return appsData;
  } catch (e) {
    console.log('error occurred for fetching account ' + addr);
    return appsData;
  }
}

async function getUserDomains(addr, all = false) {
  const endPoints = getEndpoints();
  let data = await fetch(endPoints.backend + 'index/userIndex');
  let dataJSON = await data.json();
  if (dataJSON[addr] && !all) {
    return dataJSON[addr];
  } else {
    return [];
  }
}

async function getUserProposals(ana, assetId = 0, amount = 1) {
  if (typeof ana === 'number') {
    let address = algosdk.getApplicationAddress(parseInt(ana));
    let txnsArray = [];
    const endPoints = getEndpoints();
    let pageIndex = 1;
    let nextToken = undefined;

    let url2 = 'limit=500&type=pay&address=';
    let baseUrl = endPoints.indexer + 'transactions?';

    async function getPage() {
      let pagePiece = pageIndex !== 1 ? '&next=' + nextToken : '';
      let pageUrl = baseUrl + url2 + address + pagePiece;
      let data = await fetch(pageUrl);
      if (!data.ok) {
        throw new Error(`Failed to fetch transactions (HTTP status code ${data.status})`);
      }
      let dataJSON = await data.json();
      nextToken = dataJSON['next-token'] || undefined;
      pageIndex++;

      for (let i = 0; i < dataJSON.transactions.length; i++) {
        let txn = dataJSON.transactions[i];
        let balances = await getBalances(txn.sender, [parseInt(assetId)]);
        let asaBalance = balances.assets[assetId.toString()];
        if (asaBalance >= parseInt(amount)) {
          let message = '';
          try {
            message = window.atob(txn.note);
          } catch (error) {
            console.error(`Failed to decode message for transaction ${txn.id}: ${error}`);
            continue;
          }
          if (message.trim() !== '') {
            txnsArray.push({
              sender: txn.sender,
              message: message,
              fullTxn: txn,
            });
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

    return txnsArray;
  } else {
    alert('error occured for app id ' + ana + ' which is type of ' + typeof ana);
    return [];
  }
}

async function changePrimary(appId) {
  const endPoints = getEndpoints();
  let user2 = {
    address: '',
    signed: '',
    key: appId,
  };

  let algodClient = new algosdk.Algodv2('', endPoints.node, '');

  let params = await algodClient.getTransactionParams().do();

  let txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: Pipeline.address,
    to: Pipeline.address,
    suggestedParams: params,
    amount: 0,
  });

  let signed = await Pipeline.sign(txn);
  //console.log(signed)

  user2.address = Pipeline.address;
  user2.signed = deBuffer(signedAlgoToED255(signed));

  let options = {
    method: 'POST',
    body: undefined,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let newOptions = { ...options };
  newOptions.body = JSON.stringify(user2);
  //console.log(newOptions)

  let data = await fetch(endPoints.backend + 'upload/changePrimary', newOptions);
  //console.log(data)
}

function deBuffer(uintArray) {
  let string = '';

  uintArray.forEach((entry) => {
    string += String.fromCharCode(entry);
  });
  return string;
}

export function signedAlgoToED255(signed) {
  let decodedTxn = algosdk.decodeSignedTransaction(signed);
  let sig = decodedTxn.sig;
  let txnBytes = algosdk.encodeUnsignedTransaction(decodedTxn.txn);
  let prefix = cBuffer('TX');
  let newArray = [...sig, ...prefix, ...txnBytes];
  let u8New = Uint8Array.from(newArray);
  return u8New;
}

function cBuffer(text) {
  let array = [];
  for (let i = 0; i < text.length; i++) {
    array.push(text.charCodeAt(i));
  }

  let buffer = Uint8Array.from(array);
  return buffer;
}

export {
  isOpted,
  checkMyAsaOpt,
  isOptedButton,
  getUserDomains,
  getUserProposals,
  getUserApps,
  isUserOnly,
  getMinMax,
  voteGetter,
  getAllOpted,
  getRound,
  getSettingsObject,
  getAppIdFromDomain,
  getProposalHash,
  getProposalObject,
  getSettingsHash,
  changePrimary,
  reqDomain,
  main,
  clear,
};
