import React from 'react';

const Skeleton = () => {
  return (
    <div className="mb-4 lg:fixed lg:mb-0 lg:w-[240px]">
      <div className="flex px-4 pt-3 text-center lg:block lg:h-[253px]">
        <div className="mb-2 flex lg:mb-3 lg:block">
          <div className="lazy-loading mx-auto h-[80px] w-[80px] rounded-full" />
          <div className="ml-3 flex flex-col items-start justify-center lg:mt-3 lg:ml-0 lg:items-center">
            <div className="lazy-loading mb-2 h-[28px] w-[130px] rounded-md bg-skin-text" />
            <div className="lazy-loading h-[26px] w-[100px] rounded-md bg-skin-text" />
          </div>
        </div>
        <div className="ml-3 flex items-center justify-center gap-x-2 lg:ml-0">
          <button className="w-[120px] cursor-wait">Join</button>
        </div>
      </div>
    </div>
  )
}

export default Skeleton;