import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import preval from 'preval.macro';
import { getEndpoints } from 'utils/endPoints';

const NotificationEvents = {
  ProposalStart: 'proposal/start',
  ProposalEnd: 'proposal/end'
};
const filters = ['all', 'unread'];

export function useNotifications({pipeState}) {
  const endPoints = getEndpoints();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const buildTimestamp = preval`module.exports = new Date().toLocaleString();`;
  localStorage.setItem('xballot.buildTimestamp', buildTimestamp);
  const localBuildTimestamp = localStorage.getItem('xballot.buildTimestamp');

  const web3Account = pipeState.myAddress;
  const readNotificationsStorage = web3Account
    ? JSON.parse(localStorage.getItem(`xballot.unread.${web3Account.slice(0, 8).toLowerCase()}`)) || ['initialValue']
    : ['initialValue'];

  useEffect(() => {
    loadNotifications();

    const refreshNotificationInterval = setInterval(
      loadNotifications,
      60000 * 15
    );

    return () => {
      clearInterval(refreshNotificationInterval);
    };
  }, [web3Account]);

  useEffect(() => {
    // add this effect to create a build notification if build timestamp is recent
    if (buildIsWithin24Hours(buildTimestamp)) {
      setNotifications(notifications => {
        // prevent duplicate build notifications
        if (notifications.some(n => n.id === 'build')) return notifications;

        return [
          ...notifications,
          {
            domain: 'xballot',
            space: {
              name: 'XBallot',
              avatar: endPoints.ipfs + 'QmdHn5YLo9uydWyznhgzf38Le21PgzGQjNKMufiQwTwnch',
            },
            id: 'build',
            event: 'Build Notification',
            time: new Date(buildTimestamp).getTime() / 1000,  // convert build timestamp to seconds
            text: 'New build is live!',
            title: 'XBallot Build Notification',
            isRecent: true
          }
        ];
      });
    }
  }, [buildTimestamp]);

  useEffect(() => {
    loadNotifications();

    const refreshNotificationInterval = setInterval(
      loadNotifications,
      60000 * 15
    );

    return () => {
      clearInterval(refreshNotificationInterval);
    };
  }, [web3Account]);

  async function loadRecentProposals() {
    // load recent proposals from local storage instead of DB
    const storedProposals = JSON.parse(localStorage.getItem("proposals") || "[]");

    return storedProposals;
  }

  async function loadNotifications() {
    if (!web3Account) return;

    setLoading(true);
    const recentProposals = await loadRecentProposals();
    mapProposalToNotifications(recentProposals);

    setLoading(false);
  }

  const buildIsWithin24Hours = (buildTimestamp) => {
    const buildDateSeconds = new Date(buildTimestamp).getTime() / 1000;
    const oneDayAgo = Date.now() / 1000 - 24 * 60 * 60;
    return buildDateSeconds > oneDayAgo;
  };
  //console.log("Is recent: ", buildIsWithin24Hours(buildTimestamp));
  //console.log(buildIsWithin24Hours("6/9/2023, 1:15:11 PM"));  // Should print 'true' if within last 24 hours

  function mapProposalToNotifications(proposals) {
    if (proposals.length === 0) return;
    const now = Number(new Date().getTime() / 1000).toFixed(0);

    proposals.forEach(proposal => {
      setNotifications(notifications => {
        if (notifications.some(n => n.id === proposal.id)) return notifications;

        return [
          ...notifications,
          {
            id: proposal.id,
            event:
              proposal.end <= now
                ? NotificationEvents.ProposalEnd
                : NotificationEvents.ProposalStart,
            time: proposal.end <= now ? proposal.end : proposal.start,
            title: proposal.title,
            space: proposal.space,
            isRecent: buildIsWithin24Hours(buildTimestamp)
          }
        ];
      });
    });
  }


  function selectNotification(id, spaceId) {
    navigate(id === "build" ? "#" : `${spaceId}/proposal/${id}`);
    const newNotificationsStorage = readNotificationsStorage.includes(id)
      ? readNotificationsStorage
      : [...readNotificationsStorage, id];
    if(web3Account) {
      localStorage.setItem(`xballot.unread.${web3Account.slice(0, 8).toLowerCase()}`, JSON.stringify(newNotificationsStorage));
    }
    else {
      localStorage.setItem(`xballot.unread.${'0x00000000'.slice(0, 8).toLowerCase()}`, JSON.stringify(newNotificationsStorage));
    }
  }


  function markAllAsRead() {
    const allNotificationIds = [...readNotificationsStorage, ...notifications.map(n => n.id)];
    const uniqueNotificationIds = Array.from(new Set(allNotificationIds));
    if(web3Account) {
      localStorage.setItem(`xballot.unread.${web3Account.slice(0, 8).toLowerCase()}`, JSON.stringify(uniqueNotificationIds));
    }
    else {
      localStorage.setItem(`xballot.unread.${'0x00000000'.slice(0, 8).toLowerCase()}`, JSON.stringify(uniqueNotificationIds));
    }
  }

  const notificationsSortedByTime = notifications
  .map(n => ({
    text: n.title,
    action: { spaceId: n.space?.id, id: n.id },
    seen: readNotificationsStorage.includes(n.id),
    isRecent: n.isRecent,
    ...n
  }))
  .sort((a, b) => b.time - a.time)
  .filter(n => (selectedFilter === 'unread' ? !n.seen : true));

    return {
      notifications,
      notificationsSortedByTime,
      loading,
      NotificationEvents,
      selectedFilter,
      filters,
      loadNotifications,
      selectNotification,
      markAllAsRead,
      setSelectedFilter
    };
  }
