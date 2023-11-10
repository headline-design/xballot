export const ProfileSidebarLoader = () => (
  <div className="flex lg:block">
    <div className="lazy-loading mx-auto h-[69px] w-[69px] rounded-full lg:mt-3" />
    <div className="ml-3 flex flex-col items-start justify-center lg:ml-0 lg:mt-2 lg:items-center">
      <div className="lazy-loading mb-2 h-[24px] w-[130px] rounded-md bg-skin-text" />
      <div className="lazy-loading h-[22px] w-[100px] rounded-md bg-skin-text" />
    </div>
    <div className="flex flex-grow justify-end lg:mt-3 lg:flex-auto lg:justify-center">
      <div className="ml-3 flex items-center justify-center gap-x-2 lg:ml-0">
        <button type="button" className="button w-[120px] cursor-wait px-[22px]" data-v-4a6956ba="">
          <span className="opacity-0"> Join</span>
        </button>
      </div>
    </div>
  </div>
);

export const SidebarNavLoader = () => (
  <div className="mt-2 space-y-2 px-2">
    <div className="h-[44px] w-[44px] animate-pulse rounded-full bg-skin-border" />
    <div className="h-[44px] w-[44px] animate-pulse rounded-full bg-skin-border" />
    <div className="h-[44px] w-[44px] animate-pulse rounded-full bg-skin-border" />
    <div className="h-[44px] w-[44px] animate-pulse rounded-full bg-skin-border" />
    <div className="h-[44px] w-[44px] animate-pulse rounded-full bg-skin-border" />
  </div>
);

export const SidebarLoader = () => (
  <div className="flex px-4 pt-3 text-center lg:block lg:h-[253px]">
    <div className="mb-2 flex lg:mb-3 lg:block">
      <div className="lazy-loading mx-auto h-[80px] w-[80px] rounded-full" />
      <div className="ml-3 flex flex-col items-start justify-center lg:ml-0 lg:mt-3 lg:items-center">
        <div className="lazy-loading mb-2 h-[28px] w-[130px] rounded-md bg-skin-text" />
        <div className="lazy-loading h-[26px] w-[100px] rounded-md bg-skin-text" />
      </div>
    </div>
    <div className="ml-3 flex items-center justify-center gap-x-2 lg:ml-0">
      <button type="button" className="button w-[120px] cursor-wait px-[22px]" data-v-4a6956ba="">
        <span className="opacity-0"> Join</span>
      </button>
    </div>
  </div>
);
