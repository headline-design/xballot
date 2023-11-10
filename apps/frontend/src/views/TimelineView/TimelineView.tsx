import React, { useState, useEffect, useMemo, useContext, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { debounce } from 'lodash';
import Sidebar from './Components/Sidebar';
import TimelineSpaces from './TimelineSpaces';
import ProfilesContext from 'contexts/ProfilesContext';
import SpacesContext from 'contexts/SpacesContext';
import { Container } from 'components/BaseComponents/Container';
import PipeStateContext from 'contexts/PipeStateContext';
import FilterListbox from 'components/FilterListbox';
import { getEndpoints } from 'utils/endPoints';
import { ExtendedSpace } from 'helpers/interfaces';

interface TimelineViewProps {
  label: string;
  link: string;
  value: string;
  end: boolean;
}

const timelineViews: TimelineViewProps[] = [
  { label: 'All spaces', link: '/timeline?feed=all', value: '0', end: true },
  { label: 'Joined spaces', link: '/timeline?feed=joined', value: '1', end: true },
];

interface SidebarProps {
  feed: string;
  timelineViews: TimelineViewProps[];
  selectedTimelineView: number;
  selectTimelineView: (index: number) => void;
  className?: string;
}

const TimelineSidebar: React.FC<SidebarProps> = React.memo(
  ({ feed, timelineViews, selectedTimelineView, selectTimelineView }) => (
    <Sidebar
      feed={feed}
      timelineViews={timelineViews}
      selectedTimelineView={selectedTimelineView}
      selectTimelineView={selectTimelineView}
      className="no-scrollbar flex overflow-y-auto lg:mt-0 lg:block"
    />
  ),
);

interface StatusListboxProps {
  selectedStatus: any;
  setSelectedStatus: (status: any) => void;
  allStatuses: any[];
}

const MemoizedStatusListbox: React.FC<StatusListboxProps> = React.memo(
  ({ selectedStatus, setSelectedStatus, allStatuses }) => (
    <FilterListbox
      selectedFilter={selectedStatus}
      setSelectedFilter={setSelectedStatus}
      allFilters={allStatuses}
    />
  ),
);

interface TimelineSpacesProps {
  proposals: any[];
  loading: boolean;
  space: any | undefined; // Update type to include undefined
  profiles: any;
  stamp: any;
}

const MemoizedTimelineSpaces: React.FC<TimelineSpacesProps> = React.memo(
  ({ proposals, loading, space, profiles, stamp }) => (
    <TimelineSpaces proposals={proposals} loading={loading} space={space} profiles={profiles} />
  ),
);

interface Props {
  // Add any required props here
}

const TimelineView: React.FC<Props> = () => {
  const profiles = useContext(ProfilesContext);
  const spaces = useContext(SpacesContext);
  const pipeState = useContext(PipeStateContext);
  const endPoints = getEndpoints();
  const [mySpaces, setMySpaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  //console.log(pipeState.myAddress);

  useEffect(() => {
    async function getAllMyApps() {
      setLoading(true);
      if (pipeState.myAddress) {
        try {
          const [daoResponse, accountResponse] = await Promise.all([
            fetch(`${endPoints.backend}index/daos`),
            fetch(`${endPoints.indexer}accounts/${pipeState.myAddress}`),
          ]);

          const daoData = await daoResponse.json();
          const daoApps = Object.keys(daoData);
          const accountData = await accountResponse.json();
          const appStates = accountData.account?.['apps-local-state'];

          if (!appStates) {
            return;
          }

          const myOpted: any = {};
          appStates.forEach((app: any, i: number) => {
            const appId = app.id.toString();
            const deStringedAppId = app.id;
            if (daoApps.includes(appId)) {
              myOpted[appId] = {
                appId: deStringedAppId,
                id: i + 1,
                creator: daoData[appId].creator,
                enabled: daoData[appId].enabled,
                asset: daoData[appId].creator,
                domain: daoData[appId].domain,
                content:
                  daoData[appId].content || `${endPoints.stamp}:${daoData[appId].domain}?s=100`,
              };
            }
          });

          setMySpaces(Object.values(myOpted));
          setTimeout(() => setLoading(false), 1000); // Delay setting loading to false
        } catch (error) {
          console.error(error);
        }
      }
    }

    getAllMyApps();
    setTimeout(() => setLoading(false), 1000); // Delay setting loading to false
  }, [endPoints.backend, endPoints.indexer, pipeState.myAddress]);

  const [proposals, setProposals] = useState<any[]>([]);

  interface VoteModalProps {
    open: boolean;
    space: ExtendedSpace;
  }

  useEffect(() => {
    if (spaces && Object.keys(spaces).length > 0) {
      let localProposals: any[] = [];
      const spacesData = Object.values(spaces);

      for (let space of spacesData) {
        let proposals = (space as ExtendedSpace).proposals.map((proposal: any) => ({
          ...proposal,
          space: { ...(space as ExtendedSpace) },
        }));
        localProposals = localProposals.concat(proposals);
      }

      localProposals = localProposals
        .flat()
        .sort((a, b) => parseInt(b.end, 10) - parseInt(a.end, 10));
      setProposals(localProposals);
    }
  }, [spaces]);

  const location = useLocation();
  const allStatuses = [
    { status: 'All', filter: 'all' },
    { status: 'Active', filter: 'active' },
    { status: 'Pending', filter: 'pending' },
    { status: 'Closed', filter: 'closed' },
  ];

  const [selectedStatus, setSelectedStatus] = useState(allStatuses[0]);
  const [selectedTimelineViewIndex, setSelectedTimelineViewIndex] = useState(0);
  const searchParams = new URLSearchParams(location.search);
  const feed = searchParams.get('feed') || 'all';
  const [filteredProposals, setFilteredProposals] = useState<any[]>([]);

  const allMySpaces = useMemo(() => {
    const myCreated: any[] = [];
    const myJoined: any[] = [];

    mySpaces?.forEach((space: any) => {
      if (space.creator === pipeState.myAddress) {
        myCreated.push(space);
      } else {
        myJoined.push(space);
      }
    });

    return [...myCreated, ...myJoined];
  }, [mySpaces, pipeState.myAddress]);

  const filterByActivePendingClosed = useCallback(
    (proposalList: any[]) => {
      if (selectedStatus?.filter === 'active') {
        return proposalList.filter((proposal) => proposal.scores_state === 'active');
      } else if (selectedStatus?.filter === 'pending') {
        return proposalList.filter((proposal) => proposal.scores_state === 'pending');
      } else if (selectedStatus?.filter === 'closed') {
        return proposalList.filter((proposal) => proposal.scores_state === 'closed');
      }
      return proposalList;
    },
    [selectedStatus],
  );

  const updateFilteredProposals = useCallback(
    debounce(() => {
      let newFilteredProposals;
      if (feed === 'all') {
        newFilteredProposals = proposals.sort((a, b) => b.end - a.end);
        newFilteredProposals = filterByActivePendingClosed(newFilteredProposals);
      } else if (feed === 'joined') {
        let joinedProposals = proposals.filter((proposal) =>
          allMySpaces.some((space) => space.appId === parseInt(proposal.space.appId)),
        );
        joinedProposals = filterByActivePendingClosed(joinedProposals);
        newFilteredProposals = joinedProposals.sort((a, b) => b.end - a.end);
      }
      setFilteredProposals(newFilteredProposals);
    }, 200),
    [proposals, feed, allMySpaces, filterByActivePendingClosed],
  );

  useEffect(() => {
    updateFilteredProposals();
  }, [updateFilteredProposals]);

  return (
    <>
      <Container>
        <TimelineSidebar
          feed={feed}
          timelineViews={timelineViews}
          selectedTimelineView={selectedTimelineViewIndex}
          selectTimelineView={setSelectedTimelineViewIndex}
        />
        <div id="content-right" className="relative float-right w-full pl-0 lg:w-3/4 lg:pl-5">
          <div className="relative mb-3 flex px-3 md:px-0">
            <div className="flex-auto">
              <div className="flex flex-auto items-center">
                <h2>Timeline</h2>
              </div>
            </div>
            <div data-headlessui-state="" className="inline-block h-full text-left">
              <div>
                <MemoizedStatusListbox
                  selectedStatus={selectedStatus}
                  setSelectedStatus={setSelectedStatus}
                  allStatuses={allStatuses}
                />
              </div>
            </div>
          </div>
          <MemoizedTimelineSpaces
            proposals={filteredProposals}
            loading={loading}
            space={undefined}
            profiles={profiles}
            stamp={endPoints.stamp}
          />
        </div>
      </Container>
    </>
  );
};

export default TimelineView;
