import { Link, useLocation } from 'react-router-dom';

function RankingSidebar({ rankingViews, className, setDefaultSortOption }) {
  const location = useLocation();
  const activeClassName =
    'block cursor-pointer whitespace-nowrap px-4  py-2 text-skin-link hover:bg-skin-bg border-l-[0px] border-b-[3px] !pl-[21px] lg:border-b-[0px] lg:border-l-[3px]';

  const rankingButtons = rankingViews.map((item, index) => {
    const isActive = location.pathname === item.link;

    return (
      <Link
        key={`ButtonGroupItem_${index}`}
        to={item.link}
        className={`${className} no-scrollbar flex overflow-y-auto lg:mt-0 lg:block`}
onClick={setDefaultSortOption}
      >
        <div
          className={`${
            isActive
              ? activeClassName
              : 'block cursor-pointer whitespace-nowrap px-4  py-2 text-skin-link hover:bg-skin-bg'
          }`}
          key={item.value}
        >
          {item.label}
        </div>
      </Link>
    );
  });

  return (
    <div id="sidebar-left" className=" pb-4 lg:pb-0 float-left w-full lg:fixed lg:mb-4 lg:w-[240px]">
      <div className="overflow-hidden border-y !border-t-0 border-skin-border bg-skin-block-bg text-base md:rounded-xl md:border md:!border-t">
        <div className="leading-5 sm:leading-6">
          <div className="lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto">
            <div className="no-scrollbar mt-0 flex overflow-y-auto lg:my-3 lg:block lg:py-3">
              {rankingButtons}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RankingSidebar;
