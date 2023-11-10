export interface Strategy {
  id: string;
  spacesCount: number;
  author: string;
  version: string;
  about?: string;
  schema?: StrategySchema | null;
  examples?: StrategyExample[];
title?: any;
}

interface StrategyExample {
  name: string;
  strategy: Record<string, any>;
  network: string;
  addresses: string[];
  snapshot: number;
}

interface StrategySchema {
  $schema: string;
  $ref: string;
  definitions: {
    Strategy: Record<string, unknown>;
  };
}

export interface StrategyDefinitionProperties {
  type: string;
  title: string;
  default?: any;
  examples?: string[];
  description?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}
export interface StrategyDefinition {
  title: string;
  type: string;
  default?: any;
  description?: string;
  required?: string[];
  additionalProperties?: boolean;
  properties?: StrategyDefinitionProperties;
}

export interface Profile {
  id: string;
  name: string;
 ALGO: string;
  about?: string;
  avatar?: string;
  created?: number;
}

export interface ProfileActivity {
  activity: ProfileActivity;
  id: string;
  icon: any;
  link: any;
  created: number;
  type: string;
  title: string;
  subtitle: any;
  space: { id: string; avatar: string, name: any };
  vote?: {
    proposalId: string;
    choice: string;
    type: string;
  };
  opted?: {
    optedIn: any;
    optedOut: any;
  };
}

export interface TreasuryAsset {
  address: string;
  contract_name: string;
  contract_ticker_symbol: string;
  contract_address: string;
  contract_decimals: number;
  logo_url: string;
  balance: string;
  balance_24h: string;
  quote: number;
  quote_24h: number;
}

export interface TreasuryWallet {
  balances: any;
  name: string | any;
  address: string | any;
  network: string | any;
}

export interface ExtendedSpace {
  controller: JSX.Element;
  creator: JSX.Element;
  appId: string;
  name: string;
  symbol: string;
  network: string;
  strategies: SpaceStrategy[];
  about: string;
  avatar: string;
  domain: string | null;
  website: string | null;
  terms: string | null;
  coingecko: string | null;
  github: string | null;
  twitter: string | null;
  followersCount: number;
  private: boolean;
  admins: string[];
  members: string[];
  categories: string[];
  parent: ExtendedSpace | null;
  children: ExtendedSpace[];
  forum: {token: any; tokenAmount: any; about: any; terms: any}
  filters: {
    invalids: any; minScore: number; onlyMembers: boolean
};
  validation: SpaceValidation;
  treasuries: TreasuryAsset[];
id: string;
  voting: {
    delay: number | null;
    hideAbstain: boolean;
    period: number | null;
    quorum: number | null;
    type: string | null;
    privacy: string | null;
  };
  proposals: Proposal[];
plugins: any;
assetId: any;
space: any;
}

export interface SpaceValidation {
  name: string;
  params: Record<string, any>;
}

export interface SpaceStrategy {
  title: string;
  network: string;
  params: Record<string, unknown>;
}

export interface Proposal {
    title: string;
    description: string;
    proposalId: string;
    txnHash: string;
    createdAt: number;
    voted: true,
    creator: string;
    creatorName: string;
    creatorImage: string;
    id: string;
    txid: any;
    strategy: string;
  ipfs: string;
  network: string;
  choices: string[] | any;
  type: string;
  maxRound: string;
  author: string;
  content: string;
  created: number;
  start: number;
  end: number;
  state: string;
  symbol: string;
  privacy: [];
  tokenData: {
    assetId: string,
    decimals:number,
    unitName: string,
    name: string,
    total: string,
  };
  token: number | string;
  validation: VoteValidation;
  discussion: string[];
  quorum: number;
  scores: string | any;
  scores_state: string;
  scores_total: number;
  scores_by_strategy: number[][];
  strategyType: string | any;
  votes: number;
  space: ExtendedSpace;
  strategies: SpaceStrategy[];
}

export interface Proposal {
  title: string;
  description: string;
  proposalId: string;
  txnHash: string;
  createdAt: number;
  voted: true,
  creator: string;
  creatorName: string;
  creatorImage: string;
  id: string;
  txid: any;
  strategy: string;
ipfs: string;
network: string;
choices: string[] | any;
type: string;
maxRound: string;
author: string;
content: string;
created: number;
start: number;
end: number;
state: string;
symbol: string;
privacy: [];
validation: VoteValidation;
discussion: string[];
quorum: number;
scores: string | any;
scores_state: string;
scores_total: number;
scores_by_strategy: number[][];
strategyType: string | any;
votes: number;
space: ExtendedSpace;
strategies: SpaceStrategy[];
}

export interface TypeSafeProposal {
  spaces: any;
  body: any;
  title: any;
  description: any;
  proposalId: any;
  token: any;
  txnHash: any;
  createdAt: any;
  voted: any;
  creator: any;
  creatorName: any;
  creatorImage: any;
  id: any;
  appId: any;
  txid: any;
  strategy: any;
  ipfs: any;
  network: any;
  choices: any;
  type: any;
  maxRound: any;
  author: any;
  content: any;
  created: any;
  start: any;
  end: any;
  state: any;
  symbol: any;
  privacy: any;
  validation: any;
  discussion: any;
  quorum: any;
  scores: any;
  scores_state: any;
  scores_total: any;
  scores_by_strategy: any;
  strategyType: any;
  votes: any;
  space: any;
  strategies: any;
  feedback: any;
  tokenData: any;
}


export interface VoteValidation {
  name: string;
  params: Record<string, any>;
}

export interface Results {
  scoresByStrategy: number[][];
  scores: number[];
  scoresTotal: number;
}

export type Choice = any | number | number[] | Record<string, any>;

export interface Vote {
  ipfs: string;
  voter: string;
  choice: Choice;
  balance: number;
  scores: number[];
  vp: number;
  vp_by_strategy: number[];
  reason: string;
  created: number;
}

// Execution

export interface SafeTransaction {
  to: string;
  value: string;
  data: string;
  operation: string;
  nonce: string;
}

export interface RealityOracleProposal {
  dao: string;
  oracle: string;
  cooldown: number;
  expiration: number;
  proposalId: string;
  questionId: string | undefined;
  executionApproved: boolean;
  finalizedAt: number | undefined;
  nextTxIndex: number | undefined;
  transactions: SafeTransaction[];
  txHashes: string[];
  isApproved: boolean;
  endTime: number | undefined;
}

export interface SafeAsset {
  address: string;
  name: string;
  logoUri?: string;
}

export interface CollectableAsset extends SafeAsset {
  id: string;
  tokenName?: string;
}

export interface TokenAsset extends SafeAsset {
  symbol: string;
  decimals: number;
}

export interface CollectableAssetTransaction extends SafeTransaction {
  type: 'transferNFT';
  recipient: string;
  collectable: CollectableAsset;
}

export interface TokenAssetTransaction extends SafeTransaction {
  type: 'transferFunds';
  amount: string;
  recipient: any;
  token: TokenAsset;
}

export interface CustomContractTransaction extends SafeTransaction {
  type: 'contractInteraction';
  abi: string[];
}

export interface SafeModuleTransactionBatch {
  hash: string;
  transactions: SafeTransaction[];
}

export interface SafeExecutionData {
  hash: string | null;
  txs: SafeModuleTransactionBatch[];
  network: string;
  realityModule: string;
}

export interface Plugin {
  author: string;
  defaults: any;
  name: string;
  version: string;
  icon?: string;
  description?: string;
  website?: string;
}

export interface PluginIndex extends Plugin {
  key: string;
}

export interface FormError {
  message: string;
  push?: boolean;
}

export interface RouteObject {
  path?: string;
  index?: boolean;
  children?: React.ReactNode;
  caseSensitive?: boolean;
  id?: string;
  loader?: any;
}