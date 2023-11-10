import React, { useState, useEffect, useContext, useCallback } from 'react';
import { debounce } from 'lodash';
import SpacesContext from 'contexts/SpacesContext';
import { Block } from 'components/BaseComponents/Block';
import { LoadingRow } from 'components/BaseComponents/BaseLoading/LoadingRow';
import ProfileActivityList from './Components/ProfileActivityList';
import ProfileActivityListItem from './Components/ProfileActivityListItem';
import {  staticEndpoints } from 'utils/endPoints';
import moment from 'moment';
import { ExtendedSpace } from 'helpers/interfaces';
import { SignatureIcon } from 'icons/Signature';

const ONE_DAY_SECONDS = 24 * 60 * 60;
const ONE_WEEK_SECONDS = 7 * ONE_DAY_SECONDS;
const STATUSES = [
  { status: 'All', filter: 'all' },
  { status: 'Active', filter: 'active' },
  { status: 'Pending', filter: 'pending' },
  { status: 'Closed', filter: 'closed' },
];

type Address = any;

interface ActivityProps {
activities: any;
}

interface Props {
  createdSpaces?: ExtendedSpace[];
  joinedSpaces?: ExtendedSpace[];
  allMySpaces: ExtendedSpace[];
  space?: ExtendedSpace[];
  address: Address;
}

const ProfileActivity: React.FC<Props> = ({ allMySpaces, address }) => {
  const spaces: ExtendedSpace = useContext(SpacesContext);
  const [loading, setLoading] = useState(true);
  const [voteActivities, setVoteActivities] = useState([]);
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    if (spaces && Object.keys(spaces).length > 0) {
      let localProposals = [];
      const spacesData = Object.values(spaces);

      for (let space of spacesData) {
        if (space && space.proposals) {
          let proposals = space.proposals.map((proposal) => ({
            ...proposal,
            scores: proposal?.scores ?? {},
          }));
          localProposals = localProposals.concat(proposals);
        }
      }

      localProposals = localProposals
        .flat()
        .sort((a, b) => parseInt(b.end, 10) - parseInt(a.end, 10));
      setProposals(localProposals);
      setTimeout(() => setLoading(false), 1000); // Delay setting loading to false
    }
  }, [spaces]);

  const [selectedStatus, setSelectedStatus] = useState(STATUSES[0]);
  const [filteredActivities, setFilteredActivities] = useState([]);

  const filterByActivePendingClosed = useCallback(
    (proposalList) => {
      if (selectedStatus?.filter === 'active') {
        return proposalList.filter((proposal) => proposal?.scores_state === 'active');
      } else if (selectedStatus?.filter === 'pending') {
        return proposalList.filter((proposal) => proposal?.scores_state === 'pending');
      } else if (selectedStatus?.filter === 'closed') {
        return proposalList.filter((proposal) => proposal?.scores_state === 'closed');
      }
      return proposalList;
    },
    [selectedStatus],
  );

  const filterUserVotedProposals = useCallback(
    (proposalsList) => {
      return proposalsList
        .filter((proposal) => {
          if (!proposal?.scores?.votes) {
            return false;
          }

          const hasUserVoted = Object.keys(proposal.scores.votes).includes(address);
          return hasUserVoted;
        })
        .map((proposal) => {
          const userVote = proposal?.scores?.votes[address];
          let proposalId = proposal.txid;
          let vote = { ...userVote, proposalId: proposalId };
          const isVisibleChoice = ['basic', 'single-choice'].includes(vote.proposal?.type ?? '');
          let voteId = proposal?.scores.votes[address].txid;
          let choice = proposal?.scores.votes[address].option;

          return {
            id: proposal.txid,
            icon: <SignatureIcon />,
            link: `/${proposal.space.domain}/proposal/${proposal.txid}`,
            created: proposal.start,
            type: 'vote',
            title: proposal.title,
            subtitle: choice ? choice : 'hello world',
            space: {
              id: proposal.space.domain,
              avatar: proposal.space.avatar || staticEndpoints.stamp + 'avatar/' + proposal.space.domain,
            },
            vote: {
              proposalId: voteId,
              choice: choice,
              type: proposal.strategyType,
            },
          };
        });
    },
    [address],
  );

  const updateFilteredActivities = useCallback(
    debounce(() => {
      let joinedProposals = proposals.filter((proposal) =>
        allMySpaces.some((space) => space?.appId === proposal?.space?.appId),
      );
      joinedProposals = filterByActivePendingClosed(joinedProposals);
      const userVotedProposals = filterUserVotedProposals(joinedProposals);
      setVoteActivities(userVotedProposals);

      let newFilteredActivities = [...userVotedProposals];
      newFilteredActivities = newFilteredActivities.sort((a, b) => b.end - a.end);

      setFilteredActivities(newFilteredActivities);
    }, 200),
    [proposals, allMySpaces, filterByActivePendingClosed, address, filterUserVotedProposals],
  );

  useEffect(() => {
    updateFilteredActivities();
  }, [updateFilteredActivities]);

  return (
    <div id="content-right" className="relative float-right w-full pl-0 lg:w-3/4 lg:pl-5">
      {loading ? (
        <LoadingRow />
      ) : filteredActivities.length === 0 ? (
        <Block>No activity</Block>
      ) : (
        <ActivityLists activities={filteredActivities} />
      )}
    </div>
  );
};

const ActivityLists = React.memo(({ activities }: ActivityProps)  => {
  const activityToday = filterByTime(activities, ONE_DAY_SECONDS);
  const activityOneWeek = filterByTime(activities, ONE_WEEK_SECONDS, ONE_DAY_SECONDS);
  const activityOlder = filterOlderThan(activities, ONE_WEEK_SECONDS);

  const MemoizedProfileActivityList = React.memo(ProfileActivityList)
  const MemoizedProfileActivityListItem = React.memo(ProfileActivityListItem)

  return (
    <div className="space-y-3">
      {activityToday.length > 0 && (
        <MemoizedProfileActivityList title="Today">
          {activityToday.map((activity) => (
            <MemoizedProfileActivityListItem
              key={activity.id}
              activities={activities}
              activity={activity}
            />
          ))}
        </MemoizedProfileActivityList>
      )}
      {activityOneWeek.length > 0 && (
        <MemoizedProfileActivityList title="This week">
          {activityOneWeek.map((activity) => (
            <MemoizedProfileActivityListItem
              key={activity.id}
              activities={activities}
              activity={activity}
            />
          ))}
        </MemoizedProfileActivityList>
      )}
      {activityOlder.length > 0 && (
        <MemoizedProfileActivityList title="Older than a week">
          {activityOlder.map((activity) => (
            <MemoizedProfileActivityListItem
              activities={activities}
              key={activity.id}
              activity={activity}
            />
          ))}
        </MemoizedProfileActivityList>
      )}
    </div>
  );
});

function filterByTime(activities, time, offset = 0) {
  return activities.filter((activity) => {
    const timeStamp = moment.unix(activity.created);
    const diff = moment.duration(moment().diff(timeStamp)).asSeconds();
    return diff >= offset && diff < offset + time;
  });
}

function filterOlderThan(activities, time) {
  return activities.filter((activity) => {
    const timeStamp = moment.unix(activity.created);
    const diff = moment.duration(moment().diff(timeStamp)).asSeconds();
    return diff > time;
  });
}

export default ProfileActivity;
