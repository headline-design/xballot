import React from 'react';
import Sidebar from './Components/Sidebar';

interface SpaceSidebarProps {
  spaceViews: any[];
  selectedSpaceViewIndex: number;
  space: any;
  spaceKey: string;
  members: any[];
  appId: string;
  loading: boolean;
}

export const SpaceSidebar: React.FC<SpaceSidebarProps> = React.memo(
  ({ spaceViews, selectedSpaceViewIndex, space, spaceKey, members, appId, loading }) => {
    let filteredSpaceViews = spaceViews;

    // check if treasuries exist
    if (!space.treasuries || space.treasuries.length === 0) {
      filteredSpaceViews = filteredSpaceViews.filter((view) => view.label !== 'Treasury');
    }

    // check if forums exist
    if (!space.forum || space.forum.length === 0) {
      filteredSpaceViews = filteredSpaceViews.filter((view) => view.label !== 'Community');
    }


    return (
      <>
        <Sidebar
          link={filteredSpaceViews}
          items={filteredSpaceViews}
          isActive={selectedSpaceViewIndex}
          value={selectedSpaceViewIndex}
          verifiedSpace={undefined}
          imageLink={space?.avatar}
          spaceKey={spaceKey}
          loading={loading}
          membersLength={members}
          space={space}
          spaceName={space?.name}
          appId={appId}
          isOptButton={true}
          isPostButton={false}
          isSubMenu={undefined}
        />
      </>
    );
  },
);
