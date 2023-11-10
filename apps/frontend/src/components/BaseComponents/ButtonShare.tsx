import { Float } from '@headlessui-float/react';
import { Menu } from '@headlessui/react';
import clsx from 'clsx';
import type { Placement } from '@floating-ui/dom';
import { useCopy } from '../../composables/useCopy';
import { useLocation } from 'react-router-dom';
import { getEndpoints } from 'utils/endPoints';

export const ButtonShare = ({shareText, placement = 'bottom-end', space }: {shareText, space, placement?: Placement }) => {
  const endPoints = getEndpoints();
  const { copyToClipboard } = useCopy();
  let location = useLocation();
  //console.log(location.pathname);

  const handleTwitterShare = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${endPoints.xballotUrl + space?.domain}&text=Look%20what%20I%20found!%20${space?.name}%20on%20XBallot%20&via=xballot_`,
      'twitter-share-dialog',
      'width=626,height=436',
    );
  };

  const handleFacebookShare = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${endPoints.xballotUrl + space?.domain}`,
      'facebook-share-dialog',
      'width=626,height=436'
    );
  };

  return (
    <span className="flex cursor-pointer select-none items-center pr-1 hover:text-skin-link">
      <Menu as="div" className="relative">
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
          <Menu.Button className="flex cursor-pointer select-none items-center pr-1 hover:text-skin-link">
            <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" className="text-base">
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            <span className="ml-1 hidden md:block">{shareText && 'Share' }</span>
          </Menu.Button>
          <Menu.Items className="z-50 overflow-hidden rounded-2xl border bg-skin-header-bg shadow-lg outline-none">
            <div className="no-scrollbar max-h-[300px] overflow-auto">
              <Menu.Item>
                {({ active }) => (
                  <div
                    className={clsx(
                      active ? 'bg-skin-border text-skin-link' : 'bg-skin-header-bg text-skin-text',
                      'cursor-pointer whitespace-nowrap px-3 py-2',
                    )}
                    onClick={() => copyToClipboard(`${endPoints.xballotUrl + location.pathname}`)}
                  >
                    Copy link
                  </div>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <div
                    onClick={handleTwitterShare}
                    className={clsx(
                      active ? 'bg-skin-border text-skin-link' : 'bg-skin-header-bg text-skin-text',
                      'cursor-pointer whitespace-nowrap px-3 py-2',
                    )}
                  >
                    Share to Twitter
                  </div>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <div
                  onClick={handleFacebookShare}
                    className={clsx(
                      active ? 'bg-skin-border text-skin-link' : 'bg-skin-header-bg text-skin-text',
                      'cursor-pointer whitespace-nowrap px-3 py-2',
                    )}
                  >
                    Share to Facebook
                  </div>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Float>
      </Menu>
    </span>
  );
};
