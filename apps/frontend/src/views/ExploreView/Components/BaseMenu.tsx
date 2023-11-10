import React, { Fragment } from 'react';
import { Menu } from '@headlessui/react';
import { ChevronDown } from 'icons/ChevronDown';
import { Float } from '@headlessui-float/react';

type Item = {
  text: string;
  action: string;
  extras?: any;
};

interface BaseMenuProps {
  items: Item[];
  selected?: string;
  onSelect: (action: string) => void;
  children?: React.ReactNode;
}

const BaseMenu: React.FC<BaseMenuProps> = ({ items, selected = '', onSelect, children }) => {
  return (
    <Menu as="div" className="inline-block h-full text-left">
      <Float
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        placement="bottom-end"
        zIndex={50}
        offset={5}
        shift={16}
        flip={16}
      >
        <Menu.Button className="h-full">
          {children || (
            <div className="flex items-center">
              {selected}
              <ChevronDown className="-mr-1 ml-1 text-xs text-skin-text" aria-hidden="true" />
            </div>
          )}
        </Menu.Button>

        <Menu.Items className="overflow-hidden rounded-2xl border bg-skin-header-bg shadow-lg outline-none">
          <div className="no-scrollbar max-h-[300px] overflow-auto">
            {items.map((item) => (
              <Menu.Item key={item.text}>
                {({ active }) => (
                  <div
                    className={`${
                      active ? 'bg-skin-border text-skin-link' : 'bg-skin-header-bg text-skin-text'
                    } cursor-pointer whitespace-nowrap px-3 py-2`}
                    onClick={() => onSelect(item.action)}
                  >
                    {item.text}
                  </div>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Float>
    </Menu>
  );
};

export default BaseMenu;
