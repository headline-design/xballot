import { ProfileSidebarLoader } from 'components/Loaders/SidebarLoader';
import ButtonGroup from 'components/ButtonGroup';
import { useMemo } from 'react';
import { SidebarProps } from './types';
import CopyPaste from 'components/BaseComponents/CopyPaste';
import React from 'react';

const Sidebar: React.FC<SidebarProps> = ({
  items,
  value,
  creator,
  creatorName,
  creatorAvatar,
  actionButton,
  loading,
}) => {
  const buttonGroup = useMemo(
    () => (
      <ButtonGroup
        className="no-scrollbar no-scrollbar flex overflow-y-auto pb-0 pt-3 lg:mt-0 lg:block lg:pb-3"
        link={undefined}
        items={items}
        value={value}
        space={undefined}
      />
    ),
    [items, value],
  );

  return (
    <div id="sidebar-left" className="float-left w-full lg:w-1/4">
      <div className="mb-4 lg:fixed lg:mb-0 lg:w-[240px]">
        <div className="overflow-hidden border-y border-skin-border bg-skin-block-bg text-base md:rounded-xl md:border">
          <div className="leading-5 sm:leading-6">
            <div className="mt-4 flex px-4 lg:mt-0 lg:block lg:px-0">
              {!loading ? (
                <>
                  <div className="flex truncate lg:mt-3 lg:block">
                    <div className="flex lg:justify-center">
                      <div className="flex lg:block">
                        <span
                          className="flex shrink-0 items-center justify-center"
                          symbol-index="space"
                        >
                          <img
                            className="rounded-full bg-skin-border object-cover"
                            alt="avatar"
                            style={{
                              width: '69px',
                              height: '69px',
                              minWidth: '69px',
                              display: 'none',
                            }}
                          />
                          <img
                            src={creatorAvatar}
                            className="rounded-full bg-skin-border object-cover"
                            alt="avatar"
                            style={{ width: '69px', height: '69px', minWidth: '69px' }}
                          />
                        </span>
                      </div>
                    </div>
                    <div className="truncate lg:text-center">
                      <div className="truncate px-3 text-lg font-semibold leading-10 text-skin-heading">
                        {creatorName}
                      </div>
                      <div className="flex space-x-2 px-3 leading-5 lg:justify-center">
                      <CopyPaste text={creator} copyText={creator} hideIcon={undefined} shortenText={true} />
                      </div>
                    </div>
                  </div>
                  {actionButton}
                </>
              ) : (
                <ProfileSidebarLoader />
              )}
            </div>
          </div>
          {buttonGroup}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Sidebar);
