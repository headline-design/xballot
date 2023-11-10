import { IconVerifiedSpace as CheckBadgeIcon } from 'icons/IconVerifiedSpace';
import React, { useMemo } from 'react';
// You need to import the BaseIcon component. Replace 'BaseIcon' with the correct component import.
import BaseIcon from './BaseIcon';

// Replace this with the actual translation function for your application.
const translate = (key) => key;

const IconVerifiedSpace = ({ spaceId, size = '20', verified }) => {
  const isVerified = useMemo(() => verified[spaceId] || 0, [spaceId]);

  const verifiedTooltip = {
    content: translate('verifiedSpace'),
    placement: 'right',
  };

  const warningTooltip = {
    content: translate('warningSpace'),
    placement: 'right',
  };

  return (
    <div className="cursor-help">
      {isVerified === 1 && (
        <CheckBadgeIcon name="check" />
      )}
      {isVerified === -1 && (
        <BaseIcon

          name="warning"
          size="20"

        />
      )}
    </div>
  );
};

export default IconVerifiedSpace;
