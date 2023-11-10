import React, { useEffect } from 'react';
import { useNotifications } from 'composables/useNotifications';
import { useIntl } from 'helpers/useIntl';
import Button from '../BaseButton/BaseButton';
import AvatarSpace from 'components/AvatarSpace';
import { LoadingRow } from '../BaseLoading/LoadingRow';
import BasePopover from '../BasePopover/BasePopover';
import { Popover } from '@headlessui/react';
import { CheckmarkIcon } from 'icons/Checkmark';
import { Bell } from 'icons/Bell';
import BaseIndicator from '../BaseIndicator';
import BaseMenuNotification from '../BaseMenu/BaseMenuNotification';

type NavbarNotificationProps = {
  pipeState: any; // Replace with the correct type
};

interface Item {
  icon: React.ReactElement;
  name: string;
  value: string;
  seen: any;
  text: any;
  id: any;
  space: any;
  time: any;
  event: any;
}

type NotificationFilter = string;

const NavbarNotification: React.FC<NavbarNotificationProps> = ({ pipeState }) => {
  const {
    notificationsSortedByTime,
    loading,
    NotificationEvents,
    selectedFilter,
    filters,
    loadNotifications,
    selectNotification,
    markAllAsRead,
    setSelectedFilter,
  } = useNotifications({ pipeState });

  const { formatRelativeTime } = useIntl();

  const selectThreedotItem = (e: string) => {
    if (e === 'markAllAsRead') markAllAsRead();
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  //console.log('notificationsSortedByTime', notificationsSortedByTime);

  return (
    <BasePopover
      label={
        <>
          <Bell className={undefined} />

          {notificationsSortedByTime.some((n: NotificationFilter) => !n.seen) && (
            <BaseIndicator className="absolute bottom-0 right-0 inline-block h-[12px] w-[12px] rounded-full bg-primary !bg-red" />
          )}
        </>
      }
      placement="bottom-end"
      button={true}
      MenuButton={undefined}
    >
      <div className="overflow-hidden rounded-2xl border bg-skin-header-bg shadow-lg">
        <div className="no-scrollbar max-h-[85vh] overflow-y-auto overscroll-contain">
          <div>
            <div className="my-2 w-full">
              <div className="relative mb-3 flex items-center justify-between px-3">
                <h4>Notifications</h4>
                <BaseMenuNotification
                  selected={undefined}
                  items={[
                    {
                      icon: <CheckmarkIcon className="mr-2 text-sm" />,
                      name: 'Mark all as read',
                      value: 'markAllAsRead',
                    },
                  ]}
                ></BaseMenuNotification>
              </div>
              <div className="mb-3 space-x-2 px-3">
                {filters.map((filter: NotificationFilter) => (
                  <Button
                    key={filter}
                    className={`button !h-[44px] px-[22px] ${
                      selectedFilter === filter ? '!border-skin-link' : ''
                    }`}
                    onClick={() => setSelectedFilter(filter)}
                  >
                    {filter}
                  </Button>
                ))}
              </div>
              {notificationsSortedByTime.some((n: Notification) => !n.seen && n.isRecent) && (
                <BaseIndicator className="absolute bottom-0 right-0 !bg-red" />
              )}
              {!notificationsSortedByTime.length && loading && <LoadingRow />}
              {!notificationsSortedByTime.length && !loading && (
                <div className="pb-3 pt-4 text-center">
                  <h4 className="text-skin-text">You have no notifications</h4>
                </div>
              )}

              {notificationsSortedByTime.map((item: Item) => (
                <Popover.Button key={item.id} as="div">
                  {item.space && (
                    // eslint-disable-next-line jsx-a11y/anchor-is-valid
                    <a
                      key={item.id}
                      className="flex w-full cursor-pointer px-3 pb-2 pt-3 hover:bg-skin-border"
                      onClick={() => selectNotification(item.id, item.space.id)}
                    >
                      <div className="hidden w-[78px] sm:block">
                        <AvatarSpace space={item.space} size="44" previewFile={undefined} />
                      </div>
                      <div className="w-full">
                        <div className="flex leading-tight">
                          <div className="max-w-[110px] truncate text-skin-link">
                            {item.space.name}
                          </div>
                          <div className="ml-1 text-skin-text">
                            {item.event === NotificationEvents.ProposalStart
                              ? 'Proposal started'
                              : item.event === NotificationEvents.ProposalEnd
                              ? 'Proposal ended'
                              : ''}
                          </div>
                        </div>
                        <div className="whitespace-normal leading-tight text-skin-link line-clamp-2">
                          "{item.text}"
                        </div>
                        <div className="leading-normal text-skin-text">
                          <span>
                            {formatRelativeTime(item.time, useIntl.longRelativeTimeFormatter)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-2 flex w-[12px] items-center">
                        {!item.seen && <BaseIndicator className={undefined} />}
                      </div>
                    </a>
                  )}
                </Popover.Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BasePopover>
  );
};

export default NavbarNotification;
