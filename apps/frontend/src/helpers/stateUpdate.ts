import { getRound } from "orderFunctions";

// Helper function to update scores_state based on date condition
export async function updateSpacesScoresState(spaces) {
  try {
    let currentRound = await getRound();
    const now = Date.now() / 1000;

    // Loop through each space
    for (let space in spaces) {
      // Check if space has proposals
      if (spaces[space].proposals) {
        // Loop through each proposal in a space
        spaces[space].proposals.forEach((proposal) => {
          // Update scores_state based on date condition
          if (now < proposal.start) {
            proposal.scores_state = 'pending';
          } else if (currentRound <= proposal.maxRound) {
            proposal.scores_state = 'active';
          } else if (currentRound >= proposal.maxRound && !proposal.validation) {
            proposal.scores_state = 'closed';
          } else if (now >= proposal.end && proposal.validation) {
            proposal.scores_state = 'final';
          }
        });
      }
    }
    return spaces;
  } catch (error) {
    // Handle the error appropriately
    console.error('Error updating scores_state for spaces:', error);
  }
}

export async function updateSpaceScoresState(proposals) {
  try {
    let currentRound = await getRound();
    const now = Date.now() / 1000;

    // Check if proposals is an array
    if (Array.isArray(proposals)) {
      // Loop through each proposal
      proposals.forEach((proposal) => {
        // Update scores_state based on date condition
        if (now < proposal.start) {
          proposal.scores_state = 'pending';
        } else if (currentRound <= proposal.maxRound) {
          proposal.scores_state = 'active';
        } else if (currentRound >= proposal.maxRound && !proposal.validation) {
          proposal.scores_state = 'closed';
        } else if (now >= proposal.end && proposal.validation) {
          proposal.scores_state = 'final';
        }
      });
    }

    return proposals;
  } catch (error) {
    // Handle the error appropriately
    console.error('Error updating scores_state for proposals:', error);
  }
}