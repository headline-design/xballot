export const VOTES_QUERY = `
  query Votes(
    $id: String!
    $first: Int
    $skip: Int
    $orderBy: String
    $orderDirection: OrderDirection
    $voter: String
    $space: String
  ) {
    votes(
      first: $first
      skip: $skip
      where: { proposal: $id, vp_gt: 0, voter: $voter, space: $space }
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      ipfs
      voter
      choice
      vp
      vp_by_strategy
      reason
      created
    }
  }
`;

export const PROPOSAL_QUERY = `
  query Proposal($id: String!) {
    proposal(id: $id) {
      id
      ipfs
      title
      body
      discussion
      choices
      start
      end
      snapshot
      state
      author
      created
      plugins
      network
      type
      quorum
      symbol
      privacy
      validation {
        name
        params
      }
      strategies {
        name
        network
        params
      }
      space {
        id
        name
      }
      scores_state
      scores
      scores_by_strategy
      scores_total
      votes
      # delegation
    }
  }
`;

export const PROPOSALS_QUERY = `
  query Proposals(
    $first: Int!
    $skip: Int!
    $state: String!
    $space: String
    $space_in: [String]
    $author_in: [String]
  ) {
    proposals(
      first: $first
      skip: $skip
      where: {
        space: $space
        state: $state
        space_in: $space_in
        author_in: $author_in
      }
    ) {
      id
      ipfs
      title
      body
      start
      end
      state
      author
      created
      choices
      space {
        id
        name
        members
        avatar
        symbol
      }
      scores_state
      scores_total
      scores
      votes
      quorum
      symbol
    }
  }
`;

export const NOTIFICATION_PROPOSALS_QUERY = `
  query Proposals(
    $first: Int!
    $state: String!
    $space_in: [String]
    $start_gte: Int
  ) {
    proposals(
      first: $first
      where: { state: $state, space_in: $space_in, start_gte: $start_gte }
    ) {
      id
      title
      start
      end
      state
      space {
        id
        name
        avatar
      }
    }
  }
`;

export const FOLLOWS_QUERY = `
  query Follows($space_in: [String], $follower_in: [String]) {
    follows(
      where: { space_in: $space_in, follower_in: $follower_in }
      first: 500
    ) {
      id
      follower
      space {
        id
      }
    }
  }
`;

export const SUBSCRIPTIONS_QUERY = `
  query Subscriptions($space: String, $address: String) {
    subscriptions(where: { space: $space, address: $address }) {
      id
      address
      space {
        id
      }
    }
  }
`;

export const ALIASES_QUERY = `
  query Aliases($address: String!, $alias: String!) {
    aliases(where: { address: $address, alias: $alias }) {
      address
      alias
    }
  }
`;

export const SPACES_QUERY = `
  query Spaces($id_in: [String]) {
    spaces(where: { id_in: $id_in }, first: 200) {
      id
      name
      about
      network
      symbol
      network
      terms
      skin
      avatar
      twitter
      website
      github
      coingecko
      private
      domain
      members
      admins
      categories
      plugins
      followersCount
      parent {
        id
        name
        avatar
        followersCount
        children {
          id
        }
      }
      children {
        id
        name
        avatar
        followersCount
        parent {
          id
        }
      }
      voting {
        delay
        period
        type
        quorum
        privacy
        hideAbstain
      }
      strategies {
        name
        network
        params
      }
      validation {
        name
        params
      }
      voteValidation {
        name
        params
      }
      filters {
        minScore
        onlyMembers
      }
      treasuries {
        name
        address
        network
      }
    }
  }
`;

export const XBallot_DOMAINS_BY_ACCOUNT_QUERY = `
  query Domain($id: String!) {
    account(id: $id) {
      domains {
        name
      }
    }
  }
`;

export const XBallot_DOMAIN_BY_HASH_QUERY = `
  query Registration($id: String!) {
    registration(id: $id) {
      domain {
        name
        labelName
      }
    }
  }
`;

export const SPACE_SKIN_QUERY = `
  query Space($id: String!) {
    space(id: $id) {
      skin
    }
  }
`;

export const SPACE_DELEGATE_QUERY = `
  query Space($id: String!) {
    space(id: $id) {
      id
      symbol
      network
      strategies {
        name
        network
        params
      }
    }
  }
`;

export const SKINS_COUNT_QUERY = `
  query Skins {
    skins {
      id
      spacesCount
    }
  }
`;

export const NETWORKS_COUNT_QUERY = `
  query Networks {
    networks {
      id
      spacesCount
    }
  }
`;

export const PLUGINS_COUNT_QUERY = `
  query Plugins {
    plugins {
      id
      spacesCount
    }
  }
`;

export const VALIDATIONS_COUNT_QUERY = `
  query Validations {
    validations {
      id
      spacesCount
    }
  }
`;

export const STRATEGIES_QUERY = `
  query Strategies {
    strategies {
      id
      author
      version
      spacesCount
    }
  }
`;

export const EXTENDED_STRATEGY_QUERY = `
  query Strategy($id: String!) {
    strategy(id: $id) {
      id
      author
      version
      spacesCount
      about
      schema
      examples
    }
  }
`;

export const ACTIVITY_VOTES_QUERY = `
  query Votes(
    $voter: String!
    $first: Int
    $skip: Int
    $orderBy: String
    $orderDirection: OrderDirection
  ) {
    votes(
      first: $first
      skip: $skip
      where: { voter: $voter }
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      created
      choice
      proposal {
        id
        title
        choices
        type
      }
      space {
        id
        avatar
      }
    }
  }
`;

export const PROFILES_QUERY = `
  query Users($addresses: [String]!, $first: Int, $skip: Int) {
    users(first: $first, skip: $skip, where: { id_in: $addresses }) {
      id
      name
      about
      avatar
      created
    }
  }
`;

export const USER_VOTED_PROPOSAL_IDS_QUERY = `
  query Votes($voter: String!, $proposals: [String]!) {
    votes(where: { voter: $voter, proposal_in: $proposals }) {
      proposal {
        id
      }
    }
  }
`;
