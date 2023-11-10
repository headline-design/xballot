import { EllipsisVerticalIcon } from 'icons/EllipsisVerticalIcon';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { useAppStore } from '../../../store/useAppStore';
import NavMenu from './NavMenu';
import NavbarAccount from './NavbarAccount';
import { ButtonRounded } from '../ButtonRounded';
import { NavbarContainer } from './NavbarContainer';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Pipeline from '@pipeline-ui-2/pipeline/index';
import { getSettingsObject, getUserApps, getUserDomains } from 'orderFunctions';
import { isEmpty } from 'lodash';
import { useAppDispatch } from '../../../redux/hooks';
import { updateDomainData } from '../../../redux/global/global';
import { LoginIcon } from 'icons/LoginIcon';
import { MOBILE, useMediaQuery } from 'utils/useMediaQuery';
import { getEndpoints, staticEndpoints } from '../../../utils/endPoints';
import NavbarNotification from './NavbarNotification';
import SpacesContext from 'contexts/SpacesContext';
import { ExtendedSpace } from 'helpers/interfaces';
import { updateMySpaces } from '../../../redux/global/global';
import { useSelector } from 'react-redux';
import ProfilesContext from 'contexts/ProfilesContext';

const MemoizedNavbarAccount = React.memo(NavbarAccount);
const MemoizedNavMenu = React.memo(NavMenu);
const MemoizedNavbarNotification = React.memo(NavbarNotification);

export const Navbar = ({ upStream, upStreamDomain, onLoadingChange }) => {
  const endPoints = getEndpoints();
  const dispatch = useAppDispatch();
  const showSidebar = useAppStore((state) => state.showSidebar);
  const setShowSidebar = useAppStore((state) => state.setShowSidebar);
  const domainKey = Pipeline.address;
  const spaces: ExtendedSpace = useContext(SpacesContext);
  const profiles = useContext(ProfilesContext);
  const mySpaces = useSelector((state: any) => state.global.mySpaces);

  const [domains, setDomains] = useState([]);
  let transformedProfiles = {};

  for (let key in profiles) {
    const profileObj = profiles[key];
    for (let appId in profileObj) {
      transformedProfiles[appId] = profileObj[appId];
    }
  }

  const [spaceApps, setSpaceApps] = useState([]);
  const [profileApps, setProfileApps] = useState([]);
  const [dd, setDd] = useState({});
  const [loading, setLoading] = useState(true);
  const daosUrl = endPoints.backend + 'index/daos';

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [daoDataResponse, data] = await Promise.allSettled([
        fetch(daosUrl).then((res) => res.json()),
        getUserDomains(domainKey),
      ]);

      if (daoDataResponse.status === 'fulfilled') {
        setDd(daoDataResponse.value);
      }

      if (data.status === 'fulfilled') {
        setDomains(data.value);
      }
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  }, [domainKey]);

  const primeData = useMemo(() => ({ ...dd[domains[0]], appId: domains[0] }), [dd, domains]);
  const [localSettings, setLocalSettings] = useState({});

  const [hasChecked, setHasChecked] = useState(false);

  const updateMySpacesWithApps = (spaceApps, spaces, profileApps, profiles) => {
    const localSpace = [];
    const localProfile = [];

    spaceApps.forEach((app, index) => {
      const space = spaces[app.id];
      if (space) {
        const nextIndex = localSpace.length + 1;
        localSpace.push({
          appId: app.id,
          _id: nextIndex,
          domain: space.domain,
          content: space?.avatar || `${staticEndpoints.stamp}avatar/algo:${space.domain}?s=100`,
          type: 'space',
        });
      }
    });

    profileApps.forEach((app, index) => {
      const profile = transformedProfiles[app.id];
      if (profile && !localSpace.find((space) => space.appId === app.id)) {
        const nextIndex = localSpace.length + localProfile.length + 1; // Continue the index
        localProfile.push({
          appId: app.id,
          _id: nextIndex,
          domain: profile?.domain || profile?.settings?.domain,
          content: profile?.avatar ||
            profile?.settings?.avatar ||
            `${staticEndpoints.stamp}avatar/algo:${profile?.domain || profile?.settings?.domain}?s=100`,
          type: 'profile',
        });
      }
    });

    if (!hasChecked && mySpaces && mySpaces.length === 0 && primeData.appId !== undefined) {
      dispatch(updateMySpaces([...localSpace, ...localProfile]));
      setHasChecked(true);
    }
  };


  const fetchAppData = useCallback(async () => {
    try {
      const [appDataResponse] = await Promise.allSettled([getUserApps(domainKey)]);

      if (appDataResponse.status === 'fulfilled') {
        const matchedSpaceApps = appDataResponse.value.filter(
          (app) => app.id && spaces && spaces[app.id] !== undefined,
        );
        const matchedProfileApps = appDataResponse.value.filter(
          (app) => app.id && transformedProfiles && transformedProfiles[app.id] !== undefined,
        );
        setProfileApps(matchedProfileApps);
        setProfileApps(matchedProfileApps);
        updateMySpacesWithApps(matchedSpaceApps, spaces, matchedProfileApps, profiles);
      }
    } catch (error) {
      console.error('Error fetching data', error);
    }
  }, [domainKey, spaces, mySpaces, profiles, primeData.appId]);

  useEffect(() => {
    fetchData();
    fetchAppData();
  }, [fetchData, fetchAppData]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsObject = await getSettingsObject(primeData?.appId);
        setLocalSettings(settingsObject);
      } catch (error) {
        console.error('Error fetching settings', error);
      }
    };

    if (primeData?.appId) {
      fetchSettings();
    }
  }, [primeData]);

  const domainData = useMemo(
    () => ({ ...primeData, ...localSettings }),
    [primeData, localSettings],
  );

  useEffect(() => {
    if (!isEmpty(domainData)) {
      dispatch(updateDomainData(domainData));
      upStreamDomain(domainData);
    }
  }, [domainData]);

  const [pipeState, setPipeState] = useState({
    myAddress: '',
    checked: true,
    labelNet: '',
  });

  const handleUpStream = (globalPipeState) => {
    setPipeState(globalPipeState);
    upStream(globalPipeState);
  };

  const isMobile = useMediaQuery(MOBILE);
  const MemoizedLoginIcon = React.memo(LoginIcon);

  const handleLoadingChange = (isLoading) => {
    onLoadingChange(isLoading);
  };

  return (
    <div>
      <NavbarContainer className={clsx('pl-0 pr-3 sm:!px-4')}>
        <div className="flex items-center py-[12px]">
          <div className="ml-3 flex flex-auto items-center">
            <ButtonRounded className="sm:hidden" onClick={() => setShowSidebar(!showSidebar)}>
              <EllipsisVerticalIcon />
            </ButtonRounded>
            <Link
              to="/"
              className="router-link-active router-link-exact-active -ml-3 hidden items-center sm:block"
              style={{ fontSize: '24px' }}
            >
              XBallot
            </Link>
          </div>
          <div className="flex space-x-2">
            <MemoizedNavbarAccount
              navbar={true}
              domainData={domainData}
              upStream={handleUpStream}
              className={
                isMobile
                  ? 'relative flex !h-[46px] !w-[46px] cursor-pointer select-none items-center justify-center rounded-full border hover:border-skin-text'
                  : 'button px-[22px]'
              }
              onLoadingChange={handleLoadingChange}
            >
              {isMobile ? <MemoizedLoginIcon /> : 'Connect wallet'}
            </MemoizedNavbarAccount>
            <MemoizedNavbarNotification pipeState={pipeState} />
            <MemoizedNavMenu />
          </div>
        </div>
      </NavbarContainer>
    </div>
  );
};
