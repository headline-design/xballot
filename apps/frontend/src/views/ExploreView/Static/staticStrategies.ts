export const staticStrategies = {
  1: {
    text: 'single-choice',
    title: 'Single choice voting',
    description: 'Each voter may select only one choice.',
  },
  2: {
    text: 'approval',
    title: 'Approval voting',
    description: 'Each voter may select any number of choices.',
  },
  3: {
    text: 'open',
    title: 'Open voting',
    description:
      'Each voter may add any valid text option to input field. Results are calculated by aggregating all votes.',
  },
  4: {
    text: 'quadratic',
    title: 'Quadratic voting',
    description:
      'Each voter may spread voting power across any number of choices. Results are calculated quadratically.',
  },
  5: {
    text: 'ranked-choice',
    title: 'Ranked-choice voting',
    description:
      'Each voter may select and rank any number of choices. Results are calculated by instant-runoff counting method.',
  },
  6: {
    text: 'weighted',
    title: 'Weighted voting',
    description: 'Each voter may spread voting power across any number of choices.',
  },
  7: {
    text: 'basic',
    title: 'Basic voting',
    description: 'Single choice voting with three choices: For, Against or Abstain.',
  },
};
