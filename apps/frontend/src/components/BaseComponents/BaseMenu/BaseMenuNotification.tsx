import React from 'react';
import { Menu } from '@headlessui/react';
import { Float } from '@headlessui-float/react';
import clsx from 'clsx';
import { MenuDots } from 'icons/MenuDots';

interface Item {
  icon: React.ReactElement;
  name: string;
  value: string;
}

interface BaseMenuNotificationProps {
  items: Item[];
  selected?: string;
  placement?: string | any;
  name?: string;
  value?: any;
}

const defaultProps: BaseMenuNotificationProps = {
  items: [],
  selected: '',
  placement: 'bottom-end',
};

const BaseMenuNotification: React.FC<BaseMenuNotificationProps> = ({
  items,
  selected,
  placement,
  name,
}) => {
  return (
    <Menu>
      <Float placement="bottom-end" offset={0}>
        <Menu.Button className="inline-block h-full text-left">
          <MenuDots width="1.2em" height="1.2em" />
        </Menu.Button>

        <Menu.Items className="z-50 mt-1 overflow-hidden rounded-2xl border bg-skin-header-bg shadow-lg outline-none">
          <div className="no-scrollbar max-h-[300px] overflow-auto">
            {items.map((item) => {
              return (
                <Menu.Item key={item.value}>
                  {({ active }) => (
                    <div
                      className={clsx(
                        active
                          ? 'bg-skin-border text-skin-link'
                          : 'bg-skin-header-bg text-skin-text',
                        'flex w-full cursor-pointer items-center whitespace-nowrap px-3 py-2 text-sm',
                      )}
                    >
                      {item.icon} {item.name}
                    </div>
                  )}
                </Menu.Item>
              );
            })}
          </div>
        </Menu.Items>
      </Float>
    </Menu>
  );
};

BaseMenuNotification.defaultProps = defaultProps;

export default BaseMenuNotification;
