import { Float } from '@headlessui-float/react';
import { Menu } from '@headlessui/react';
import clsx from 'clsx';
import { DelegateIcon } from 'icons/Delegate';
import { ProfileIcon } from 'icons/Profile';
import { SignoutIcon } from 'icons/Signout';
import { SwitchIcon } from 'icons/Switch';
import { Link, useNavigate } from 'react-router-dom';

function NavbarMenu({ domainData, Avatar, pipeState, shorten, disconnectWallet, openModal }) {
  const { name, domain } = domainData || {};
  const userName = name || domain || shorten(pipeState.myAddress);
  const navigate = useNavigate();

  const MenuItem = ({ to, onClick = () => {}, children, Icon }) => (
    <Menu.Item>
      {({ active }) => (
        <Link to={to} onClick={onClick}>
          <div
            className={clsx(
              active ? 'bg-skin-border text-skin-link' : 'bg-skin-header-bg text-skin-text',
              'cursor-pointer whitespace-nowrap px-3 py-2',
            )}
          >
            <div className="flex items-center space-x-2">
              <div className="w-[24px]">
                <Icon />
              </div>
              <span className="mr-3">{children}</span>
            </div>
          </div>
        </Link>
      )}
    </Menu.Item>
  );


  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ close }) => (
        <Float
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
          offset={8}
          shift={16}
          flip={16}
          z-index={40}
          placement="bottom-end"
        >
          <Menu.Button className="connected-btn-header button flex items-center px-[22px]">
            <span className="-ml-1 -mr-1 flex shrink-0 items-center justify-center sm:mr-2 md:mr-2 lg:mr-2 xl:mr-2">
              <Avatar domainData={domainData} />
            </span>
            <span className="hidden sm:block">{userName}</span>
          </Menu.Button>

          <Menu.Items
            static
            className="overflow-hidden rounded-2xl border bg-skin-header-bg shadow-lg outline-none"
          >
            <div className="no-scrollbar max-h-[300px] overflow-auto" role="none">
              <MenuItem to={`/account/${pipeState.myAddress}/about`} Icon={ProfileIcon}>
                Account
              </MenuItem>
              <MenuItem to={'/delegate'} onClick={close} Icon={DelegateIcon}>
                Delegate
              </MenuItem>
              <MenuItem
                onClick={(e) => {
                  openModal(e);
                  close();
                }}
                Icon={SwitchIcon}
              >
                Switch wallet
              </MenuItem>
              <MenuItem
                onClick={() => {
                  disconnectWallet();
                  close();
                }}
                Icon={SignoutIcon}
              >
                Log out
              </MenuItem>
            </div>
          </Menu.Items>
        </Float>
      )}
    </Menu>
  );
}

export default NavbarMenu;
