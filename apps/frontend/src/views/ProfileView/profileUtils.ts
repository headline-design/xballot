import { ExtendedSpace } from 'helpers/interfaces';

export const AccountViewTypes = {
  BASE: '',
  ACTIVITY: 'activity',
  ABOUT: 'about',
  DOMAIN: 'domain',
};

export const PROFILE_ROUTE_PATHS = {
  profile: {
    base: '/',
    feed: '/feed',
    about: '/about',
  },
};

export function memoize(func) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    } else {
      const result = func(...args);
      cache.set(key, result);
      return result;
    }
  };
}

export const ProfileViewTypes = {
    BASE: '',
    ACTIVITY: 'activity',
    ABOUT: 'about',
    DOMAIN: 'domain',
  };

  export const walletViews = [
    { label: 'Overview', link: 'wallet/overview', value: '4', end: true },
    { label: 'Accounts', link: 'wallet/accounts', value: '5', end: true },
    { label: 'Rewards', link: 'wallet/rewards', value: '6', end: true },
    { label: 'Home', link: 'activity', value: '7', end: true },
  ];

  export const ACCOUNT_ROUTE_PATHS = {
    profile: {
      base: '/',
      activity: '/activity',
      about: '/about',
      domains: '/domains',
      wallet: '/wallet/overview',
    },
    wallet: {
      base: '/wallet/overview',
      accounts: '/wallet/accounts',
      rewards: '/wallet/rewards',
    },
  };

  export const computeSpaces = (apps, domainKey, filterFunction, findNestedObject, profiles) => {
    return apps
      .filter((app) => filterFunction(app.creator))
      .map((app) => {
        const domainData = findNestedObject(profiles, 'domain', app.domain);
        return {
          ...app,
          domainData,
        };
      });
  };