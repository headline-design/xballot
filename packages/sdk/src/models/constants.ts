const CONST_EXTENDED_SPACE = {
  id: '',
  name: '',
  symbol: '',
  network: '',
  strategy: '',
  about: '',
  avatar: '',
  domain: '',
  website: '',
  terms: '',
  coingecko: '',
  github: '',
  twitter: '',
  followersCount: 0,
  private: false,
  admins: [''],
  members: [],
  categories: [''],
  filters: {
    invalids: '',
  },
  treasuries: [],
  voting: {
    delay: 0,
    hideAbstain: false,
    period: 0,
    quorum: 0,
    type: '',
    privacy: '',
  },
};

const CONST_RANKED_SPACE = {
  id: '',
  name: '',
  avatar: '',
  verified: false,
  rank: 0,
  categories: [''],
  activeProposals: 0,
  proposalsCount: 0,
  proposalsCount7d: 0,
  followersCount: 0,
  followersCount7d: 0,
  votesCount: 0,
  votesCount7d: 0,
  terms: '',
};

const CONST_PROPOSALS = [
  {
    title: '',
    appId: 0,
    description: '',
    content: '',
    prime: '',
    creator: '',
    ipfsHash: '',
    network: '',
    choices: [''],
    type: '',
    snapshot: '',
    start: 0,
    end: 0,
    state: '',
    symbol: '',
    privacy: '',
    discussion: '',
    quorum: 0,
    scores: [''],
    scores_state: '',
    scores_total: 0,
    locked: false,
    scores_by_strategy: 0,
    space: CONST_EXTENDED_SPACE,
    strategy: '',
    validation: '',
  },
];

const CONST_POSTS = [
  {
    title: '',
    description: '',
    content: '',
    postId: 0,
    prime: '',
    creator: '',
    id: '',
    ipfsHash: '',
    network: '',
    type: '',
    state: '',
    symbol: '',
    space: CONST_EXTENDED_SPACE,
  },
];

const CONST_PROFILES = [
  {
    about: '',
    appId: 0,
    asset: 0,
    assetId: 0,
    avatar: '',
    creator: '',
    domain: '',
    enabled: false,
    name: '',
  },
];

const CONST_MAIN_JSON = {
  1136066393: {
    creator: 'Y2GTT3RXCJIOXH25F5X5Q7ME4YCGIW5I2K7KODHR3TI6IY2Q3I5WO4MXUE',
    enabled: true,
    asset: 1136066699,
    domain: 'hdldao',
  },
  222917185: {
    creator: 'K3NSXYMHPRCK7PMYT3QUQXUGPZJ4MKWJXW2HJRYPVMQUMKJAOJEIEO4HK4',
    enabled: true,
    asset: 222917768,
    domain: 'yamerz',
  },
  234224706: {
    creator: 'PHU2LPUBVOVXCL5FITW5PUPE5OF64UWUKVRWY72PVFUED7EM3C67EOQYGI',
    enabled: true,
    asset: 0,
    domain: 'eduark',
  },
  223049672: {
    creator: 'K3NSXYMHPRCK7PMYT3QUQXUGPZJ4MKWJXW2HJRYPVMQUMKJAOJEIEO4HK4',
    enabled: true,
    asset: 0,
    domain: 'domainex',
  },
};

const CONST_TEST_JSON = {
  223049672: {
    creator: 'K3NSXYMHPRCK7PMYT3QUQXUGPZJ4MKWJXW2HJRYPVMQUMKJAOJEIEO4HK4',
    enabled: true,
    asset: 223050141,
    domain: 'domainex',
  },

  223059901: {
    creator: 'K3NSXYMHPRCK7PMYT3QUQXUGPZJ4MKWJXW2HJRYPVMQUMKJAOJEIEO4HK4',
    enabled: true,
    asset: 223060331,
    domain: 'idc',
  },
};

export {
  CONST_EXTENDED_SPACE,
  CONST_RANKED_SPACE,
  CONST_PROPOSALS,
  CONST_POSTS,
  CONST_PROFILES,
  CONST_MAIN_JSON,
  CONST_TEST_JSON,
};
