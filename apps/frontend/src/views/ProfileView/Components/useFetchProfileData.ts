import { useState, useEffect, useCallback, useMemo } from 'react';
import { getUserDomains, getSettingsObject } from 'orderFunctions';
import { getEndpoints } from 'utils/endPoints';

const useFetchProfileData = (domainKey) => {
  const endPoints = getEndpoints();
  const [domains, setDomains] = useState([]);
  const [dd, setDd] = useState({});
  const [fetchLoading, setFetchLoading] = useState(true);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [localSettings, setLocalSettings] = useState({});

  const primeData = useMemo(() => ({ ...dd[domains[0]], appId: domains[0] }), [dd, domains]);

  const domainData = useMemo(
    () => ({ ...primeData, ...localSettings }),
    [primeData, localSettings],
  );

  const getDomain = useCallback(async () => {
    try {
      setFetchLoading(true);
      const [daoDataResponse, data] = await Promise.allSettled([
        fetch(endPoints.backend + 'index/daos').then((res) => res.json()),
        getUserDomains(domainKey),
      ]);
      if (daoDataResponse.status === 'fulfilled') {
        setDd(daoDataResponse.value);
      }
      if (data.status === 'fulfilled') {
        setDomains(data.value);
      }
    } catch (error) {
      //console.error('Error fetching domains', error);
    } finally {
      setFetchLoading(false);
    }
  }, [domainKey, endPoints.backend]);

  useEffect(() => {
    getDomain();
  }, [getDomain]);

  useEffect(() => {
    const getSettings = async () => {
      if (primeData?.appId) {
        try {
          const settingsObject = await getSettingsObject(primeData?.appId);
          setLocalSettings(settingsObject);
          setSettingsLoaded(true); // move it here after setting localSettings
        } catch (error) {
          //console.error('Error fetching settings', error);
        }
      } else {
        // If there is no primeData.appId, there won't be any settings to load
        setSettingsLoaded(true);
      }
    };

    setSettingsLoaded(false); // Reset settingsLoaded state when starting to fetch settings
    getSettings();
  }, [primeData?.appId]);

  const loading = useMemo(() => fetchLoading || !settingsLoaded, [fetchLoading, settingsLoaded]);

  return { domains, dd, loading, domainData };
};

export default useFetchProfileData;
