import React, { Fragment, useState } from 'react';
import { Menu } from '@headlessui/react';
import { Float } from '@headlessui-float/react';
import { MenuDots } from 'icons/MenuDots';

type Item = {
  name: any;
  text: string;
  action: string;
  extras?: any;
};

interface BaseMenuProps {
  items: any;
  selected?: string;
  onSelect: any;
  children?: React.ReactNode;
}

const BaseMenuDots: React.FC<BaseMenuProps> = ({ items, selected = '', onSelect, children }) => {

    const [selectedItem, setSelectedItem] = useState(items[0] || []);

    function handleChange(item) {
        setSelectedItem(item);
        console.log(item)
        onSelect(item)
    }
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
        <Menu.Button>
          <MenuDots width="1.3em" height="1.3em" />
        </Menu.Button>

        <Menu.Items className="overflow-hidden rounded-2xl border bg-skin-header-bg shadow-lg outline-none">
          <div className="no-scrollbar max-h-[300px] overflow-auto">
            {items.map((item) => (
              <Menu.Item key={item.name}>
                {({ active }) => (
                  <div
                    className={`${
                      active ? 'bg-skin-border text-skin-link' : 'bg-skin-header-bg text-skin-text'
                    } cursor-pointer whitespace-nowrap px-3 py-2`}
                    onClick={() => handleChange(item)}
                  >
                    {item.name}
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

export default BaseMenuDots;