import React, { useMemo, memo, useContext, useState, useCallback } from 'react';
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { Container } from 'components/BaseComponents/Container';
import useFetchProfileData from './Components/useFetchProfileData';
import ProfileFeed from './ProfileFeed';
import ProfileAbout from './ProfileAbout';
import { useSidebar } from './Components/useProfileSidebar';
import PipeStateContext from 'contexts/PipeStateContext';
import MySpacesContext from 'contexts/MySpacesContext';
import SpacesContext from 'contexts/SpacesContext';
import ProfileSettings from './Components/ProfileSettings';
import { getEndpoints, staticEndpoints } from 'utils/endPoints';
import { useQuery } from 'react-query';
import ProfilesContext from 'contexts/ProfilesContext';
import { PROFILE_ROUTE_PATHS as ROUTE_PATHS, computeSpaces } from './profileUtils';
import OptButton from 'components/OptButton';
import { EditPencil } from 'icons/EditPencil';
import { useProfileInfo } from 'hooks/useProfileInfo';

const MemoizedProfileFeed = memo(ProfileFeed);
const MemoizedProfileAbout = memo(ProfileAbout);
const endPoints = getEndpoints();

const fetchApps = async ({ queryKey }) => {
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

const ProfileView = () => {
  const spaces = useContext(SpacesContext);
  const profiles = useContext(ProfilesContext);
  const location = useLocation();
  const { domainKey } = useParams();
  const pipeState = useContext(PipeStateContext);
  const mySpaces = useContext(MySpacesContext);
  const { pathname } = location;

  const profileViews = useMemo(() => {
    const views = [
      { label: 'Feed', link: 'feed', value: '0', end: true },
      { label: 'About', link: 'about', value: '1', end: true },
    ];
    return views;
  }, []);

  const selectedProfileViewIndex = useMemo(() => {
    const path = pathname.split('/')[3] || '';
    return profileViews.findIndex((view) => view.link === path);
  }, [pathname, profileViews]);

  const [activeViews, setActiveViews] = useState(profileViews);
  const [activeIndex, setActiveIndex] = useState(selectedProfileViewIndex);

  function findNestedObject(nestedObj, keyQuery, valueQuery) {
    if (nestedObj?.[keyQuery] === valueQuery) return nestedObj;
    console.log('nestedObj', nestedObj);
    for (let key in nestedObj) {
      if (typeof nestedObj[key] === 'object') {
        let result = findNestedObject(nestedObj[key], keyQuery, valueQuery);
        let appId = nestedObj.appId;
        if (result) {
          return {
            appId,
            ...result,
          };
        }
      }
    }
  }

  const domainData = useMemo(
    () => findNestedObject(profiles, 'domain', domainKey),
    [profiles, domainKey],
  );

  const profileKey = domainData?.creator;

  const { data: fetchedApps, isLoading: isFetchingApps } = useQuery(
    ['fetchedApps', profileKey, spaces],
    fetchApps,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );

  const createdSpaces = useMemo(
    () => computeSpaces((fetchedApps as any) || [], domainKey, (creator) => creator === domainKey),
    [fetchedApps, domainKey],
  );
  const joinedSpaces = useMemo(
    () => computeSpaces((fetchedApps as any) || [], domainKey, (creator) => creator !== domainKey),
    [fetchedApps, domainKey],
  );

  const allMySpaces = useMemo(
    () => [...createdSpaces, ...joinedSpaces],
    [createdSpaces, joinedSpaces],
  );

  const toggleModal = useCallback(() => {
    setIsModalOpen((prev) => !prev);
  }, []);

  const { domains, dd, loading } = useFetchProfileData(domainKey);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const profileButton = useMemo(
    () => (
      <div className="flex flex-grow justify-end lg:mt-3 lg:flex-auto lg:justify-center">
        <button
          type="button"
          data-v-4a6956ba="true"
          className="button connected-btn-header button flex items-center whitespace-nowrap px-[22px]"
          onClick={() => toggleModal()}
        >
          <EditPencil className="sm:hidden" />
          <span className="hidden sm:block"> Edit profile </span>
        </button>
      </div>
    ),
    [toggleModal],
  );

  const optButton = useMemo(
    () => (
      <div className="flex flex-grow justify-end lg:mt-3 lg:flex-auto lg:justify-center">
        <OptButton
          applicationId={domainData?.appId}
          space={domainData}
          spaceKey={domainData?.domain}
          bg={''}
          optInLabel="Follow"
          optOutLabel="Unfollow"
          optedLabel="Following"
          type="profile"
        />
      </div>
    ),
    [domainData],
  );

  console.log(domainData);

  const actionButton = useMemo(
    () => (
      <>
        {pipeState?.myAddress === profileKey && profileButton}
        {(!pipeState || pipeState?.myAddress !== profileKey) && domainData?.appId && optButton}
      </>
    ),
    [pipeState?.myAddress, profileKey, profileButton, domainData?.appId, optButton],
  );

  const { creatorName, creatorAvatar } = useProfileInfo(profiles, profileKey);

  const { ProfileSidebarComponent } = useSidebar(
    profileKey,
    creatorName,
    creatorAvatar || `${staticEndpoints.stamp}space/${profileKey}`,
    loading,
    activeViews,
    activeIndex,
    actionButton,
  );

  return (
    <MySpacesContext.Provider value={mySpaces}>
      <Container>
        {ProfileSidebarComponent}
        <Routes>
        <Route path="*" element={<Navigate to={`/profile/${domainKey}/feed`} replace />} />
          <Route
            loader={(params) => params}
            path={ROUTE_PATHS.profile.feed}
            element={<MemoizedProfileFeed address={domainKey} allMySpaces={allMySpaces} />}
          />
          <Route
            loader={(params) => params}
            path={ROUTE_PATHS.profile.about}
            element={
              <MemoizedProfileAbout
                domainData={domainData}
                createdSpaces={createdSpaces}
                joinedSpaces={joinedSpaces}
                loading={loading}
              />
            }
          />
        </Routes>
        <ProfileSettings
          address={domainKey}
          domainData={domainData}
          handleDisabled={undefined}
          isOpen={isModalOpen}
          closeModal={toggleModal}
          domains={domains}
          pipeState={pipeState}
          profileKey={domainKey}
        />
      </Container>
    </MySpacesContext.Provider>
  );
};

export default React.memo(ProfileView);
