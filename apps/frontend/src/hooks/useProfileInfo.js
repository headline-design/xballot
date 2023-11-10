import { shorten } from 'helpers/utils';

export const useProfileInfo = (profiles, creator) => {
  if (!profiles || !creator) {
    return {
      creatorName: '',
      creatorAvatar: '',
      creatorAbout: '',
    };
  }

  const userProfiles = profiles[creator];
  const assetId = userProfiles ? Object.keys(userProfiles)[0] : null;
  const userProfile = assetId ? userProfiles[assetId] : null;

  const creatorName = userProfile?.settings?.name || userProfile?.settings?.domain || shorten(creator);
  const creatorAvatar = userProfile?.settings?.avatar || '';
  const creatorAbout = userProfile?.settings?.about || '';

  return { creatorName, creatorAvatar, creatorAbout };
};