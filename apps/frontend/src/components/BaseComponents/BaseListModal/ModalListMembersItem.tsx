import React from 'react';
import { MembersListPopover } from 'components/ProfilePopover/MemberPopover';

const ModalListMembersItem = ({ item, itemRef, i, expand, status, profiles, creator, close }) => {
  return (
    <div
      key={i}
      ref={itemRef}
      onClick={expand}
      className="flex cursor-pointer items-center gap-3 border-t px-3 py-[14px] first:border-0"
    >
      <div className="w-[110px] min-w-[110px] text-left xs:w-[130px] xs:min-w-[130px]">
        <MembersListPopover
          item={item}
          creator={creator}
          profiles={profiles}
          widthClass="w-[110px] min-w-[110px] xs:w-[130px] xs:min-w-[130px] text-left"
          close={close}
        />
      </div>
      <div className="flex-auto truncate px-2 text-center text-skin-link">
        <div className="truncate text-center text-skin-link"></div>
      </div>
      <div className="flex w-[110px] min-w-[110px] items-center justify-end whitespace-nowrap text-right text-skin-link xs:w-[130px] xs:min-w-[130px]">
        <span>
          <div className="space-x-2">{status}</div>
        </span>
      </div>
    </div>
  );
};

export default ModalListMembersItem;
