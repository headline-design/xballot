import { SignatureIcon } from 'icons/Signature';
import BaseLink from '../BaseLink';
import { Block } from '../Block';
import { Button } from '../Button';
import { ExternalLinkIcon } from 'icons/ExternalLink';
import { useState } from 'react';
import { Popover } from '@headlessui/react';
import { Float } from '@headlessui-float/react';
import { shorten } from 'helpers/utils';
import { getEndpoints } from 'utils/endPoints';

const SignaturePopover = ({ vote, zIndex }) => {
  const endPoints = getEndpoints();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover>
      <Float
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        placement={'bottom-end'}
        offset={4}
        shift={16}
        flip={16}
        zIndex={zIndex || 50}
        portal
      >
        <Popover.Button className="flex items-center rounded-full p-[6px] text-md text-skin-text transition-colors duration-200 hover:text-skin-link">
          {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
          <SignatureIcon />
        </Popover.Button>

        <Popover.Panel className="w-screen max-w-xs outline-none sm:max-w-sm" >
          <div className="overflow-hidden rounded-2xl border bg-skin-header-bg shadow-lg">
            <div className="no-scrollbar max-h-[85vh] overflow-y-auto overscroll-contain">
              <div className="m-4 space-y-4">
                <h3 className="text-center">Signature</h3>

                <Block slim className="p-4 text-skin-link">
                  <div className="flex">
                    <span className="mr-1 flex-auto text-skin-text">Author</span>
                    <div className="text-skin-link">{shorten(vote?.signature)}</div>
                  </div>
                </Block>

                <BaseLink
                  link={`${endPoints.explorer}tx/${vote?.txid} `}
                  className="mb-2 block"
                  hideExternalIcon
                >
                  <Button className="w-full">
                    Verify signature
                    <ExternalLinkIcon className="ml-1 mb-[2px] inline-block text-xs" />
                  </Button>
                </BaseLink>
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Float>
    </Popover>
  );
};

export default SignaturePopover;
