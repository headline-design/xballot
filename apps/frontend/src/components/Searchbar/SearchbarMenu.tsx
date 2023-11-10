import { Float } from '@headlessui-float/react';
import { Menu } from '@headlessui/react';
import clsx from 'clsx';
import type { Placement } from '@floating-ui/dom';
import { useRoutes } from 'react-router-dom';
import { BaseMenuProps } from 'components/ButtonGroup/types';

export const BaseMenu: React.FC<BaseMenuProps> = ({
  items,
  value,
  link,
  activeBackground,
  className,
  defaultBackground,
  activeTextColor,
  defaultTextColor,
  buttonStyle,
  activeButtonStyle,
  isActive,
  onChange,
  placement,
  name,
  buttonContainer,
  ...props
}) => {
  const path = useRoutes;

  return (
    <Menu as="div" className="inline-block h-full text-left mt-2 w-full xs:w-auto sm:mr-2 md:ml-2 md:mt-0">
      <Float
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        offset={8}
        shift={6}
        flip={16}
        zIndex={50}
        placement={placement}
      >
        <Menu.Button data-v-1b931a55="" className="button w-full whitespace-nowrap px-[24px] pr-3">
          {buttonContainer}
        </Menu.Button>
        <Menu.Items className="z-60 overflow-hidden rounded-2xl border bg-skin-header-bg shadow-lg outline-none">
          <div className="no-scrollbar max-h-[300px] overflow-auto">
            {items.map((item) => {
              return (
                <Menu.Item key={name}>
                  {({ active }) => (
                    <div
                      key={name}
                      className={clsx(
                        active
                          ? 'bg-skin-border text-skin-link'
                          : 'bg-skin-header-bg text-skin-text',
                        'cursor-pointer whitespace-nowrap px-3 py-2',
                      )}
                    >
                      {item.name}
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
