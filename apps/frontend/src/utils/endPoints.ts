import { CHAIN_NETWORK_KEY } from 'utils/constants/common';
import localStore from 'store';
import {
  INDEXER_URL,
  INDEXER_ALT_URL,
  NODE_URL,
  NODE_ALT_URL,
  INDEXER_HEALTH_URL,
  INDEXER_HEALTH_ALT_URL,
  REGISTRAR_URL,
  IPFS_URL,
  SERVER_URL,
  EXPLORER_URL,
  XBALLOT_DOCS_URL,
  XBALLOT_DISCORD_URL,
  XBALLOT_TWITTER_URL,
  XBALLOT_TELEGRAM_URL,
  XBALLOT_MEDIUM_URL,
  HEADLINE_TWITTER_URL,
  HEADLINE_TELEGRAM_URL,
  HEADLINE_GITHUB_URL,
  ALGO_PRICE_URL,
  ASSET_PRICE_URL,
  ASSET_PRICES_URL,
  STAMP_URL,
  configureNetwork,
} from '@xballot/sdk';

// A helper function to get network type
export const getNetworkType = () =>
  localStore.get(CHAIN_NETWORK_KEY) ?? process.env.REACT_APP_NETWORK_TYPE === 'mainnet';

// Common endpoints object
const commonEndpoints = {
  priceApi: 'https://api.myalgo.com/asset/prices/',
  ipfs: IPFS_URL,
  xballotUrl: 'https://xballot.net/',
};

export const getEndpoints = () => {
  const isMainnet = getNetworkType();

  configureNetwork(isMainnet ? 'mainnet' : 'testnet');

  const endpoints = {
    false: {
      ...commonEndpoints,
      indexer: INDEXER_URL,
      indexerAlt: INDEXER_ALT_URL,
      node: NODE_URL,
      nodeAlt: NODE_ALT_URL,
      indexerHealth: INDEXER_HEALTH_URL,
      indexerHealthAlt: INDEXER_HEALTH_ALT_URL,
      backend: REGISTRAR_URL,
      worker: SERVER_URL,
      explorer: EXPLORER_URL,
    },
    true: {
      ...commonEndpoints,
      indexer: INDEXER_URL,
      indexerAlt: INDEXER_ALT_URL,
      node: NODE_ALT_URL,
      nodeAlt: NODE_ALT_URL,
      indexerHealth: INDEXER_HEALTH_URL,
      indexerHealthAlt: INDEXER_HEALTH_ALT_URL,
      backend: REGISTRAR_URL,
      worker: SERVER_URL,
      explorer: EXPLORER_URL,
    },
  };

  return endpoints[String(isMainnet)];
};

export const getEndKeys = () => {
  const isMainnet = getNetworkType();

  const endKeys = {
    false: {
      wizardAddress: 'IDJ2C65EBWIWKIWJHBDB23XR2FM6DCCAI7XV6GANOCADQRBMUUQGSEX7YI',
      wizardHex: '0x40d3a17ba40d916522c938461d6ef1d159e1884047ef5f180d708038442ca520',
      assetId: 10458941,
      appId: 222917185,
    },
    true: {
      wizardAddress: 'PPFMWPQEQOIKGUO5WST7X6VKQ65NCMT6R6AOY6QYZTRCREGVSLOKUB72UY',
      wizardHex: '0x7bcacb3e048390a351ddb4a7fbfaaa87bad1327e8f80ec7a18cce22890d592dc',
      assetId: 137594422,
      appId: 1136066393,
    },
  };

  return endKeys[String(isMainnet)];
};

export const getTerms = () => {
  const isMainnet = getNetworkType();

  const terms = {
    false: {
      chainTitle: 'Algorand testnet',
      protocolTitle: 'XBallot testnet',
    },
    true: {
      chainTitle: 'Algorand mainnet',
      protocolTitle: 'XBallot mainnet',
    },
  };

  return terms[String(isMainnet)];
};

export const staticEndpoints = {
  xBallotDocs: XBALLOT_DOCS_URL,
  xBallotDiscord: XBALLOT_DISCORD_URL,
  xBallotTwitter: XBALLOT_TWITTER_URL,
  xBallotTelegram: XBALLOT_TELEGRAM_URL,
  xBallotMedium: XBALLOT_MEDIUM_URL,
  headlineTwitter: HEADLINE_TWITTER_URL,
  headlineTelegram: HEADLINE_TELEGRAM_URL,
  headlineGithub: HEADLINE_GITHUB_URL,
  algoPrice: ALGO_PRICE_URL,
  assetPrice: ASSET_PRICE_URL,
  assetPrices: ASSET_PRICES_URL,
  stamp: STAMP_URL,
  ipfs: IPFS_URL,
};

export const staticValues = {
  roundTime: 3.4,
};
