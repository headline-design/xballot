import { useMemo } from 'react';
import { sha256 } from 'js-sha256';
import BaseAvatar from 'components/BaseComponents/BaseAvatar';
import { staticEndpoints } from 'utils/endPoints';

function AvatarSpace({ space, size = '22', previewFile }) {
  const avatarHash = useMemo(() => {
    if (!space?.avatar) return '';
    const hash = sha256(space?.avatar).slice(0, 16);
    return `&cb=${hash}`;
  }, [space?.avatar]);

  // Check if the avatar starts with "http://" or "https://"
  const isFullUrl = useMemo(() => {
    if (!space?.avatar) return false;
    return space?.avatar.startsWith('http://') || space?.avatar.startsWith('https://');
  }, [space?.avatar]);

  return (
    <BaseAvatar
      previewFile={previewFile}
      size={size}
      src={isFullUrl
            ? space?.avatar
            : `${staticEndpoints.stamp}space/${space?.domain}?s=${Number(size) * 2}${avatarHash}`}
    />
  );
}

export default AvatarSpace;
