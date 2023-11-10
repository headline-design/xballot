import { v4 as uuidv4 } from 'uuid';
import { getLocalStorage } from '../../localStorage/localStorage';
import localStore from 'store';

export const NONE_YET = 'none yet';
export const PREFERRED_DECIMALS = 2;
export const DEBOUNCE_MS = 800;

/** LocalStorage Keys **/
/* ----- Constants ----- */
export const CHAIN_NETWORK_KEY = 'isMainNet';
export const NFTS_SIZE_KEY = 'nftsSize';
export const COLLECTIONS_SIZE_KEY = 'collectionsSize';
export const USERS_SIZE_KEY = 'usersSize';
export const SPACES_KEY = 'spaces';
export const NETWORKS_KEY = 'networks';
export const MY_SPACES_KEY = 'mySpaces';
export const USER_DATA_KEY = 'userData';
export const DOMAIN_DATA_KEY = 'domainData';
export const SPACE_DATA_KEY = 'spaceData';
export const EXPLORE_DATA_KEY = 'exploreData';
export const LATEST_SPACES_SEARCH_KEY = 'latestSpacesSearch';

/** SessionStorage Keys **/
export const MY_GRID_KEY = 'my-grid';

/** SQL Limits **/
export const SqlLimits = {
  Homepage: 50,
  Storefront: 50,
  NftSearchBar: 3,
};

/** Imgix **/

export const CacherDomain = {
  IPFS: 'https://xgov-ipfs.imgix.net/',
};

export const ImgixVideoFormat = {
  HLS: 'hls',
  MP4: 'mp4',
};

export const ImgixMp4Resolution = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

// width
export const Sizes = {
  general: 400,
  avatar: 82,
  avatarImage: 164,
};

/** Networks **/

export const Networks = {
  MainNet: 'MainNet',
  TestNet: 'TestNet',
};

/** Filter Bar **/

export const defaultNftData = { Collections: [], NFTs: [], Users: [] };

export const normalMasonryBreakpoints = {
  default: 5,
  1750: 5,
  1420: 4,
  1050: 3,
  850: 2,
  390: 1,
};

export const moreItemsMasonryBreakpoints = {
  default: 5,
  1100: 4,
  700: 3,
  500: 2,
};

export const filterOpenMasonryBreakpoints = {
  default: 3,
  1100: 2,
  700: 2,
  500: 1,
};

export const userBreakpoints = {
  1750: 4,
  default: 5,
  1400: 3,
  950: 2,
  800: 1,
};

export enum Grid {
  DEFAULT,
  WIDE,
}

export const Tokens = {
  ALGO: 'ALGO',
  HDL: 'HDL',
  PLANET: 'PLANET',
};

export const TokenAssetIDs = {
  ALGO: 0,
  HDL: 137594422,
  PLANET: 27165954,
};

export const DEXs = {
  TINYMAN: 'tinyman',
};

export const CollectionIDs = {
  FACTORY: 150,
};

export enum MainCategories {
  Owned,
  OnSale,
  Created,
  NFTs,
  Collections,
  Profiles,
  Activity,
  Items,
  Community,
  Liked,
}

export enum Sort {
  RecentlyListed,
  PriceHtoL,
  PriceLtoH,
  EndingSoon,
}

export enum Status {
  Minted,
  OnSale,
  OnAuction,
}

/** Pipe Connectors */

export const PipeConnectors = {
  MyAlgoWallet: 'myAlgoWallet',
  PeraWallet: 'PeraWallet',
  XWallet: 'escrow',
  //AlgoSigner: 'AlgoSigner',
  //XWallet: 'XWallet'
};

/** INDEXERS */

export const Indexers = {
  AlgoExplorer: 'AlgoExplorer',
  AlgoNode: 'AlgoNode',
};

export const DEFAULT_INDEXER = Indexers.AlgoExplorer;

/** Local Storage keys */

export const PIPECONNECT_STATE_KEY = 'pipeConnectState';
export const TOKEN_KEY = 'token';
export const USER_INFO_KEY = 'userInfo';
export const USER_ACCOUNT_NAME_KEY = 'userAccountName';
export const USER_ACCOUNT_NUMBER_KEY = 'userAccountNumber';
export const USER_LANGUAGE_KEY = 'userLanguage';
export const IS_DARK_THEME_KEY = 'isDarkTheme';
export const X_MNEMONIC = 'xMnemonic';
export const X_ADDRESS = 'xAddress';

/** THEMES */
export const Themes = {
  DARK: 'dark',
  LIGHT: 'light',
};

/** DEFAULT REDUX VALUES */
export const DefaultPipeState = {
  myAddress: JSON.parse(String(getLocalStorage(PIPECONNECT_STATE_KEY)))?.myAddress || '',
  isMainNet:
    localStore.get(CHAIN_NETWORK_KEY) === true
      ? true
      : localStore.get(CHAIN_NETWORK_KEY) === false
      ? false
      : process.env.REACT_APP_NETWORK_TYPE === 'mainnet'
      ? true
      : false,
  provider: JSON.parse(String(getLocalStorage(PIPECONNECT_STATE_KEY)))?.provider || '',
};

export const User = {
  myAddress: JSON.parse(String(getLocalStorage(PIPECONNECT_STATE_KEY)))?.myAddress || '',
};

export const nftTypes = {
  image: 'image',
  video: 'video',
};

export const uuid = uuidv4;

export const Languages = {
  EN: 'English',
  IT: 'Italian',
};

export const priceChart = {
  1: 100,
  2: 50,
  3: 30,
  4: 10,
  5: 1,
};
