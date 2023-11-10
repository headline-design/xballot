import React from 'react';

const BaseCounter = ({ counter, className }: { counter?: number | string, className?: any; }) => {
  if (!counter || (typeof counter === 'number' && counter < 0)) return null;

  return (
    <div className={className ? className : "h-[20px] min-w-[20px] rounded-full bg-skin-text px-1 text-center text-xs leading-normal text-white ml-1 inline-block"}>
      {Number(counter)}
    </div>
  );
};

export default BaseCounter;
