import React, { ReactNode } from 'react';
import { Popover } from '@headlessui/react';
import { Float } from '@headlessui-float/react';

type BasePopoverProps = {
  label?: any;
  placement?: string | any;
  button?: ReactNode;
  children?: ReactNode;
  MenuButton?: ReactNode;
};

const defaultProps: BasePopoverProps = {
  label: '',
  placement: 'bottom-end',
  button: null,
  children: null,
  MenuButton: null,
};

function BasePopover({ children, button, label, placement }: BasePopoverProps = defaultProps) {
  return (
    <Popover>
      <Float
        placement={placement}
        offset={2}
        shift={6}
        flip={10}
        arrow={5}
        enter="transition duration-200 ease-out"
        enterFrom="opacity-0 -translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition duration-150 ease-in"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-1"
      >
        <Popover.Button className="button relative flex  !h-[46px] !w-[46px] cursor-pointer select-none items-center justify-center rounded-[23px] rounded-full border border-skin-border bg-transparent px-[22px] text-[18px] text-skin-link  hover:border-skin-text">
          <span>{label}</span>
        </Popover.Button>

        <Popover.Panel className="mt-1 w-screen max-w-xs outline-none sm:max-w-sm">
          {children}
        </Popover.Panel>
      </Float>
    </Popover>
  );
}

export default BasePopover;
