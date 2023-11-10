import { getEndpoints } from 'utils/endPoints';
import React, { lazy, useMemo, useState } from 'react';
import { useQuery, useQueries } from 'react-query';
import ProfilesContext from 'contexts/ProfilesContext';
import DomainContext from 'contexts/DomainContext';
import SpacesContext from 'contexts/SpacesContext';
import ProviderLayout from 'layouts/ProviderLayout';
import AboutProviderLayout from 'layouts/AboutProviderLayout';
import { Outlet } from 'react-router-dom';
import ErrorBoundary from 'views/ErrorBoundary';
import ErrorPage from 'views/ErrorView';
import { createGlobalStyle } from 'styled-components';
import { globalStyle } from 'styles';
import PipeStateContext from 'contexts/PipeStateContext';
import { LoginModalProvider } from 'contexts/LoginModalContext';
import { TransactionModalProvider } from 'contexts/TransactionModalContext';
import SpacesRanking from 'views/RankingView/RankingView';
import { XWalletProvider } from 'contexts/XWalletContext';

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { updateSpacesScoresState } from 'helpers/stateUpdate';
import DelegatesContext from 'contexts/DelegatesContext';
import ScrollToTop from 'components/BaseComponents/ScrollToTop';
import RankingsContext from 'contexts/RankingsContext';

const DelegateView = lazy(() => import('views/DelegateView/DelegateView'));
const ExploreView = lazy(() => import('views/ExploreView/ExploreView'));
const AboutView = lazy(() => import('views/FaqView/AboutView'));
const SetupView = lazy(() => import('views/SetupView/index'));
const TimelineView = lazy(() => import('views/TimelineView/TimelineView'));
const AccountView = lazy(() => import('views/ProfileView/AccountView'));
const ProfileView = lazy(() => import('views/ProfileView/ProfileView'));
const SpaceView = lazy(() => import('views/SpaceView/SpaceView'));

function App({ queryClient }) {
  const endPoints = getEndpoints();

  const profilesQuery = useQuery('profiles', async () => {
    const response = await fetch(endPoints.worker + 'v1/primes');
    return await response.json();
  });

  const delegatesQuery = useQuery('delegates', async () => {
    const response = await fetch(endPoints.worker + 'v1/delegates');
    return await response.json();
  });

  const spacesQuery = useQuery('spaces', async () => {
    const response = await fetch(endPoints.worker + 'v1/domains?spaces=true');
    let spaces = await response.json();

    // Update scores_state of each proposal
    spaces = updateSpacesScoresState(spaces);

    return spaces;
  });

  const rankingsQuery = useQueries([
    {
      queryKey: 'profileRankings',
      queryFn: async () => {
        const response = await fetch(endPoints.worker + 'v1/rankings/users');
        return await response.json();
      },
    },
    {
      queryKey: 'spaceRankings',
      queryFn: async () => {
        const response = await fetch(endPoints.worker + 'v1/rankings/spaces');
        return await response.json();
      },
    }
  ]);

  const rankings = {
    profiles: rankingsQuery[0].data,
    spaces: rankingsQuery[1].data,
  };


  const [pipeState, setPipeState] = useState({
    myAddress: '',
    checked: true,
    labelNet: '',
  });

  const handleUpStream = (globalPipeState) => {
    setPipeState(globalPipeState);
  };

  const [domainData, setDomainData] = useState({
    name: '',
    about: '',
    avatar: '',
    appId: '',
    assetId: '',
    domain: '',
    delegations: [],
  });

  const handleUpStreamDomain = (domainData) => {
    setDomainData(domainData);
  };

  const GlobalStyle = createGlobalStyle`
    ${globalStyle}
  `;

  const routes = useMemo(
    () => [
      <Route
        path=""
        element={
          <ProviderLayout
            queryClient={queryClient}
            GlobalStyle={GlobalStyle}
            upStream={handleUpStream}
            upStreamDomain={handleUpStreamDomain}
          >
            <ErrorBoundary fallbackRender={({ error }) => <ErrorPage statusCode={404} />}>
              <ScrollToTop />
              <Outlet />
            </ErrorBoundary>
          </ProviderLayout>
        }
      >
        <Route index element={<ExploreView />} />
        <Route path="/ranking/*" element={<SpacesRanking />} />
        <Route path="timeline/*" element={<TimelineView />} />
        <Route path=":spaceKey/*" element={<SpaceView />} />
        <Route path="account/:domainKey/*" element={<AccountView />} />
        <Route path="profile/:domainKey/*" element={<ProfileView />} />
        <Route path="/setup/*" element={<SetupView />} />
        <Route path="/delegate/:key?/:to?" element={<DelegateView spaceKey={'profileKey'} />} />
      </Route>,
      <Route
        path="/about"
        element={
          <AboutProviderLayout queryClient={queryClient} GlobalStyle={GlobalStyle}>
            <ErrorBoundary fallbackRender={({ error }) => <ErrorPage statusCode={404} />}>
              <ScrollToTop />
              <Outlet />
            </ErrorBoundary>
          </AboutProviderLayout>
        }
      >
        <Route path="/about/*" index element={<AboutView />} />
      </Route>,
      <Route path="*" element={<ErrorPage statusCode={404} />} />,
    ],
    [GlobalStyle, queryClient],
  );

  const memoizedRouter = useMemo(
    () => createBrowserRouter(createRoutesFromElements(routes)),
    [routes],
  );

  return (
    <DomainContext.Provider value={domainData}>
      <PipeStateContext.Provider value={pipeState}>
        <ProfilesContext.Provider value={profilesQuery.data}>
          <RankingsContext.Provider value={rankings}>
            <DelegatesContext.Provider value={delegatesQuery.data}>
              <SpacesContext.Provider value={spacesQuery.data}>
                <LoginModalProvider>
                  <XWalletProvider>
                    <TransactionModalProvider>
                      <RouterProvider router={memoizedRouter} />
                    </TransactionModalProvider>
                  </XWalletProvider>
                </LoginModalProvider>
              </SpacesContext.Provider>
            </DelegatesContext.Provider>
          </RankingsContext.Provider>
        </ProfilesContext.Provider>
      </PipeStateContext.Provider>
    </DomainContext.Provider>
  );
}

export default App;
