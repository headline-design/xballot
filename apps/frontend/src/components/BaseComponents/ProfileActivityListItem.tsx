import AvatarSpace from 'components/AvatarSpace';
import { ProfileActivity } from 'helpers/interfaces';
import { SignatureIcon } from 'icons/Signature';
import { Link } from 'react-router-dom';

export default function ProfileActivityListItem({ activity, space }) {
  return (
    <div className="border-b border-skin-text last:border-b-0">
      {/* Vote activities */}
      {activity.type === 'vote' && (
        <Link to={space.proposalId}>
          <div className="flex w-full py-4 px-4">
            <div className="relative min-w-[52px]">
              <AvatarSpace size="44" space={activity.space} previewFile={undefined} />
              <div className="absolute right-0 top-[24px] rounded-full bg-primary p-[6px] pr-[5px] text-[9px] text-white">
                <SignatureIcon />
              </div>
            </div>
            <div className="ml-4 w-[calc(100%-64px)]">
              <div className="text-xs leading-5 text-skin-text">{'activitied'}</div>
              <div className="truncate pr-2">{activity.title}</div>
            </div>
          </div>
        </Link>
      )}
      {/* Other activities */}
    </div>
  );
}
