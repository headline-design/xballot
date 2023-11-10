import Pipeline from '@pipeline-ui-2/pipeline/index';
import algosdk from 'algosdk';
import { create } from 'ipfs-http-client';
import { getEndpoints } from 'utils/endPoints';

async function uploadRecord(object) {
  const infuraProjectId = '2DBKADXQkjmd1KDSg7kq4ext7D3';
  const infuraProjectSecret = '08c9d9923e313326c20a3d163193ab60';

  const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: `Basic ${Buffer.from(infuraProjectId + ':' + infuraProjectSecret).toString(
        'base64',
      )}`,
    },
  });
  try {
    const returnedData = await client.add(Buffer.from(JSON.stringify(object)));
    return returnedData;
  } catch (error) {
    console.error(error);
  }
}

async function publish(appId, txid) {
  const endPoints = getEndpoints();
  let recipient = algosdk.getApplicationAddress(parseInt(appId));

  try {
    //let params = await algodclient.getTransactionParams().do();

    let snapInfo = await fetch(
      endPoints.worker + 'v1/domains/' + appId + '/proposals/' + txid + '/snapshot',
    );
    let snapJSON = await snapInfo.json();

    let ipfsData = await uploadRecord(snapJSON.snapshot);

    console.log('Uploaded IPFS record');

    //alert(ipfsData)

    let noteObj = {
      type: 'validation',
      proposalId: txid,
      ipfsHash: ipfsData.path,
    };

    let note = JSON.stringify(noteObj);

    /* let publishTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: wizard2.addr,
      to: recipient,
      amount: 0,
      note: note,
      suggestedParams: params,
    });

    let createSigned = algosdk.signTransaction(publishTxn, wizard2.sk);
    */

    // let response0 = await algodclient.sendRawTransaction(createSigned.blob).do();

    let response0 = await Pipeline.send(recipient, 0, note, undefined, undefined, 0);
    console.log('response0', response0);
    return response0;
  } catch (e) {
    console.log(e);
  }
}

const wait = (time) => new Promise((resolve) => setTimeout(resolve, time));

async function reloadProposal(
  fetchIndexerProposal,
  appId,
  proposalKey,
  setReloading,
  setProposal,
  chainData,
) {
  setReloading(true);

  const start = new Date().getTime();

  const fetchedProposal = await fetchIndexerProposal(appId, proposalKey);
  console.log('fetched', fetchedProposal);

  const end = new Date().getTime();

  // Subtract the time that has already passed from the desired delay
  const delay = Math.max(0, 1000 - (end - start));
  await wait(delay);

  setProposal(fetchedProposal);
  chainData();
  setReloading(false);
}

export { publish, uploadRecord, reloadProposal };
