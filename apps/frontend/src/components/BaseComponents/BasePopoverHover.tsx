import { Popover } from '@headlessui/react';
import { Float } from '@headlessui-float/react';

interface BasePopoverHoverProps {
  label: any;
  children: any;
  show: any;
  open: any;
  delayClose: any;
  placement: any;
  zIndex?: number;
}

export const BasePopoverHover: React.FC<BasePopoverHoverProps> = ({
  label,
  children,
  show,
  open,
  delayClose,
  placement,
  zIndex,
}) => {
  return (
    <Popover className="flex">
      <Float
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        show={show}
        placement={placement}
        offset={10}
        shift={16}
        flip={16}
        zIndex={zIndex || 50}
        portal
      >
        <Popover.Button className="outline-none" onMouseEnter={open} onMouseLeave={delayClose}>
          {label}
        </Popover.Button>
        <Popover.Panel
          static
          className="w-screen outline-none sm:max-w-sm"
          onMouseEnter={open}
          onMouseLeave={delayClose}
        >
          <div className="overflow-hidden rounded-2xl border border-skin-border bg-skin-header-bg shadow-lg">
            <div className="no-scrollbar max-h-[85vh] overflow-y-auto overscroll-contain">
              {children}
            </div>
          </div>
        </Popover.Panel>
      </Float>
    </Popover>
  );
};
