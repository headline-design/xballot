import React, { useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Logo } from 'components/Logo';
import { FeedIcon } from 'icons/Feed';
import { PlusIcon } from 'icons/Plus';
import { ButtonRounded } from '../BaseComponents/ButtonRounded';
import SortableGrid from 'components/DraggableSpace/App';
import { useSortableGrid } from './useSortableGrid';
import { SidebarNavLoader } from 'components/Loaders/SidebarLoader';

const Sidebar = ({ className, showSidebar, loading }) => {
  const { sortableGridProps } = useSortableGrid({ showSidebar });
  const MemoizedSortableGrid = React.memo(SortableGrid);
  const MemoizedSidebarNavLoader = React.memo(SidebarNavLoader);

  const containerClasses = useMemo(
    () =>
      clsx(
        'no-scrollbar flex h-full flex-col items-end overflow-auto overscroll-contain py-2',
        className,
      ),
    [className],
  );

  const handleShowSidebar = useCallback(() => {
    showSidebar();
  }, [showSidebar]);

  return (
    <div className={containerClasses}>
      <div className="relative flex items-center px-2">
        <Link to={'/'}>
          <ButtonRounded onClick={handleShowSidebar} className="!border-0">
            <Logo width={'32px'} height={'32px'} />
          </ButtonRounded>
        </Link>
      </div>
      <div className="mt-2 px-2">
        <Link to={'/timeline/feed=joined'}>
          <ButtonRounded onClick={handleShowSidebar}>
            <FeedIcon />
          </ButtonRounded>
        </Link>
      </div>
      {loading && <MemoizedSidebarNavLoader />}
      {!loading && <MemoizedSortableGrid showSidebar={showSidebar} {...sortableGridProps} />}
      <div className="mt-2 px-2">
      <Link to={'/setup/step=0'}>
        <ButtonRounded onClick={handleShowSidebar}>
            <PlusIcon />
        </ButtonRounded>
        </Link>
      </div>
    </div>
  );
};

export default React.memo(Sidebar);
