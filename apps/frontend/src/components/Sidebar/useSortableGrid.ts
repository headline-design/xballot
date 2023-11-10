import { useState, useEffect, useCallback } from 'react';
import SortableGrid from 'components/DraggableSpace/App';

export const useSortableGrid = ({ showSidebar }) => {
  const [sortableGridProps, setSortableGridProps] = useState({});

  const handleWindowResize = useCallback(() => {
    if (showSidebar) {
      setSortableGridProps({
        containerProps: { style: { marginLeft: '72px' } },
        gridProps: { style: { width: 'calc(100% - 72px)' } },
      });
    } else {
      setSortableGridProps({
        containerProps: { style: { marginLeft: '0px' } },
        gridProps: { style: { width: '100%' } },
      });
    }
  }, [showSidebar]);

  useEffect(() => {
    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [handleWindowResize]);

  return { sortableGridProps, SortableGrid };
};
