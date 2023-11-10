import Pipeline from "@pipeline-ui-2/pipeline/index";
import toast from 'react-hot-toast';
import { main, clear } from 'orderFunctions';
import { priceChart } from 'utils/constants/common';
import { getEndKeys, getEndpoints, staticEndpoints } from 'utils/endPoints';

const BASE_PRICE = 1000000;

const fetchOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

async function calcPrice(nameLength) {
  if (nameLength > 5) {
    nameLength = 5;
  }

  let data = await fetch(staticEndpoints.algoPrice);
  let currentPrice = (await data.json()).price;

  let algoEquivalent = (priceChart[nameLength] / currentPrice) * 1000000;
  return algoEquivalent;
}

async function checkDomainAvailability(domain, callbacks) {
  const endPoints = getEndpoints();

  try {
    const url = endPoints.backend + 'index/banned';
    const data = await fetch(url);
    const dataJSON = await data.json();
    //console.log(dataJSON);
    //console.log(domain);
    if (dataJSON.includes(domain)) {
      callbacks.onError(domain);
      console.log('oh no');
    } else {
      callbacks.onSuccess(domain);
      console.log('woo hoo');
    }
  } catch (error) {
    console.error('An error occurred while checking the domain:', error);
  }
}

async function handleAppTransaction(domain, goodToGo, callbacks) {
  const endKeys = getEndKeys();
  console.log(endKeys)
  const wizardHex = endKeys.wizardHex;
  console.log(wizardHex);
  try {
    if (domain && goodToGo === true) {
      console.log(main(wizardHex));

      const appId = await Pipeline.deployTeal(main(wizardHex), clear, [8, 8, 6, 8], ['create'], 0);
      console.log(appId);
console.log(typeof appId);

      if (typeof appId === 'number') {
        callbacks.onSuccess(appId);
      } else {
        callbacks.onError('App creation failed');
      }
    } else {
      callbacks.onError('Domain not available');
    }
  } catch (e) {
    console.log(e);
    callbacks.onError('An error occurred');
  }
}

async function handlePaymentTransaction(domain, callbacks) {
  const endKeys = getEndKeys();
  const price = await calcPrice(domain.length);
  const finalPrice = price + BASE_PRICE;
  const paymentId = await Pipeline.send(
    endKeys.wizardAddress,
    parseInt(finalPrice),
    '',
    undefined,
    undefined,
    0,
  );

  if (paymentId && paymentId.length === 52) {
    callbacks.onSuccess(paymentId, callbacks);
  } else {
    callbacks.onError();
  }
}

async function handleAssetCreateTransaction(paymentId, appId, domain, callbacks) {
  const endPoints = getEndpoints();
  const url = endPoints.backend;

  const user = {
    appId: appId,
    recipient: Pipeline.address,
    txid: paymentId,
    domain: domain.toLowerCase(),
  };

  const options = {
    ...fetchOptions,
    body: JSON.stringify(user),
  };

  const data = await fetch(`${url}upload/init`, options);
  const dataJSON = await data.json();

  if (dataJSON && dataJSON.assetId) {
    let assetId = dataJSON.assetId;
    callbacks.onSuccess(assetId);
    console.log(assetId);
  } else {
    callbacks.onError();
    toast('Error');
  }
}

async function handleOptInTransaction(assetId, callbacks) {
  const optTxId = await Pipeline.send(Pipeline.address, 0, '', undefined, undefined, assetId);

  if (optTxId !== undefined) {
    callbacks.onSuccess(optTxId);
    console.log(optTxId);
  } else {
    callbacks.onError();
    console.log(optTxId);
  }
}

async function makeDomainRequest(optTxId, paymentId, assetId, appId, domain, callbacks) {
  const endPoints = getEndpoints();
  const url = endPoints.backend;

  const user2 = {
    appId: appId,
    recipient: Pipeline.address,
    txid: paymentId,
    domain: domain.toLowerCase(),
  };

  const options = {
    ...fetchOptions,
    body: JSON.stringify(user2),
  };

  if (optTxId !== undefined) {
    const serverResponse = await fetch(`${url}upload/enable`, options);
    const dataJSON = await serverResponse.json();
    if (dataJSON.message && dataJSON.message.length === 52) {
      callbacks.onSuccess(dataJSON.message);
      console.log(dataJSON.message);
    } else {
      callbacks.onError();
      console.log(dataJSON.message);
    }
  } else {
    callbacks.onError();
    console.log(optTxId);
  }
}

export {
  checkDomainAvailability,
  handleAppTransaction,
  handleOptInTransaction,
  handlePaymentTransaction,
  handleAssetCreateTransaction,
  makeDomainRequest,
};
