import React from 'react';

const AboutMembersListItem = ({ children }) => {
  return (
    <div className="flex justify-between border-t px-4 py-3 first:border-t-0">
      {children}
    </div>
  );
};

export default AboutMembersListItem;