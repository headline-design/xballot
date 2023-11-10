import { Link } from 'react-router-dom';

function TimelineSidebar({
  timelineViews,
  selectedTimelineView,
  selectTimelineView,
  className,
  feed,
}) {
  const handleViewSelection = (index) => {
    selectTimelineView(index);
  };

  const activeClassName =
    'block cursor-pointer whitespace-nowrap px-4  py-2 text-skin-link hover:bg-skin-bg border-l-[0px] border-b-[3px] !pl-[21px] lg:border-b-[0px] lg:border-l-[3px]';

  const timelineButtons = timelineViews.map((item, index) => {
    const isActive = (item.value === '0' && feed === 'all') || (item.value === '1' && feed === 'joined');

    return (
      <Link
        key={`ButtonGroupItem_${index}`}
        to={item.link}
        className={`${className} no-scrollbar flex overflow-y-auto lg:mt-0 lg:block`}
      >
        <div
          className={`${isActive ? activeClassName : 'block cursor-pointer whitespace-nowrap px-4  py-2 text-skin-link hover:bg-skin-bg'}`}
          key={item.value}
        >
          {item.label}
        </div>
      </Link>
    );
  });

  return (
    <div id="sidebar-left" className="float-left w-full lg:w-1/4">
      <div className="fixed hidden hidden w-[240px] lg:block lg:block">
        <div className="overflow-hidden border-y border-skin-border bg-skin-block-bg text-base md:rounded-xl md:border">
          <div className="leading-5 sm:leading-6">
            <div className="py-3">{timelineButtons}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimelineSidebar;
