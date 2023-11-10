import { useQuery } from 'react-query';
import { getEndpoints, staticEndpoints } from 'utils/endPoints';

export const fetchApps = async ({ queryKey }) => {
    const endPoints = getEndpoints(); // Make sure you have access to getEndpoints
    const [_key, profileKey, spaces] = queryKey;
    try {
      const daoResponse = await fetch(`${endPoints.backend}index/daos`);

      if (!daoResponse.ok) {
        console.error('daoResponse was not ok');
        console.log('daoResponse status: ', daoResponse.status);
        return [];
      }
      const daoData = await daoResponse.json();
      const daoApps = Object.keys(daoData);

      let accountData;
      if (profileKey) {
        const accountResponse = await fetch(`${endPoints.indexer}accounts/${profileKey}`);
        console.log(`${endPoints.indexer}accounts/${profileKey}`);
        accountData = await accountResponse.json();
      }

      const appStates = accountData?.account?.['apps-local-state'];
      if (!appStates) {
        return [];
      }

      const myOpted = appStates
        .filter((app) => daoApps.includes(app.id.toString()))
        .reduce((accum, app) => {
          const appId = app.id.toString();
          const space = spaces?.[appId];
          accum[appId] = {
            optedRound: app['opted-in-at-round'],
            appId: app.id,
            id: appStates.indexOf(app) + 1,
            creator: daoData[appId].creator,
            enabled: daoData[appId].enabled,
            asset: daoData[appId].creator,
            domain: daoData[appId].domain,
            name: space?.name || daoData[appId].domain,
            space: space,
            avatar: space?.avatar,
            members: space?.members,
            content:
              space?.avatar || // If space is available and avatar is present, use it
              `${staticEndpoints.stamp}avatar/algo:${daoData[appId].domain}?s=100`,
          };
          return accum;
        }, {});

      return Object.values(myOpted);
    } catch (error) {
      console.error(error);
      return [];
    }
  };

export const useFetchApps = (profileKey, spaces) => {



  return useQuery(['fetchedApps', profileKey, spaces], fetchApps, {
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}