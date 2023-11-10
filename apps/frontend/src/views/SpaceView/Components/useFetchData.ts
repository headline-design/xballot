import { useState, useEffect } from 'react';
import { getAppIdFromDomain } from 'orderFunctions';
import { getEndpoints } from 'utils/endPoints';
import { updateSpaceScoresState } from 'helpers/stateUpdate';
import { useSpaceFetcher } from 'fetcher/fetchers';

const useFetchData = (spaceKey) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const endPoints = getEndpoints();
  const { fetchSpace } = useSpaceFetcher();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const localAppId = await getAppIdFromDomain(spaceKey);
        const domainDataPromise = fetch(endPoints.worker + 'v1/domains/' + localAppId);

        const [domainDataResponse] = await Promise.all([domainDataPromise]);
        const domainDataJSON = await domainDataResponse.json();

        const localSpace = domainDataJSON;
        const localProposals = domainDataJSON?.proposals;
        const localMembers = domainDataJSON?.members?.length;
        let portalDataJSON;
        if (
          localSpace?.forum?.token &&
          localSpace?.forum?.token !== '' &&
          localSpace?.forum?.token !== null
        ) {
          const portalDataResponse = await fetch(endPoints.worker + 'v1/portals/' + localAppId);
          portalDataJSON = await portalDataResponse.json();
        }
        const localPosts = portalDataJSON?.posts;

        // Update scores_state for proposals
        const updatedProposals = await updateSpaceScoresState(localProposals);
        setData({
          space: localSpace,
          proposals: updatedProposals,
          members: localMembers,
          appId: localAppId,
          posts: localPosts,
        });

        setLoading(false);

        // Use the fetchSpace function to fetch the space client-side if it hasn't been loaded yet
        if ((localSpace.error && localAppId) || (!localSpace._id && localAppId)) {
          const fetchedSpace = await fetchSpace(localAppId);
          const localMembers = domainDataJSON?.members;
          console.log(fetchedSpace)
          setData((prevData) => ({
            ...prevData,
            space: fetchedSpace,
            members: localMembers,
          }));
        }
      } catch (e) {
        console.log('Error: ', e);
      }
    };

    const shouldFetchData = spaceKey !== undefined && spaceKey !== null;
    if (shouldFetchData) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [spaceKey, fetchSpace, endPoints.worker]);

  return { data, loading };
};

export default useFetchData;
