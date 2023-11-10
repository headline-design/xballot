import React, { useEffect } from 'react';
import { ButtonCardProps } from './types';
import { NavLink, useLoaderData, useNavigation, useSubmit } from 'react-router-dom';
import { checkActive } from 'hooks/useLinkMatch';

const ButtonCardGroup: React.FC<ButtonCardProps> = ({
  items,
  activeBackground,
  className,
  defaultBackground,
  buttonStyle,
  onChange,
  ...props
}) => {
  return (
    <>
      {items.map((item) => (
        <>
          <button
            onClick={() => {
              onChange(item.value);
            }}
            key={item.value}
            className="relative w-full border-y border-skin-border p-4 py-[18px] pr-[80px] text-left hover:border-skin-text md:rounded-xl md:border-x"
          >
            <h4 className="leading-2 mt-0 mb-1">{item.label}</h4>
            {item.description}
            <svg
              viewBox="0 0 24 24"
              width="1.2em"
              height="1.2em"
              className="absolute top-[calc(50%-17px)] right-4 text-xl"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m9 5l7 7l-7 7"
              />
            </svg>
          </button>
        </>
      ))}
    </>
  );
};
export default ButtonCardGroup;
