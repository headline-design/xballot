import React from "react";
import { Block } from "components/BaseComponents/Block";

interface ProfileActivityListProps {
  title: string;
  children
}

const ProfileActivityList: React.FC<ProfileActivityListProps> = ({
  title,
  children,
}) => {
  return (
    <div>
      <span className="px-4 text-xs text-skin-link md:px-0">
        {title.toUpperCase()}
      </span>
      <Block slim className="my-1">
        {children}
      </Block>
    </div>
  );
};

export default ProfileActivityList;
