import mongoose from 'mongoose';

const FiltersSchema = new mongoose.Schema({
  minScore: Number,
  onlyMembers: Boolean,
});

const ForumSchema = new mongoose.Schema({
  token: String,
  tokenAmount: String,
  about: String,
});

const ProposalsSchema = new mongoose.Schema({
  title: String,
  appId: String,
  createdAt: Date,
  description: String,
  content: String,
  prime: String,
  creator: String,
  ipfsHash: String,
  network: String,
  choices: mongoose.Schema.Types.Mixed,
  type: String,
  snapshot: String,
  start: Number,
  end: Number,
  state: String,
  symbol: String,
  privacy: String,
  discussion: String,
  quorum: Number,
  scores: mongoose.Schema.Types.Mixed,
  scores_state: String,
  scores_total: Number,
  scores_by_strategy: Number,
  strategy: String,
  space: mongoose.Schema.Types.Mixed,
  token: mongoose.Schema.Types.Mixed,
  validation: mongoose.Schema.Types.Mixed,
  metadata: mongoose.Schema.Types.Mixed,
  roundStamp: Number,
});

const ProposalSchema = new mongoose.Schema({
  txId: String,
  proposal: {
    title: String,
    appId: String,
    description: String,
    content: String,
    creator: String,
    ipfsHash: String,
    choices: mongoose.Schema.Types.Mixed,
    snapshot: String,
    start: Number,
    end: Number,
    discussion: String,
    scores: mongoose.Schema.Types.Mixed,
    scores_state: String,
    scores_total: Number,
    token: mongoose.Schema.Types.Mixed,
    roundStamp: Number,
  },
});

const SCHEMA_PROPOSAL = mongoose.model('Proposal', ProposalSchema);

const TreasurySchema = new mongoose.Schema({
  id: Number,
  address: String,
  name: String,
  network: Number,
});

const StrategySchema = new mongoose.Schema({
  text: String,
  title: String,
  description: String,
});

const VotingSchema = new mongoose.Schema({
  delay: { type: Number, default: 0 },
  hideAbstain: { type: Boolean, default: false },
  period: { type: Number, default: 0 },
  quorum: { type: Number, default: 0 },
  type: { type: String, default: '' },
  privacy: { type: String, default: '' },
  token: String,
  creator: String,
  controller: String,
});

const ExtendedSpaceSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    symbol: String,
    network: Number,
    strategy: String,
    about: String,
    avatar: String,
    domain: String,
    website: String,
    terms: String,
    coingecko: String,
    github: String,
    twitter: String,
    followersCount: Number,
    private: Boolean,
    admins: [String],
    members: [mongoose.Schema.Types.Mixed],
    filters: FiltersSchema,
    treasuries: [TreasurySchema],
    voting: VotingSchema,
    creator: String,
    controller: String,
    appId: String,
    assetId: Number,
    description: String,
    userName: String,
    strategies: [StrategySchema],
    plugins: mongoose.Schema.Types.Mixed,
    forum: ForumSchema,
    proposal: {
      token: mongoose.Schema.Types.Mixed,
      template: String,
    },
    parent: {
      id: String,
      name: String,
    },
    children: [String],
    skin: String,
    guidelines: String,
    template: String,
    enabled: Boolean,
    asset: Number,
    categories: mongoose.Schema.Types.Mixed,
    postId: String,
    snapshot: String,
    state: String,
    privacy: String,
    discussion: String,
    quorum: Number,
    settings: mongoose.Schema.Types.Mixed,
    time: Number,
    txid: String,
    maxRound: Number,
    minRound: Number,
    validation: mongoose.Schema.Types.Mixed,
    metadata: mongoose.Schema.Types.Mixed,
    roundStamp: Number,
    proposals: {
      type: Object,
      default: [ProposalsSchema],
    },
  },
  { timestamps: true }
);

const SCHEMA_SPACE = mongoose.model('Space', ExtendedSpaceSchema);

const profileSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true,
  },
  domains: {
    type: Map,
    of: new mongoose.Schema({
      id: {
        type: String,
        required: true,
      },
      address: String,
      appId: Number,
      settings: {
        name: String,
        about: String,
        avatar: String,
        appId: Number,
        assetId: Number,
        domain: String,
        delegations: [mongoose.Schema.Types.Mixed],
        creator: String,
        controller: String,
      },
    }),
    required: true,
  },
});

const SCHEMA_PROFILE = mongoose.model('Profile', profileSchema);

const primeSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true,
  },
  domains: {
    type: Map,
    of: new mongoose.Schema({
      id: {
        type: String,
        required: true,
      },
      address: String,
      appId: Number,
      settings: {
        name: String,
        about: String,
        avatar: String,
        appId: Number,
        assetId: Number,
        domain: String,
        delegations: [mongoose.Schema.Types.Mixed],
        creator: String,
        controller: String,
      },
    }),
    required: true,
  },
});

const SCHEMA_PRIME = mongoose.model('Prime', primeSchema);

const PostSchema = new mongoose.Schema(
  {
    id: String,
    type: String,
    sender: String,
    timeStamp: Number,
    thread: mongoose.Schema.Types.Mixed,
    data: mongoose.Schema.Types.Mixed,
    roundStamp: Number,
  },
  { timestamps: true }
);

const ValidationSchema = new mongoose.Schema(
  {
    id: String,
    type: String,
    proposalId: String,
    ipfsHash: String,
  },
  { _id: false }
);

const PortalSchema = new mongoose.Schema(
  {
    appId: Number,
    posts: {
      type: Map,
      of: PostSchema,
    },
    proposals: {
      type: Map,
      of: ValidationSchema,
    },
    roundStamp: Number,
  },
  { timestamps: true }
);

const SCHEMA_PORTAL = mongoose.model('Portal', PortalSchema);

const ReportsSchema = new mongoose.Schema({
  appId: Number,
  reports: [mongoose.Schema.Types.Mixed],
});

const SCHEMA_REPORT = mongoose.model('Report', ReportsSchema);

const delegateSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true,
  },
  domains: {
    type: Map,
    of: new mongoose.Schema({
      id: {
        type: String,
        required: true,
      },
      address: String,
      appId: Number,
      delegations: [mongoose.Schema.Types.Mixed],
    }),
    required: true,
  },
});

const SCHEMA_DELEGATE = mongoose.model('Delegate', delegateSchema);

const SCHEMA_PROPOSALS = mongoose.model('Proposals', ProposalsSchema);

const rankingSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    domain: { type: String, required: false },
    avatar: { type: String, required: false },
    address: { type: String, required: false },
    id: { type: Number, required: false },
    type: { type: String, required: false },
    appId: { type: Number, required: true, unique: true },
    verified: {
      type: Boolean,
      default: false,
    },
    flagged: {
      type: Boolean,
      default: false,
    },
    popularity: {
      type: Number,
      default: 0,
    },
    private: {
      type: Boolean,
      default: false,
    },
    categories: [String],
    networks: [String],
    counts: {
      activeProposals: {
        type: Number,
        default: 0,
      },
      proposalsCount: {
        type: Number,
        default: 0,
      },
      proposalsCount7d: {
        type: Number,
        default: 0,
      },
      followersCount: {
        type: Number,
        default: 0,
      },
      followersCount7d: {
        type: Number,
        default: 0,
      },
      votesCount: {
        type: Number,
        default: 0,
      },
      votesCount7d: {
        type: Number,
        default: 0,
      },
    },
    rank: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const SCHEMA_RANKING = mongoose.model('Ranking', rankingSchema);

const VotesSchema = new mongoose.Schema({
  appId: String,
  voteId: String,
  createdAt: Date,
});

const SCHEMA_VOTES = mongoose.model('Votes', VotesSchema);

const FollowersSchema = new mongoose.Schema({
  appId: String,
  followerId: String,
  createdAt: Date,
});

const SCHEMA_FOLLOWERS = mongoose.model('Followers', FollowersSchema);

export {
  SCHEMA_SPACE,
  SCHEMA_PROPOSAL,
  SCHEMA_PROFILE,
  SCHEMA_PRIME,
  SCHEMA_PORTAL,
  SCHEMA_REPORT,
  SCHEMA_DELEGATE,
  SCHEMA_RANKING,
  SCHEMA_VOTES,
  SCHEMA_FOLLOWERS,
  SCHEMA_PROPOSALS,
};
