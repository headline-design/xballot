import { VotePopover } from './VotePopover';
import { AvatarUser } from 'components/BaseComponents/AvatarUser';
import BaseBadge from 'components/BaseComponents/ProposalsItem/BaseBadge';
import { useProfileInfo } from 'hooks/useProfileInfo';
import { shorten } from 'helpers/utils';
import { staticEndpoints } from 'utils/endPoints';

const BaseUser = ({
  address,
  space,
  proposal,
  close,
  profiles,
  profile,
  hideAvatar,
  widthClass,
  creator,
}) => {
  const { creatorName, creatorAvatar } = useProfileInfo(profiles, creator);

  return (
    <VotePopover creator={creator} profiles={profiles} zIndex={75} close={close}>
        <div className={[widthClass, 'flex flex-nowrap items-center space-x-1'].join(' ')}>
          <AvatarUser
            user={creator}
            src={creatorAvatar || `${staticEndpoints.stamp}space/${creator}`}
            size="18"
          />
          <span className="w-full cursor-pointer truncate text-skin-link">
            {creatorName || shorten(creator)}
          </span>
          <BaseBadge address={address} members={space?.members} />
        </div>
    </VotePopover>
  );
};

export default BaseUser;
