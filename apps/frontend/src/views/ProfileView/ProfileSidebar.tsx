import React from 'react';
import Sidebar from './Components/Sidebar';

interface ForumSidebarProps {
  forumViews: any[];
  selectedForumViewIndex: number;
  space: any;
  spaceKey: string;
  members: any[];
  appId: string;
  loading: boolean;
}

export const ProfileSidebar: React.FC<ForumSidebarProps> = React.memo(
  ({ forumViews, selectedForumViewIndex, space, spaceKey, members, appId, loading }) => (
    <>
      <Sidebar
        items={forumViews}
        value={selectedForumViewIndex}
        creator={space?.creator}
        creatorName={space?.name}
        creatorAvatar={space?.avatar}
        actionButton={undefined}
        loading={loading}
        appId={appId}
      />
    </>
  ),
);
