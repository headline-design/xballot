import { Float } from '@headlessui-float/react';
import { Menu } from '@headlessui/react';
import { MenuDots } from 'icons/MenuDots';
import clsx from 'clsx';
import {  useNavigate } from 'react-router-dom';
import { useAppPersistStore } from 'store/useAppStore';
import type { Placement } from '@floating-ui/dom';

export const ButtonMore = ({
  className,
  username,
  postId,
  placement = 'bottom-end',
  width,
  height,
  share,
  report,
}: {
  username?: string | any;
  className: any;
  postId: number | any;
  placement?: Placement;
  width: any;
  height: any;
  share: any;
  report?: any;
}) => {
  const navigate = useNavigate();
  const user = useAppPersistStore((state) => state.user);

  return (
    <Menu as="div" className={className ? className : 'relative'}>
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
        <Menu.Button className="flex items-center rounded-full p-[6px] text-md text-skin-text transition-colors duration-200 hover:text-skin-link">
          <MenuDots
            width={width || '1.2em'}
            height={height || '1.2em'}
            className="h-[1em] w-[1em]"
          />
        </Menu.Button>
        <Menu.Items className="z-50 overflow-hidden rounded-2xl border bg-skin-header-bg shadow-lg outline-none">
          <div className="no-scrollbar max-h-[300px] overflow-auto">
            {username === user?.username ? (
              <>
                <Menu.Item>
                  {({ active }) => (
                    <div
                      className={clsx(
                        active
                          ? 'bg-skin-border text-skin-link'
                          : 'bg-skin-header-bg text-skin-text',
                        'cursor-pointer whitespace-nowrap px-3 py-2',
                      )}
                      onClick={(event) => {
                        event.preventDefault();
                        navigate(`post/${postId}`);
                      }}
                    >
                      View
                    </div>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <div
                      className={clsx(
                        active
                          ? 'bg-skin-border text-skin-link'
                          : 'bg-skin-header-bg text-skin-text',
                        'cursor-pointer whitespace-nowrap px-3 py-2',
                      )}
                      onClick={(event) => {
                        event.preventDefault();
                        share();
                      }}
                    >
                      Share
                    </div>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <div
                      className={clsx(
                        active
                          ? 'bg-skin-border text-skin-link'
                          : 'bg-skin-header-bg text-skin-text',
                        'cursor-pointer whitespace-nowrap px-3 py-2',
                      )}
                      onClick={(event) => {
                        event.preventDefault();
                        console.log('report post');
                        report();
                      }}
                    >
                      Report
                    </div>
                  )}
                </Menu.Item>
              </>
            ) : (
              <Menu.Item>
                {({ active }) => (
                  <div
                    className={clsx(
                      active ? 'bg-skin-border text-skin-link' : 'bg-skin-header-bg text-skin-text',
                      'cursor-pointer whitespace-nowrap px-3 py-2',
                    )}
                    onClick={() => {
                      console.log('report');
                      report();
                    }}
                  >
                    Report
                  </div>
                )}
              </Menu.Item>
            )}
          </div>
        </Menu.Items>
      </Float>
    </Menu>
  );
};
