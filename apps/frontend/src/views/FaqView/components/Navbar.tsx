import React from 'react';
import { ButtonTheme, ButtonThemeAlt } from 'components/BaseComponents/ButtonTheme';
import { Logo } from 'components/Logo';
import { Link } from 'react-router-dom';
import NavbarButtonGroup from 'components/ButtonGroup/NavbarButtonGroup';
import { useMemo } from 'react';
import AboutNavMenu from './AboutNavbarMenu';

const Navbar = ({ link, items, value }) => {
  const buttonGroup = useMemo(
    () => (
      <NavbarButtonGroup
        className="mt-0"
        link={link}
        items={items}
        value={value}
        space={undefined}
      />
    ),
    [link, items, value],
  );

  return (
    <nav
      id="topnav"
      className="lg:px-8 fixed z-10 mx-auto flex flex h-[70px] w-full  max-w-7xl items-center items-center justify-between border-b bg-skin-bg p-6"
    >
      <div className="felx-auto mx-auto flex w-full max-w-[1012px] items-center justify-between">
        <Link to="/" className="ml-[50px] flex items-center text-lg font-normal">
          <Logo className="iconfont mr-2" width={32} height={32} />
          XBallot{' '}
        </Link>

        <div className="flex items-center">
          <div className="relative ml-auto hidden items-center lg:flex ">
            <div className="text-sm font-semibold leading-6 text-skin-text hover:text-skin-link ">
              {buttonGroup}
            </div>
            <div className="ml-6 flex items-center border-l border-slate-200 pl-6 dark:border-slate-800">
              <ButtonThemeAlt />
            </div>
          </div>
          <AboutNavMenu navButtons={items} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
