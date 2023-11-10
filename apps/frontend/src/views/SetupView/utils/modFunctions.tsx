export function getFaqBody(percentage) {
  switch (percentage) {
    case 15:
      return 'Sign transaction(s) to complete XBallot account registration.';
    case 30:
      return 'Send payment transaction to continue registration of your XBallot account today.';
    case 45:
      return 'Send request to the registrar to mint your shiny new XBallot account.';
    case 60:
      return 'If your connection is interrupted, you can complete domain registration by visiting your profile.';
    case 80:
      return 'Send request to the registrar to ship your brand new XBallot account.';
    case 100:
      return 'Continue domain setup to choose the initial state of your new XBallot account.';
    default:
      return null;
  }
}

export function getTitleText(percentage) {
  switch (percentage) {
    case 15:
      return 'Step 1/5 - Create application';
    case 30:
      return 'Step 2/5 - Send payment';
    case 45:
      return 'Step 3/5 - Mint domain';
    case 60:
      return 'Step 4/5 - Opt into asset';
    case 80:
      return 'Step 5/5 - Request asset';
    case 100:
      return 'Continue domain setup';
    default:
      return null;
  }
}

export function getLoaderModalTimerText(percentage) {
  switch (percentage) {
    case 15:
      return 'Sign app creation transaction';
    case 30:
      return 'Sign payment transaction';
    case 45:
      return 'Generate domain asset Id';
    case 60:
      return 'Sign asset opt in transaction';
    case 80:
      return 'Ping for domain';
    case 100:
      return 'Registration complete';
    default:
      return null;
  }
}
