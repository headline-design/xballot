import React, { useMemo, memo, useContext, useState, useCallback } from 'react';
import { Route, Routes, useLocation, useParams } from 'react-router-dom';
import { Container } from 'components/BaseComponents/Container';
import useFetchProfileData from './Components/useFetchProfileData';
import ProfileActivity from './ProfileActivity';
import ProfileAbout from './ProfileAbout';
import ProfileDomain from './ProfileDomain';
import { useSidebar } from './Components/useProfileSidebar';
import PipeStateContext from 'contexts/PipeStateContext';
import MySpacesContext from 'contexts/MySpacesContext';
import SpacesContext from 'contexts/SpacesContext';
import ProfileSettings from './Components/ProfileSettings';
import { getEndpoints, staticEndpoints } from 'utils/endPoints';
import { useQuery } from 'react-query';
import WalletOverview from './ProfileWallet/WalletOverview';
import WalletAccounts from './ProfileWallet/WalletAccounts';
import WalletRewards from './ProfileWallet/WalletRewards';
import { useProfileInfo } from 'hooks/useProfileInfo';
import { EditPencil } from 'icons/EditPencil';
import ProfilesContext from 'contexts/ProfilesContext';
import { ACCOUNT_ROUTE_PATHS as ROUTE_PATHS, computeSpaces, walletViews } from './profileUtils';
import { ExtendedSpace } from 'helpers/interfaces';

const MemoizedProfileActivity = memo(ProfileActivity);
const MemoizedProfileAbout = memo(ProfileAbout);
const MemoizedProfileDomain = memo(ProfileDomain);
const MemoizedWalletOverview = memo(WalletOverview);
const MemoizedWalletAccounts = memo(WalletAccounts);
const MemoizedWalletRewards = memo(WalletRewards);
const endPoints = getEndpoints();

interface IFetchedApps {
  filteredSpaces: any[];
  filteredProfiles: any[];
}

const fetchApps = async ({ queryKey }) => {
  const [_key, domainKey, spacesQuery] = queryKey;
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
    if (domainKey.length === 58) {
      const accountResponse = await fetch(`${endPoints.indexer}accounts/${domainKey}`);
      if (!accountResponse.ok) {
        console.log('accountResponse status: ', accountResponse.status);
        return [];
      }
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
        const space = spacesQuery?.[appId];
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
            space?.avatar || `${staticEndpoints.stamp}avatar/algo:${daoData[appId].domain}?s=100`,
        };
        return accum;
      }, {});

    const filteredSpaces = [];
    const filteredProfiles = [];

    Object.values(myOpted).forEach((item: ExtendedSpace) => {
      if (item.space && item.space.proposals && item.space.proposals.length > 0) {
        filteredSpaces.push(item);
      } else {
        filteredProfiles.push(item);
      }
    });

    return { filteredSpaces, filteredProfiles };
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
      { label: 'Activity', link: 'activity', value: '0', end: true },
      { label: 'About', link: 'about', value: '1', end: true },
      { label: 'Domains', link: 'domains', value: '2', end: true },
    ];

    if (pipeState.myAddress === domainKey) {
      views.push({ label: 'Wallet', link: 'wallet/overview', value: '3', end: true });
    }

    return views;
  }, [pipeState.myAddress, domainKey]);

  const selectedProfileViewIndex = useMemo(() => {
    const path = pathname.split('/')[3] || '';
    return profileViews.findIndex((view) => view.link === path);
  }, [pathname]);

  const selectedWalletViewIndex = useMemo(() => {
    const path = pathname.split('/')[4] || '';
    return walletViews.findIndex((view) => view.link === path);
  }, [pathname]);

  const [activeViews, setActiveViews] = useState(profileViews);
  const [activeIndex, setActiveIndex] = useState(selectedProfileViewIndex);

  const routeIndex = useMemo(() => {
    const path = pathname.split('/')[3] || '';
    if (pathname.includes('wallet')) {
      setActiveViews(walletViews);
      setActiveIndex(selectedWalletViewIndex);
    } else {
      setActiveViews(profileViews);
    }
    return activeViews.findIndex((view) => view.link === path);
  }, [pathname, activeViews, selectedWalletViewIndex, profileViews]);

  console.log('routeIndex: ', routeIndex);

  const { domains, dd, loading, domainData } = useFetchProfileData(domainKey);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = useCallback(() => {
    setIsModalOpen((prev) => !prev);
  }, []);

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

  const actionButton = useMemo(
    () => pipeState?.myAddress === domainKey && profileButton,
    [domainKey, pipeState?.myAddress, profileButton],
  );

  const { creatorName, creatorAvatar } = useProfileInfo(profiles, domainKey);

  const { ProfileSidebarComponent } = useSidebar(
    domainKey,
    creatorName,
    creatorAvatar || `${staticEndpoints.stamp}space/${domainKey}`,
    loading,
    activeViews,
    activeIndex,
    actionButton,
  );

  const { data, isLoading: isFetchingApps } = useQuery(
    ['fetchedApps', domainKey, spaces],
    fetchApps,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );

  const fetchedApps = data as IFetchedApps | undefined;

  console.log('apps', fetchedApps);

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

  const computeSpaces = (apps, fetchedApps, filterFunction) => {
    return apps
      .filter((app) => filterFunction(app.creator))
      .map((app) => {
        const domainData = findNestedObject(profiles, 'domain', app.domain);
        return {
          ...app,
          ...domainData,
        };
      });
  };

  const createdSpaces = useMemo(
    () =>
      computeSpaces(
        fetchedApps?.filteredSpaces || [],
        domainKey,
        (creator) => creator === domainKey,
      ),
    [fetchedApps, domainKey],
  );

  const joinedSpaces = useMemo(
    () =>
      computeSpaces(
        fetchedApps?.filteredSpaces || [],
        domainKey,
        (creator) => creator !== domainKey,
      ),
    [fetchedApps, domainKey],
  );

  const followedProfiles = useMemo(
    () =>
      computeSpaces(
        fetchedApps?.filteredProfiles || [],
        domainKey,
        (creator) => creator !== domainKey,
      ),
    [fetchedApps, domainKey],
  );

  // Combine created and joined spaces into allMySpaces
  const allMySpaces = useMemo(
    () => [...createdSpaces, ...joinedSpaces],
    [createdSpaces, joinedSpaces],
  );

  const shouldShowWalletRoutes = useMemo(
    () => pipeState.myAddress === domainKey,
    [pipeState.myAddress, domainKey],
  );

  return (
    <MySpacesContext.Provider value={mySpaces}>
      <Container>
        {ProfileSidebarComponent}
        <Routes>
          <Route loader={(params) => params} path={ROUTE_PATHS.profile.base} index />
          <Route
            loader={(params) => params}
            path={ROUTE_PATHS.profile.activity}
            element={<MemoizedProfileActivity address={domainKey} allMySpaces={allMySpaces} />}
          />
          <Route
            loader={(params) => params}
            path={ROUTE_PATHS.profile.about}
            element={
              <MemoizedProfileAbout
                domainData={domainData}
                createdSpaces={createdSpaces}
                joinedSpaces={joinedSpaces}
                followedProfiles={followedProfiles}
                loading={loading}
              />
            }
          />
          <Route
            path={ROUTE_PATHS.profile.domains}
            loader={(params) => params}
            element={
              <MemoizedProfileDomain
                pipeState={pipeState}
                domains={domains}
                dd={dd}
                loading={loading}
                primeDomain={domainData?.domain}
                address={domainKey}
              />
            }
          />
        </Routes>
        {shouldShowWalletRoutes && (
          <Routes>
            <Route path={ROUTE_PATHS.wallet.base} element={<MemoizedWalletOverview />} />
            <Route
              path={ROUTE_PATHS.wallet.accounts}
              element={
                <MemoizedWalletAccounts
                  loading={loading}
                  domainData={domainData}
                  pipeState={pipeState}
                />
              }
            />
            <Route
              path={ROUTE_PATHS.wallet.rewards}
              element={
                <MemoizedWalletRewards
                  loading={loading}
                  domainData={domainData}
                  pipeState={pipeState}
                />
              }
            />
          </Routes>
        )}
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

export default ProfileView;
