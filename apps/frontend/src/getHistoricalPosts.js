import { getEndpoints } from 'utils/endPoints';
import { getUserProposals } from 'orderFunctions';

async function getProposalFromHash(hash) {
  const endPoints = getEndpoints();
  let data = await fetch(endPoints.ipfs + hash);
  let dataJSON = await data.json();
  return dataJSON;
}

async function getHistoricalPosts(appId) {
  const endPoints = getEndpoints();

  let postInfo = await getUserProposals(appId);

  let txnsArray = [];

  //console.log(appId)

  let pageIndex = 1;
  let nextToken = undefined;

  let url2 = '&limit=500&application-id=';

  let baseUrl = endPoints.indexer + 'transactions?type=appl';

  async function getPage() {
    let pagePiece = pageIndex !== 1 ? '&next=' + nextToken : '';
    let pageUrl = baseUrl + url2 + appId + pagePiece;
    //console.log(pageUrl)
    let data = await fetch(pageUrl);
    let dataJSON = await data.json();
    nextToken = dataJSON['next-token'] || undefined;
    pageIndex++;
    txnsArray.push(...dataJSON.transactions);
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
  //console.log(txnsArray)

  let postHistory = [];

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
      //console.log("delta", dArray)
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

      postHistory.push({
        time: time,
        txid: txid,
        ipfsHash: ipfsHash,
        maxRound: maxRound,
        minRound: startRound,
        postInfo: postInfo,
        creator: sender,
      });
    }
  });

  for (let i = 0; i < postHistory.length; i++) {
    let pDescription = await getProposalFromHash(postHistory[i].ipfsHash);
    postHistory[i].pDescription = pDescription;
  }
  //console.log("VOTE HISTORY:")
  //console.log(postHistory)
  return postHistory.reverse();
}

export default getHistoricalPosts;
