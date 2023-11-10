import { getSettingsObject } from 'orderFunctions';
import { getEndpoints } from 'utils/endPoints';

async function getProposalFromHash(hash) {
  const endPoints = getEndpoints();
  try {
    let data = await fetch(endPoints.ipfs + hash);
    let dataJSON = await data.json();
    return dataJSON;
  } catch (error) {
    console.error('An error occurred while fetching data: ', error);
    return null; // return null or any other value to indicate that there was an error
  }
}

async function getHistoricalVotes(appId) {
  const endPoints = getEndpoints();
  try {
    let settings = await getSettingsObject(appId);

    let txnsArray = [];

    let pageIndex = 1;
    let nextToken = undefined;

    let url2 = '&limit=500&application-id=';

    let baseUrl = endPoints.indexer + 'transactions?type=appl';

    console.log(baseUrl);

    async function getPage() {
      let pagePiece = pageIndex !== 1 ? '&next=' + nextToken : '';
      let pageUrl = baseUrl + url2 + appId + pagePiece;

      try {
        let data = await fetch(pageUrl);
        let dataJSON = await data.json();
        nextToken = dataJSON['next-token'] || undefined;
        pageIndex++;
        txnsArray.push(...dataJSON.transactions);
      } catch (error) {
        console.error('An error occurred while fetching data: ', error);
        throw error;
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
        decoded.push(window.atob(arg));
      });
      let ipfsHash = '';
      let maxRound = 0;
      let sender = '';

      if (decoded.includes('start')) {
        sender = txn.sender;

        let dArray = txn['global-state-delta'] || [];
        dArray.forEach((obj) => {
          switch (window.atob(obj.key)) {
            case 'pDescription':
              ipfsHash = window.atob(obj.value.bytes);
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
      } catch (error) {
        console.error('An error occurred while fetching data: ', error);
        throw error;
      }
    }

    return voteHistory.reverse();
  } catch (error) {
    console.error('An error occurred while getting historical votes: ', error);
    throw error;
  }
}

export default getHistoricalVotes;
