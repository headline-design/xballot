import React from 'react';
import { ProfileActivity } from 'helpers/interfaces';
import AvatarSpace from 'views/TimelineView/Components/AvatarSpace';
import { Link } from 'react-router-dom';
import { CheckmarkIcon } from 'react-hot-toast';
import { staticEndpoints } from 'utils/endPoints';

interface ProfileActivityOptedItemProps {
  activity: ProfileActivity;
  activities: any;
}

const ProfileActivityOptedItem: React.FC<ProfileActivityOptedItemProps> = ({
  activity,
  activities,
}) => {
  console.log(activity);
  return (
    <div className="border-b border-skin-text last:border-b-0">
      {activities && (
        <Link
          to={{
            pathname: `/${activity.space.id}/proposal/${activity.id}`,
          }}
        >
          <div className="flex w-full px-4 py-4">
            <div className="relative min-w-[52px]">
              <AvatarSpace size={44} space={activity.space} stamp={staticEndpoints.stamp} />
              <div className="absolute right-0 top-[24px] rounded-full bg-primary p-[6px] pr-[5px] text-[9px] text-white">
                <CheckmarkIcon />
              </div>
            </div>
            <div className="ml-4 w-[calc(100%-64px)]">
              <div className="text-xs leading-5 text-skin-text">
                {activity.opted?.optedIn ? 'Joined' : 'Left'}
              </div>
              <div className="truncate pr-2">{activity.space?.name}</div>
            </div>
          </div>
        </Link>
      )}
      {/* Other activities */}
    </div>
  );
};

export default ProfileActivityOptedItem;
