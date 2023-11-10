import React from 'react';
import { SpaceSidebar } from './SpaceSidebar';
import { ForumSidebar } from './ForumSidebar';

export const useSidebar = (
  selectedSpaceViewIndex,
  forumViews,
  spaceViews,
  spaceKey,
  space,
  members,
  appId,
  loading,
  selectedForumViewIndex,
) => {
  const SpaceSidebarComponent = (selectedSpaceViewIndex === 0 ||
    selectedSpaceViewIndex === 2 ||
    selectedSpaceViewIndex === 3) && (
    <SpaceSidebar
      spaceViews={spaceViews}
      selectedSpaceViewIndex={selectedSpaceViewIndex}
      space={space}
      spaceKey={spaceKey}
      members={members}
      appId={appId}
      loading={loading}
    />
  );

  const ForumSidebarComponent = selectedSpaceViewIndex === 5 && (
    <ForumSidebar
      forumViews={forumViews}
      selectedForumViewIndex={selectedForumViewIndex}
      space={space}
      spaceKey={spaceKey}
      members={members}
      appId={appId}
      loading={loading}
    />
  );

  return { SpaceSidebarComponent, ForumSidebarComponent };
};
