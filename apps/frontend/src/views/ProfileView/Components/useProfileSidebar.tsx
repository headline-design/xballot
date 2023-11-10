import Sidebar from './Sidebar';

export const useSidebar = (
  creator,
  creatorName,
  creatorAvatar,
  loading,
  activeViews,
  activeIndex,
  actionButton,
) => {
  const ProfileSidebarComponent = (
    <Sidebar
      actionButton={actionButton}
      items={activeViews}
      value={activeIndex}
      loading={loading}
      creator={creator}
      creatorName={creatorName}
      creatorAvatar={creatorAvatar}
 />
  );

  return { ProfileSidebarComponent };
};
