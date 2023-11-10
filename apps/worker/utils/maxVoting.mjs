import { getVotes, getRoundCached, calculateVoteTally } from "./utils.mjs";

// Function to check if a vote has expired
// Runs final vote tally if expired

newP.finalized = newP.maxRound < currentRound;
newP.locked = newP.finalized && newP.scores?.votes?.length > 0;

for (const proposal of updatedProposals) {
  const proposalId = proposal.txid;

  // While the proposal is still ongoing
  while (proposal.maxRound >= currentRound) {
    // Continuously update the vote tally
    await updateVoteTallyForProposal(proposal);
    console.log("updated vote tally for", proposalId);

    // delay to prevent excessive updates
    await new Promise((resolve) => setTimeout(resolve, 10000));

    // Ensure the currentRound value is updated
    let currentRound = await getRoundCached();
    console.log("currentRound", currentRound);
  }

  // Once the vote has expired
  if (proposal.maxRound < currentRound) {
    let voteExpired = false;
    let retries = 2; // Number of retries for finalizing vote

    while (!voteExpired && retries > 0) {
      if (await hasVoteExpired(proposal)) {
        voteExpired = true;
      } else {
        retries--;
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }
}

async function hasVoteExpired(proposal) {
  let retries = 1;

  while (retries > 0) {
    try {
      const currentRound = await getRoundCached();
      if (currentRound < proposal?.maxRound) {
        //console.log("firing 3");
        const voteTally = await getVotes(
          proposal?.txid,
          proposal?.appId,
          proposal?.token,
          proposal?.maxRound,
          proposal?.minRound,
          proposal?.strategyType,
          proposal?.choices,
          proposal?.isFirstTimeFetch
        );
        //console.log("firing 4", voteTally);
        return voteTally;
      } else {
        if (currentRound > proposal?.maxRound) {
          proposal.finalized = true;
        }
        return null;
      }
    } catch (error) {
      console.error(
        "An error occurred while checking if vote has expired:",
        error
      );
      retries--;
      if (retries > 0) {
        await new Promise((res) => setTimeout(res, 1000));
      } else {
        return false;
      }
    }
  }

  console.error("hasVoteExpired failed after 3 retries");
  return false;
}

async function updateVoteTallyForProposal(proposal) {
  try {
    let voteData = null;

    if (!proposal.finalized) {
      voteData = await hasVoteExpired(proposal);
    }

    const voteTally = calculateVoteTally(
      voteData || proposal.scores.votes,
      proposal.strategyType,
      proposal.choices
    );

    return voteTally;
  } catch (error) {
    console.error("An error occurred while updating vote tally:", error);
    return null;
  }
}

export { hasVoteExpired, updateVoteTallyForProposal };
