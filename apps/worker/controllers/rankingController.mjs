import {
  SCHEMA_SPACE,
  SCHEMA_RANKING,
  SCHEMA_PRIME,
} from '@xballot/sdk';
import { NODE_ENV } from '../config.mjs';

const Space = SCHEMA_SPACE;
const Ranking = SCHEMA_RANKING;
const Prime = SCHEMA_PRIME;

async function getProposals(appId) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const space = await Space.findOne({ appId: appId });
  if (!space || !space.proposals) return { count: 0, count_7d: 0 };

  const totalProposals = space.proposals.length;
  const proposalsLastWeek = space.proposals.filter(
    (proposal) => proposal.createdAt >= oneWeekAgo
  ).length;

  return {
    count: totalProposals,
    count_7d: proposalsLastWeek,
  };
}

async function getVotes(appId) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const space = await Space.findOne({ appId: appId });
  if (!space || !space.proposals) return { count: 0, count_7d: 0 };

  let totalVotes = 0;
  let votesLastWeek = 0;

  for (const proposal of space.proposals) {
    if (proposal.scores && proposal.scores.votes) {
      for (const voteId in proposal.scores.votes) {
        if (proposal.scores.votes.hasOwnProperty(voteId)) {
          const vote = proposal.scores.votes[voteId];
          totalVotes++;
          if (vote.votedAt >= oneWeekAgo) {
            votesLastWeek++;
          }
        }
      }
    }
  }

  return {
    count: totalVotes,
    count_7d: votesLastWeek,
  };
}

async function getPrime(appId) {
  const prime = await Prime.findOne({
    [`domains.${appId}`]: { $exists: true },
  });
  console.log('prime', prime);
  console.log('address', prime?.domains?.[appId]?.address);
  return prime;
}

async function getSpace(appId) {
  const space = await Space.findOne({
    appId: appId,
  });
  return space;
}

async function getUserVotes(address) {
  const spaces = await Space.find();

  let totalVotes = 0;
  let userVotes = [];

  for (const space of spaces) {
    if (space.proposals) {
      for (const proposal of space.proposals) {
        if (proposal.scores && proposal.scores.votes) {
          for (const voteId in proposal.scores.votes) {
            if (
              proposal.scores.votes.hasOwnProperty(voteId) &&
              voteId === address
            ) {
              const vote = proposal.scores.votes[voteId];
              totalVotes++;
              userVotes.push({
                space: space.appId,
                proposal: proposal.txid,
                vote,
              });
            }
          }
        }
      }
    }
  }

  return {
    count: totalVotes,
    votes: userVotes,
  };
}

async function getUserProposals(address) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const space = await Space.findOne({ creator: address });
  if (!space || !space.proposals) return { count: 0, count_7d: 0 };

  const totalProposals = space.proposals.length;
  const proposalsLastWeek = space.proposals.filter(
    (proposal) => proposal.createdAt >= oneWeekAgo
  ).length;

  return {
    count: totalProposals,
    count_7d: proposalsLastWeek,
  };
}

async function getUserPopularity(appId, address) {
  const proposalsMetrics = await getUserProposals(address);
  const votesMetrics = await getUserVotes(address);
  const followersMetrics = await getFollowers(appId);

  let popularity =
    (votesMetrics?.count || 0) / 20 +
    (votesMetrics?.count_7d || 0) +
    (proposalsMetrics?.count || 0) / 20 +
    (proposalsMetrics?.count_7d || 0) +
    (followersMetrics?.count || 0) / 10 +
    (followersMetrics?.count_7d || 0);

  return popularity;
}

async function getFollowers(appId) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const space = await Space.findOne({ appId: appId });
  if (!space || !space.members) return { count: 0, count_7d: 0 };

  const totalFollowers = space.members.length;
  const followersLastWeek = space.members.filter(
    (member) => member.joinedAt >= oneWeekAgo
  ).length;

  return {
    count: totalFollowers,
    count_7d: followersLastWeek,
  };
}

async function getPopularity(appId) {
  const proposalsMetrics = await getProposals(appId);
  const votesMetrics = await getVotes(appId);
  const followersMetrics = await getFollowers(appId);

  let popularity =
    (votesMetrics?.count || 0) / 20 +
    (votesMetrics?.count_7d || 0) +
    (proposalsMetrics?.count || 0) / 20 +
    (proposalsMetrics?.count_7d || 0) +
    (followersMetrics?.count || 0) / 10 +
    (followersMetrics?.count_7d || 0);

  return popularity;
}

async function updateSpaceRankings(spaces, spaceRankings) {
  for (const [appId, spaceData] of Object.entries(spaces)) {
    const proposalsMetrics = await getProposals(appId);
    if (proposalsMetrics.count > 0) {
      try {
        const space = await getSpace(appId);
        const proposalsMetrics = await getProposals(appId);
        const votesMetrics = await getVotes(appId);
        const followersMetrics = await getFollowers(appId);
        const popularity = await getPopularity(appId);

        // Find or create a new ranking
        const filter = { appId: parseInt(appId) };
        console.log('spaceData', spaceData);
        const update = {
          id: parseInt(appId),
          name: space.name || '',
          avatar: space.avatar || '',
          address: space.creator || '',
          domain: spaceData.domain,
          appId: parseInt(appId),
          popularity: popularity,
          type: 'space',
          counts: {
            activeProposals: 0,
            proposalsCount: proposalsMetrics.count,
            proposalsCount7d: proposalsMetrics.count_7d,
            followersCount: followersMetrics.count,
            followersCount7d: followersMetrics.count_7d,
            votesCount: votesMetrics.count,
            votesCount7d: votesMetrics.count_7d,
          },
        };

        // If the ranking for this appId already exists, update it.
        // Otherwise, create a new one.
        if (spaceRankings[appId] !== undefined) {
          Object.assign(spaceRankings[appId], update);
        } else {
          spaceRankings[appId] = update;
        }

        if (NODE_ENV !== 'development') {
          await Ranking.findOneAndUpdate(filter, update, {
            new: true,
            upsert: true, // Make this update into an upsert
            setDefaultsOnInsert: true,
            useFindAndModify: false,
          });
        }
        console.log(`Ranking updated for appId ${appId}`);
      } catch (error) {
        console.error(`Error updating popularity for appId ${appId}: ${error}`);
      }
    } else {
      console.log(`No proposals found for appId ${appId}`);
    }
  }

  console.log(`No proposals found for appId ${appId}`);
}

async function updateUserRankings(spaces, userRankings) {
  for (const [appId, spaceData] of Object.entries(spaces)) {
    const proposalsMetrics = await getProposals(appId);
    if (proposalsMetrics.count === 0) {
      try {
        const prime = await getPrime(appId);
        if (!prime) continue;
        const domain = prime.domains.get(appId.toString());
        const avatar = domain?.settings?.avatar;
        const name = domain?.settings?.name;
        const address = prime?.address;
        const proposalsMetrics = await getUserProposals(prime?.address);
        const votesMetrics = await getUserVotes(prime?.address);
        const followersMetrics = await getFollowers(appId);
        const popularity = await getUserPopularity(appId, prime.address);

        // Find or create a new ranking
        const filter = { appId: parseInt(appId) };
        const update = {
          id: parseInt(appId),
          name: name || '',
          avatar: avatar || '',
          address: address || '',
          domain: spaceData.domain,
          appId: parseInt(appId),
          popularity: popularity,
          type: 'user',
          counts: {
            activeProposals: 0, // Update this if you have the data
            proposalsCount: proposalsMetrics.count,
            proposalsCount7d: proposalsMetrics.count_7d,
            followersCount: followersMetrics.count,
            followersCount7d: followersMetrics.count_7d,
            votesCount: votesMetrics.count,
            votesCount7d: votesMetrics.count_7d,
          },
        };

        // If the ranking for this appId already exists, update it.
        // Otherwise, create a new one.
        if (userRankings[appId] !== undefined) {
          Object.assign(userRankings[appId], update);
        } else {
          userRankings[appId] = update;
        }

        if (NODE_ENV !== 'development') {
          await Ranking.findOneAndUpdate(filter, update, {
            new: true,
            upsert: true, // Make this update into an upsert
            setDefaultsOnInsert: true,
            useFindAndModify: false,
          });
        }
        console.log(`Ranking updated for appId ${appId}`);
      } catch (error) {
        console.error(`Error updating popularity for appId ${appId}: ${error}`);
      }
    } else {
      console.log(`No proposals found for appId ${appId}`);
    }
  }

  console.log(`No proposals found for appId ${appId}`);
}

export { updateSpaceRankings, updateUserRankings };
