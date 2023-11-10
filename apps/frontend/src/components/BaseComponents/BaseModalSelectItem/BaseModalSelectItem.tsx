import React from 'react';

interface Props {
  selected?: boolean;
  title: string;
  text?: string;
  description?: string;
}

const BaseModalSelectItem: React.FC<Props> = ({ selected, title, text, description }) => {
  return (
    <div className="cursor-pointer border-y border-skin-border bg-skin-block-bg text-base transition-colors hover:border-skin-text md:rounded-xl md:border">
      <div className="p-4 leading-5 sm:leading-6">
        <div className="relative inset-y-0 flex items-center">
          <div className={`w-full ${selected ? 'pr-[44px]' : ''}`}>
            <div className="mb-2 flex items-center gap-2">
              <h3 className="mb-0 mt-0 truncate">{title}</h3>
              <span
                className={` ${!selected ?  '!border-skin-link' : '' } 
                ${selected ? 'pr-44px' : ' rounded-full bg-skin-text px-2 text-center text-xs leading-5 text-white'}`}
              
             />
            </div>
            {description && <span className="text-skin-text"> {description} </span>}
          </div>
          {selected && (
            <svg
              viewBox="0 0 24 24"
              width="1.2em"
              height="1.2em"
              className="absolute right-0 text-md"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

export default BaseModalSelectItem;
