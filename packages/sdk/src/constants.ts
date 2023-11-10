// Global vars

const NODE_ENV = 'production';
const CHAIN_ENV = 'mainnet';
const DB_ENV = 'remote';

// Testnet
const TESTNET_REGISTRAR_URL = 'https://xballot-registrar-develop.onrender.com/';
const TESTNET_NODE_URL =
  'https://necessary-proportionate-aura.algorand-testnet.quiknode.pro/3ac85820094a4af3daa8f449d8525a567f948400/algod';
const TESTNET_NODE_ALT_URL = 'https://testnet-api.algonode.network';
const TESTNET_INDEXER_URL =
  'https://necessary-proportionate-aura.algorand-testnet.quiknode.pro/3ac85820094a4af3daa8f449d8525a567f948400/index/v2/';
const TESTNET_INDEXER_ALT_URL = 'https://testnet-idx.algonode.network/v2/';
const TESTNET_INDEXER_HEALTH_URL =
  'https://necessary-proportionate-aura.algorand-testnet.quiknode.pro/3ac85820094a4af3daa8f449d8525a567f948400/index/health';
const TESTNET_INDEXER_HEALTH_ALT_URL =
  'https://testnet-idx.algonode.network/health';
const TESTNET_IPFS_URL = 'https://xballot-testnet.infura-ipfs.io/ipfs/';
const TESTNET_BALANCE_INDEXER_URL =
  'https://2qbk4pu3xd.us-east-1.awsapprunner.com/';
const TESTNET_SERVER_URL = 'https://indexer.testnet.xballotapi.com/';
//const TESTNET_MONGODB_URL = 'mongodb://mongodb-develop:27017';
const TESTNET_MONGODB_URL = 'mongodb://xballot-db-develop:27017/xballot';
const TESTNET_EXPLORER_URL = 'https://testnet.algoexplorer.io/';

// Mainnet
//const MAINNET_REGISTRAR_URL = 'https://xballot-registrar-mainnet.onrender.com/';
const MAINNET_REGISTRAR_URL = 'https://xballot-registrar-monorepo.onrender.com/';
const MAINNET_NODE_URL =
  'https://mainnet-api.algonode.network';
const MAINNET_NODE_ALT_URL = 'https://mainnet-api.algonode.network';
const MAINNET_INDEXER_URL =
  'https://mainnet-idx.algonode.network/v2/';
const MAINNET_INDEXER_HEALTH_URL =
  'https://mainnet-idx.algonode.network/health';
const MAINNET_INDEXER_ALT_URL = 'https://mainnet-idx.algonode.network/v2/';
const MAINNET_INDEXER_HEALTH_ALT_URL =
  'https://mainnet-idx.algonode.network/health';
const MAINNET_IPFS_URL = 'https://xballot.infura-ipfs.io/ipfs/';
const MAINNET_BALANCE_INDEXER_URL =
  'https://xballot-indexer.onrender.com/';
//const MAINNET_SERVER_URL = 'https://indexer.mainnet.xballotapi.com/';
const MAINNET_SERVER_URL = 'https://xballot-api-monorepo.onrender.com/';
//const MAINNET_MONGODB_URL = 'mongodb://xballot-db-mainnet:27017';
const MAINNET_MONGODB_URL = 'mongodb://xballot-db-develop:27017/xballot';
const MAINNET_EXPLORER_URL = 'https://algoexplorer.io/';

// Static Endpoints

const STATIC_XBALLOT_DOCS_URL = 'https://xstack.build/xballot/docs';
const STATIC_XBALLOT_DISCORD_URL = 'https://discord.xballot.net';
const STATIC_XBALLOT_TWITTER_URL = 'https://twitter.com/xballot_';
const STATIC_XBALLOT_TELEGRAM_URL = 'https://t.me/xballot';
const STATIC_XBALLOT_MEDIUM_URL = 'https://medium.com/xballot';
const STATIC_HEADLINE_TWITTER_URL = 'https://twitter.com/headline_crypto';
const STATIC_HEADLINE_TELEGRAM_URL = 'https://t.me/headline_crypto';
const STATIC_HEADLINE_GITHUB_URL = 'https://github.com/headline-design';
const STATIC_ALGO_PRICE_URL = 'https://price.algoexplorerapi.io/price/algo-usd';
const STATIC_ASSET_PRICE_URL = 'https://free-api.vestige.fi/asset/';
const STATIC_ASSET_PRICES_URL = 'https://api.myalgo.com/asset/prices';
const STATIC_STAMP_URL = 'https://cdn.stamp.fyi/';

// Local DB
const TESTNET_LOCAL_MONGODB_URL = 'mongodb://localhost:27017/xballot';
const MAINNET_LOCAL_MONGODB_URL = 'mongodb://localhost:27017/xballot';

export {
  NODE_ENV,
  CHAIN_ENV,
  DB_ENV,
  TESTNET_REGISTRAR_URL,
  TESTNET_NODE_URL,
  TESTNET_NODE_ALT_URL,
  TESTNET_INDEXER_URL,
  TESTNET_INDEXER_ALT_URL,
  TESTNET_INDEXER_HEALTH_URL,
  TESTNET_INDEXER_HEALTH_ALT_URL,
  TESTNET_IPFS_URL,
  TESTNET_BALANCE_INDEXER_URL,
  TESTNET_SERVER_URL,
  TESTNET_MONGODB_URL,
  TESTNET_EXPLORER_URL,
  MAINNET_REGISTRAR_URL,
  MAINNET_NODE_URL,
  MAINNET_NODE_ALT_URL,
  MAINNET_INDEXER_URL,
  MAINNET_INDEXER_ALT_URL,
  MAINNET_INDEXER_HEALTH_URL,
  MAINNET_INDEXER_HEALTH_ALT_URL,
  MAINNET_IPFS_URL,
  MAINNET_BALANCE_INDEXER_URL,
  MAINNET_SERVER_URL,
  MAINNET_MONGODB_URL,
  MAINNET_EXPLORER_URL,
  TESTNET_LOCAL_MONGODB_URL,
  MAINNET_LOCAL_MONGODB_URL,
  STATIC_XBALLOT_DOCS_URL,
  STATIC_XBALLOT_DISCORD_URL,
  STATIC_XBALLOT_TWITTER_URL,
  STATIC_XBALLOT_TELEGRAM_URL,
  STATIC_XBALLOT_MEDIUM_URL,
  STATIC_HEADLINE_TWITTER_URL,
  STATIC_HEADLINE_TELEGRAM_URL,
  STATIC_HEADLINE_GITHUB_URL,
  STATIC_ALGO_PRICE_URL,
  STATIC_ASSET_PRICE_URL,
  STATIC_ASSET_PRICES_URL,
  STATIC_STAMP_URL,
};
