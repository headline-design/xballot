function parseQuadraticVotes(voteOption, choiceSet) {
  const votePattern = /([\d.]+)% for (Quad \d+)/g;
  const votes = {};
  let match;
  while ((match = votePattern.exec(voteOption)) !== null) {
    const percentage = parseFloat(match[1]);
    const option = match[2];
    if (!choiceSet.has(option)) {
      return false;
    }
    votes[option] = percentage;
  }
  return votes;
}

function parseWeightedVotes(voteOption, choiceSet) {
  const votePattern = /([\d.]+)% for (Quad \d+)/g;
  const votes = {};
  let match;
  while ((match = votePattern.exec(voteOption)) !== null) {
    const percentage = parseFloat(match[1]);
    const option = match[2];
    if (!choiceSet.has(option)) {
      return false;
    }
    votes[option] = percentage;
  }
  return votes;
}

function parseRankedChoiceVotes(voteOption, choiceSet) {
  const voteOptions = voteOption.split(", ");
  const parsedVotes = [];
  for (const option of voteOptions) {
    const foundChoice = option.match(/\(([1-9][0-9]*)(?:st|nd|rd|th)\) (.+)/);
    if (foundChoice) {
      if (!choiceSet.has(foundChoice[2])) {
        return false;
      }
      parsedVotes.push(foundChoice[2]);
    } else {
      return false;
    }
  }
  return parsedVotes;
}

function parseApprovalVotes(voteOption, choiceSet) {
  const voteOptions = voteOption.split(", ");
  const parsedVotes = [];
  for (const option of voteOptions) {
    const trimmedOption = option.trim();
    if (!choiceSet.has(trimmedOption)) {
      return false;
    }
    parsedVotes.push(trimmedOption);
  }
  return parsedVotes;
}

function parseSingleChoiceVotes(voteOption, choiceSet) {
  const trimmedOption = voteOption.trim();
  if (!choiceSet.has(trimmedOption)) {
    return false;
  }
  return trimmedOption;
}

function parseOpenVotes(voteOption) {
  const trimmedOption = voteOption.trim();
  const parsedOption = isNaN(trimmedOption)
    ? trimmedOption
    : parseInt(trimmedOption, 10);
  return parsedOption;
}

export {
  parseQuadraticVotes,
  parseWeightedVotes,
  parseRankedChoiceVotes,
  parseApprovalVotes,
  parseSingleChoiceVotes,
  parseOpenVotes,
};
