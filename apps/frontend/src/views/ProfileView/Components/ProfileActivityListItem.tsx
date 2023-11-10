import React from 'react';
import { ProfileActivity } from 'helpers/interfaces';
import AvatarSpace from 'views/TimelineView/Components/AvatarSpace';
import { Link } from 'react-router-dom';
import { getEndpoints, staticEndpoints } from 'utils/endPoints';

interface ProfileActivityListItemProps {
  activity: ProfileActivity;
  activities: any;
}

const ProfileActivityListItem: React.FC<ProfileActivityListItemProps> = ({
  activity,
  activities,
}) => {
  const endPoints = getEndpoints();
  //console.log(activity)
  return (
    <div className="border-b border-skin-text last:border-b-0">
      {activities && (
        <Link
          to={{
            pathname: activity.link,
          }}
        >
          <div className="flex w-full px-4 py-4">
            <div className="relative min-w-[52px]">
              <AvatarSpace size={44} space={activity.space} stamp={staticEndpoints.stamp} />
              <div className="absolute right-0 top-[24px] rounded-full bg-primary p-[6px] pr-[5px] text-[9px] text-white">
                {activity.icon}
              </div>
            </div>
            <div className="ml-4 w-[calc(100%-64px)]">
              <div className="text-xs leading-5 text-skin-text">{activity.subtitle}</div>
              <div className="truncate pr-2">{activity.title}</div>
            </div>
          </div>
        </Link>
      )}
      {/* Other activities */}
    </div>
  );
};

export default ProfileActivityListItem;
