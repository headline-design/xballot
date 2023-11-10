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

export const ForumSidebar: React.FC<ForumSidebarProps> = React.memo(
  ({ forumViews, selectedForumViewIndex, space, spaceKey, members, appId, loading }) => (
    <>
      <Sidebar
        link={forumViews}
        items={forumViews}
        isActive={selectedForumViewIndex}
        value={selectedForumViewIndex}
        verifiedSpace={undefined}
        imageLink={space?.avatar}
        spaceKey={spaceKey}
        loading={loading}
        membersLength={members}
        space={space}
        spaceName={space?.name}
        appId={appId}
        isOptButton={false}
        isPostButton={true}
        isSubMenu={undefined}
      />
    </>
  ),
);
