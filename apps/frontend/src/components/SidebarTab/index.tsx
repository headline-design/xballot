import React from 'react';
import { TabsButtonGroupProps } from '../ButtonGroup/types';
import { useNavigate } from 'react-router-dom';

const GridTabsButtonGroup: React.FC<TabsButtonGroupProps> = ({
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
  onChange,
  active,
  ...props
}) => {
  const navigate = useNavigate();

  return (
    <div className="no-scrollbar mt-4 flex overflow-y-auto lg:my-3 lg:mt-0 lg:block" {...props}>
      {items.map((item, index) => (
        <div
          key={`SidebarTabIndex_${index}`}
          onClick={() => {
            navigate(item.link);
          }}
        >
          <div
            onClick={() => {
              onChange(item.value);
            }}
            key={item.value}
          >
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};
export default GridTabsButtonGroup;
