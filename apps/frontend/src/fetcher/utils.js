import { getEndpoints } from 'utils/endPoints';
import algosdk from 'algosdk';
import { Proposals } from 'utils/constants/templates/proposal';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let tokenCache = {};

async function getRound() {
  const endPoints = await getEndpoints();
  let data = await fetch(endPoints.indexer + 'health');
  let dataJSON = await data.json();
  return dataJSON.round;
}

async function getBalances(address, assetArray = [], all = false) {
  const endPoints = await getEndpoints();
  try {
    let baseUrl = endPoints.indexer + 'accounts/';

    let data = await fetch(baseUrl + address);
    let dataJSON = await data.json();
    let algos = dataJSON.account.amount;
    let assets = {};

    if (dataJSON.account?.assets) {
      dataJSON.account.assets.forEach((aobject) => {
        if (!all) {
          if (assetArray.includes(aobject['asset-id'])) {
            assets[aobject['asset-id']] = aobject.amount;
          }
        } else {
          assets[aobject['asset-id']] = aobject?.amount || 0;
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

async function getProposalFromHash(hash) {
  const endPoints = await getEndpoints();
  try {
    let data = await fetch(endPoints.ipfs + hash);
    return await data.json();
  } catch (error) {
    console.error('An error occurred while fetching ipfs data: ', error);
    return null; // return null or any other value to indicate that there was an error
  }
}

async function updateSpaces(daoDataJSON, domainId, proposalId, minRound) {
  if (minRound === undefined) {
    minRound = 0;
  }

  try {
    const value = daoDataJSON[domainId];
    const appId = parseInt(domainId);
    const chainData = await getSettingsObject(appId);

    // Fetch only one specific proposal
    let hist = await getLatestProposal(domainId, minRound);
    hist = hist.filter((proposal) => proposal.txid === proposalId);

    const pArray = hist.map((proposal) => ({
      ...Proposals[0],
      ...proposal.pDescription,
      ...proposal,
      space: proposal.settings,
      appId,
    }));

    // Rest of your code...
  } catch (error) {
    console.error(`Error in updating space: ${error}`);
  }
}

async function getSettingsObject(appId = undefined) {
  const endPoints = await getEndpoints();
  try {
    let params = await readGlobalState(appId);
    let ipfsHash = '';
    let creator = '';
    let controller = '';

    params.forEach((state) => {
      if (atob(state.key) === 'DaoDescription') {
        ipfsHash = state.value.bytes;
      }
      if (atob(state.key) === 'Creator') {
        creator = algosdk.encodeAddress(Buffer.from(state.value.bytes, 'base64'));
      }
      if (atob(state.key) === 'controller') {
        controller = algosdk.encodeAddress(Buffer.from(state.value.bytes, 'base64'));
      }
    });

    if (ipfsHash !== '') {
      let textHash = atob(ipfsHash);
      let ipfsData = await fetch(endPoints.ipfs + textHash);
      let ipfsJson = await ipfsData.json();

      if (creator && (ipfsJson.creator === undefined || ipfsJson.creator === '')) {
        ipfsJson.creator = creator;
      }
      if (controller && (ipfsJson.controller === undefined || ipfsJson.controller === '')) {
        ipfsJson.controller = controller;
      }

      return ipfsJson;
    }
  } catch (e) {
    //console.log(e);
    return '';
  }
}

async function readGlobalState(index) {
  const endPoints = await getEndpoints();
  let appData = await fetch(endPoints.indexer + 'applications/' + index);
  let appJSON = await appData.json();
  return appJSON.application.params['global-state'];
}

async function getLatestProposal(appId, minRound) {
  const endPoints = await getEndpoints();
  try {
    let settings = await getSettingsObject(appId);

    let txnsArray = [];

    let pageIndex = 1;
    let nextToken = undefined;

    let url2 = '&limit=500&application-id=';

    let baseUrl = endPoints.indexer + 'transactions?type=appl&min-round=' + minRound;

    async function getPage() {
      let pagePiece = pageIndex !== 1 ? '&next=' + nextToken : '';
      let pageUrl = baseUrl + url2 + appId + pagePiece;

      try {
        //console.log(pageUrl)
        let data = await fetch(pageUrl);
        let dataJSON = await data.json();
        nextToken = dataJSON['next-token'] || undefined;
        pageIndex++;
        txnsArray.push(...dataJSON.transactions);
      } catch (error) {
        console.error('An error occurred while fetching historical votes: ', error);
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
      let time = txn['round-time'];
      let startRound = txn['confirmed-round'];
      let txid = txn.id;
      let args = [];
      if (txn['application-transaction']) {
        args = txn['application-transaction']['application-args'] || [];
      }

      let decoded = [];
      args.forEach((arg) => {
        decoded.push(atob(arg));
      });
      let ipfsHash = '';
      let maxRound = 0;
      let sender = '';

      if (decoded.includes('start')) {
        sender = txn.sender;

        let dArray = txn['global-state-delta'] || [];
        dArray.forEach((obj) => {
          switch (atob(obj.key)) {
            case 'pDescription':
              ipfsHash = atob(obj.value.bytes);
              break;
            case 'maxRound':
              maxRound = obj.value.uint;
              break;
            default:
              break;
          }
        });

        voteHistory.push({
          time: time,
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
        let scores_state = 'pending';
        if (currentTime >= pDescription?.start && currentTime <= pDescription?.end) {
          scores_state = 'active';
        } else if (currentTime > pDescription?.end) {
          scores_state = 'closed';
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

async function getTokenData(assetId) {
  const endPoints = await getEndpoints();
  await sleep(200);

  let tokenData = {};

  try {
    let data = await fetch(endPoints.indexer + `assets/${assetId}`);

    let dataJSON = await data.json();

    //console.log(dataJSON)

    let decimals = dataJSON['asset']?.params.decimals;
    let unitName = dataJSON['asset']?.params['unit-name'];
    let name = dataJSON['asset']?.params.name;
    let total = dataJSON['asset']?.params.total;

    tokenData = {
      assetId: assetId || 0,
      decimals: decimals || 0,
      unitName: unitName || 'none',
      name: name || 'none',
      total: total || 0,
    };
    return tokenData;
  } catch (e) {
    console.log('Error occured in getTokenData', e);
    return tokenData;
  }
}

async function getAllOpted(appId = 155480578, max = 0, min = 0) {
  const endPoints = await getEndpoints();
  console.log('appID', appId);
  try {
    let currentRound = await getRound();
    //console.log(currentRound)
    if (currentRound < max) {
      max = currentRound;
    }

    let opted = [];

    let pageIndex = 1;

    let nextToken = undefined;

    let roundUrl = '&min-round=' + min + '&max-round=' + max;

    let url2 = 'limit=500&application-id=';

    let baseUrl = endPoints.indexer + 'transactions?';
    console.log('url', baseUrl + url2 + appId + roundUrl);
    async function getPage() {
      let pagePiece = pageIndex !== 1 ? '&next=' + nextToken : '';
      let fullUrl = baseUrl + url2 + appId + roundUrl + pagePiece;
      let data = await fetch(fullUrl);
      let dataJSON = await data.json();

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
  } catch (error) {
    console.log(error);
  }
}

async function getUserProposals(appId, assetId, amount, minRound) {
  const endPoints = await getEndpoints();
  if (typeof appId === 'number') {
    if (minRound === undefined) {
      minRound = 0;
    }

    let address = algosdk.getApplicationAddress(parseInt(appId));
    let asaBalance = null;
    let txnsArray = {
      proposals: {},
    };
    let pageIndex = 1;
    let nextToken = undefined;

    let url2 = 'limit=500&' + 'min-round=' + minRound + '&type=pay&address=';
    let baseUrl = endPoints.indexer + 'transactions?';

    async function getPage() {
      let pagePiece = pageIndex !== 1 ? '&next=' + nextToken : '';
      let pageUrl = baseUrl + url2 + address + pagePiece;
      let data = await fetch(pageUrl);
      if (!data.ok) {
        console.log('error getting page', data);
      }
      let dataJSON = await data.json();
      nextToken = dataJSON['next-token'] || undefined;
      pageIndex++;

      for (let i = 0; i < dataJSON.transactions.length; i++) {
        //console.log("parsing post " + i);
        let txn = dataJSON.transactions[i];
        let message = '';
        let postData = '';
        let threadData = '';
        let ipfsHash = false;

        try {
          message = atob(txn.note);
          ipfsHash = message.length === 46 && message.startsWith('Qm');
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
          threadData.type !== 'report' &&
          !threadData.proposalId
        ) {
          let balances = await getBalances(txn.sender, [parseInt(assetId)]);
          asaBalance = balances.assets[assetId.toString()];
        }

        let template = {
          sender: txn.sender,
          timeStamp: txn['round-time'],
          id: txn.id,
        };

        if (ipfsHash) {
          postData = await getProposalFromHash(ipfsHash && message);
          txnsArray[txn.id] = {
            thread: {},
            data: postData,
            type: 'post',
            ...template,
          };
        } else {
          try {
            if (threadData.proposalId) {
              txnsArray.proposals[txn.id] = threadData;
              threadData.id = txn.id;
              //console.log(txnsArray.proposals[txn.id])
            } else if (asaBalance >= parseInt(amount)) {
              txnsArray[txn.id] = {
                data: threadData,
                type: 'thread',
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

        if (txnsArray[key].type !== 'post' && postId) {
          txnsArray[postId].thread[key] = { ...txnsArray[key] };
          delete txnsArray[key];
        }
      } catch (e) {}
    });

    let postKeys = Object.keys(txnsArray);

    //console.log("posts length: " + keys.length);

    postKeys.forEach((key) => {
      let thread = txnsArray[key].thread;

      if (thread) {
        Object.keys(thread).forEach((commentKey) => {
          if (thread[commentKey].data.commentId) {
            console.log('assigning comment as reply');
            let replyId = thread[commentKey].data.commentId;

            console.log('replyId: ' + replyId);
            if (thread[replyId]?.subThread !== undefined) {
              console.log('a');
              Object.assign(thread[replyId].subThread, {
                [commentKey]: thread[commentKey],
              });
            } else {
              if (thread[replyId] !== undefined) {
                console.log('b');
                thread[replyId].subThread = {};
                Object.assign(thread[replyId].subThread, {
                  [commentKey]: thread[commentKey],
                });
              }
            }
            console.log('removed comment from parent');
            delete thread[commentKey];
          }
        });
      }
    });

    return txnsArray;
  } else {
    //alert(
    //"error occurred for app id " + ana + " which is type of " + typeof ana
    //);
    return {};
  }
}

// off-chain data //

async function getIndexerProposal(appId, txId) {
  const endPoints = await getEndpoints();
  const proposalData = await fetch(endPoints.worker + 'v1/domains/' + appId + '/proposals/' + txId);
  let proposalDataJSON = await proposalData.json();
  proposalDataJSON.fetcher = 'indexer';
  return proposalDataJSON;
}


export {
  getSettingsObject,
  getTokenData,
  getLatestProposal,
  updateSpaces,
  getAllOpted,
  getUserProposals,
  getIndexerProposal,
};
