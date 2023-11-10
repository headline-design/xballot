import React, { useMemo, useContext, useState } from 'react';
import { useLocation, Routes, Route, useParams } from 'react-router-dom';
import { Container } from 'components/BaseComponents/Container';
import ProfilesContext from 'contexts/ProfilesContext';
import DomainContext from 'contexts/DomainContext';
import useFetchData from './Components/useFetchData';
import SpaceCreateProposal from './SpaceCreate';

import {
  MemoizedSpaceAbout,
  MemoizedSpaceTreasury,
  MemoizedTreasuryAssetsList,
  MemoizedSpaceForum,
  MemoizedSpaceCreateForumPost,
  MemoizedForumPost,
  MemoizedSpaceForumAbout,
  MemoizedSpaceSettings,
  MemoizedSpaceProposal,
  MemoizedSpaceProposals,
  MemoizedDelegateView,
  MemoizedThreadPost,
MemoizedSubThreadPost
} from './Components/MemoizedSpaceComponents';
import { useSidebar } from './useSidebar';
import PipeStateContext from 'contexts/PipeStateContext';

interface Data {
  space: any;
  proposals: any[];
  members: number;
  appId: number;
  posts: any;
}

const SpaceView = () => {
  const profiles = useContext(ProfilesContext);
  const pipeState = useContext(PipeStateContext);
  const domainData = useContext(DomainContext);

  const location = useLocation();
  const { spaceKey } = useParams();
  const { pathname } = location;

  const { data, loading } = useFetchData(spaceKey);
  const space = (data as Data).space || {};
  const proposals = (data as Data).proposals || [];
  const members = (data as Data).members || 0;
  const appId = (data as Data).appId || 0;
  const posts = (data as Data).posts || {};

  const spaceViews = useMemo(
    () => [
      { label: 'Proposals', link: '', value: '0', end: true },
      { label: 'New proposal', link: 'create', value: '1', end: false },
      { label: 'About', link: 'about', value: '2', end: true },
      { label: 'Treasury', link: 'treasury', value: '3', end: false },
      { label: 'Settings', link: 'settings', value: '4', end: true },
      { label: 'Community', link: 'forum', value: '5', end: true },
      { label: 'Delegate', link: 'delegate', value: '9', end: false },
    ],
    [],
  );

  const forumViews = useMemo(
    () => [
      { label: 'New post', link: 'forum/create', value: '6', end: false },
      { label: 'Feed', link: 'forum', value: '7', end: true },
      { label: 'About', link: 'forum/about', value: '8', end: false },
      { label: 'Home', link: '', value: '9', end: true },
    ],
    [],
  );

  const selectedSpaceViewIndex = useMemo(() => {
    const path = pathname.split('/')[2] || '';
    return spaceViews.findIndex((view) => view.link === path);
  }, [pathname, spaceViews]);

  const selectedForumViewIndex = useMemo(() => {
    const path = pathname.split('/')[3] || '';
    return forumViews.findIndex((view) => view.link === path);
  }, [forumViews, pathname]);

  const { SpaceSidebarComponent, ForumSidebarComponent } = useSidebar(
    selectedSpaceViewIndex,
    forumViews,
    spaceViews,
    spaceKey,
    space,
    members,
    appId,
    loading,
    selectedForumViewIndex,
  );

  const [optedList, setOptedList] = useState([]);
  const [tallies, setTallies] = useState({});
  const [votes, setVotes] = useState({});
  const [total, setTotal] = useState(0);
  const [spaceBaseData, setSpaceBaseData] = useState([]);

  //console.log(posts);
  //console.log(profiles)

  const ROUTE_PATHS = {
    space: {
      base: '/',
      create: '/create',
      about: '/about',
      delegate: '/delegate',
      treasury: {
        base: '/treasury',
        assetsList: '/treasury/:treasuryKey',
      },
      settings: '/settings',
    },
    forum: {
      base: '/forum',
      post: '/forum/post/:postKey',
      thread: '/forum/post/:postKey/comment/:threadKey',
      subthread: '/forum/post/:postKey/comment/:threadKey/sub/:subThreadKey',
      create: '/forum/create',
      about: '/forum/about',
    },
    proposal: '/proposal/:proposalKey',
  };

  //console.log(space)
  //console.log(space?.domain)

  return (
    <>
      <Container>
        <div>
          {SpaceSidebarComponent}
          {ForumSidebarComponent}

          <Routes>
            <Route
              path={ROUTE_PATHS.space.base}
              element={
                <MemoizedSpaceProposals
                  profiles={profiles}
                  appnum={appId}
                  proposals={proposals}
                  loading={loading}
                  space={space}
                />
              }
            />

            <Route
              path={ROUTE_PATHS.space.create}
              index
              element={<SpaceCreateProposal space={space} appId={appId} domainData={domainData} />}
            />

            <Route
              path={ROUTE_PATHS.space.about}
              index
              element={<MemoizedSpaceAbout profiles={profiles} members={optedList} space={space} />}
            />

            <Route
              path={ROUTE_PATHS.space.treasury.base}
              element={<MemoizedSpaceTreasury appId={appId} space={space} />}
            />
            <Route
              path={ROUTE_PATHS.space.treasury.assetsList}
              element={<MemoizedTreasuryAssetsList />}
            />

            <Route
              path={ROUTE_PATHS.space.settings}
              index
              element={
                <MemoizedSpaceSettings
                  profiles={profiles}
                  baseData={spaceBaseData}
                  spaceData={space}
                  appId={appId}
                />
              }
            />
            <Route
              path={ROUTE_PATHS.space.delegate}
              index
              element={<MemoizedDelegateView spaceKey={spaceKey} />}
            />

            <Route
              path={ROUTE_PATHS.forum.base}
              element={
                <MemoizedSpaceForum
                  profiles={profiles}
                  appId={appId}
                  posts={posts}
                  loading={loading}
                  space={space}
                />
              }
            />
            <Route
              loader={(params) => params}
              path={ROUTE_PATHS.forum.post}
              element={
                <MemoizedForumPost
                  profiles={profiles}
                  posts={posts}
                  space={space}
                  appId={appId}
                  creator={undefined}
                  myAddress={pipeState.myAddress}
                />
              }
            />
            <Route
              loader={(params) => params}
              path={ROUTE_PATHS.forum.thread}
              element={
                <MemoizedThreadPost
                  profiles={profiles}
                  posts={posts}
                  space={space}
                  myAddress={pipeState.myAddress}
                />
              }
            />
            <Route
              loader={(params) => params}
              path={ROUTE_PATHS.forum.subthread}
              element={
                <MemoizedSubThreadPost
                  profiles={profiles}
                  posts={posts}
                  space={space}
                  myAddress={pipeState.myAddress}
                />
              }
            />
            <Route
              path={ROUTE_PATHS.forum.create}
              element={
                <MemoizedSpaceCreateForumPost
                  profiles={profiles}
                  space={space}
                  domainData={domainData}
                  appId={appId}
                />
              }
            />
            <Route
              path={ROUTE_PATHS.forum.about}
              element={<MemoizedSpaceForumAbout space={space} />}
            />
            <Route
              path={ROUTE_PATHS.forum.base}
              index
              element={
                <MemoizedSpaceForum
                  profiles={profiles}
                  appId={appId}
                  posts={posts}
                  loading={loading}
                  space={space}
                />
              }
            />

            <Route
              loader={(params) => params}
              path={ROUTE_PATHS.proposal}
              element={
                <MemoizedSpaceProposal
                  profiles={profiles}
                  space={space}
                  tallies={tallies}
                  votes={votes}
                  total={total}
                  proposals={proposals}
                  appId={appId}
                  reload={undefined}
                  open={false}
                  selectedChoices={undefined}
                  proposal={undefined}
                  pipeState={pipeState}
                  currentRound={undefined}
                  spaceDomain={spaceKey}
                />
              }
            />
          </Routes>
        </div>
      </Container>
    </>
  );
};

export default SpaceView;
