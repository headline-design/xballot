import React, { useState } from 'react';
import { TabsButtonGroupProps } from './types';
import { NavLink } from 'react-router-dom';
import { checkActive } from 'hooks/useLinkMatch';

const NavbarButtonGroup: React.FC<TabsButtonGroupProps> = ({
  items,
  link,
  activeBackground,
  className,
  defaultBackground,
  activeTextColor,
  defaultTextColor,
  buttonStyle,
  activeButtonStyle,
  end,
  space,
  ...props
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxVisibleItems = 5;
  const hasMoreItems = items.length > maxVisibleItems - 1;
  const activeClassName =
    'block cursor-pointer whitespace-nowrap nav-wrap text-skin-link ';

  const handleMoreButtonClick = () => {
    setIsExpanded(!isExpanded);
  };

  const itemsToRender = isExpanded ? items : items.slice(0, maxVisibleItems - 1);

  return (
    <div className={className + ' no-scrollbar flex overflow-y-auto lg:mt-0 block'} {...props}>
      {itemsToRender.map((item, index) => (
        <div key={`GridTabsButtonGroup_${index}`}>
          <NavLink
            key={`ButtonGroupItem_${index}`}
            to={item.link}
            end={item.end}
            className={(navData: any) => (navData.isActive = { checkActive } ? 'active' : '')}
          >
            {({ isActive }) => (
              <div
                className={
                  isActive
                    ? activeClassName
                    : 'block cursor-pointer whitespace-nowrap nav-wrap text-skin-text hover:text-skin-link'
                }
                key={item.value}
              >
                {item.label}
              </div>
            )}
          </NavLink>
        </div>
      ))}
      {hasMoreItems && (
        <div key={`GridTabsButtonGroup_more`} onClick={handleMoreButtonClick}>
          <div
            className={'block cursor-pointer whitespace-nowrap px-4  py-2 text-skin-link hover:bg-skin-bg'}>
           <span>{isExpanded ? '-' : '+'}</span>  <span>{isExpanded ? 'Less' : 'More'}</span>
          </div>
        </div>
      )}
    </div>
  );
};
export default NavbarButtonGroup;
