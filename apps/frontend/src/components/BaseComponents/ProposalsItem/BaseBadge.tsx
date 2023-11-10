import React, { useMemo } from 'react';

interface Member {
  address: string;
  joinedAt: string;
}

interface BaseBadgeProps {
  address: string;
  members?: Member[];
}

const BaseBadge: React.FC<BaseBadgeProps> = ({ address, members }) => {
  const isCore = useMemo(() => {
    if (!members) return false;
    const lowercaseMembers = members.map(member => member.address.toLowerCase());

    return lowercaseMembers.includes(address?.toLowerCase());
  }, [address, members]);

  return (
    isCore && (
      <div className="ml-1 rounded-full border px-[7px] text-xs text-skin-text">
        {'Core'}
      </div>
    )
  );
};

export default BaseBadge;
