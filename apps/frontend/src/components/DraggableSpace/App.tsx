import React, { useEffect, useRef, useCallback } from 'react';
import useState from 'react-usestateref';
import Sortable from 'sortablejs';
import { NavLink } from 'react-router-dom';
import { ButtonRounded } from '../BaseComponents/ButtonRounded';
import Tooltip from '../Tooltip/SidebarTooltip';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { updateMySpaces } from '../../redux/global/global';
import { throttle } from 'lodash';

interface NavLinkWithTooltipProps {
  _id: string;
  content: string;
  domain: string;
  type: string;
  showSidebar: boolean;
}

// New component for NavLink
const NavLinkWithTooltip = React.memo(
  ({ _id, content, domain, type, showSidebar }: NavLinkWithTooltipProps) => {
    const navLinkClasses = useCallback(
      ({ isActive }) => (isActive ? 'active-sb-link mt-2 px-2' : 'sb-link mt-2 px-2'),
      [],
    );

    const tooltipContent = (
      <div className="grid-square">
        <NavLink
          to={type === 'profile' ? `/profile/${domain}/feed` : `/${domain}`}
          className={navLinkClasses}
        >
          {({ isActive }) => (
            <>
              <div
                className={
                  isActive
                    ? 'absolute left-[-4px] !h-[20px] h-[8px] w-[8px] rounded-full bg-skin-link transition-all duration-300 group-hover:bg-skin-link'
                    : 'absolute left-[-4px] h-[10px] w-[8px] rounded-full transition-all duration-300 group-hover:h-[10px] group-hover:bg-skin-link '
                }
              />
              <ButtonRounded onClick={showSidebar}>
                <img
                  className="rounded-full bg-skin-border object-cover"
                  src={content}
                  alt={domain}
                  style={{ width: 44, height: 44, minWidth: 44 }}
                />
              </ButtonRounded>
            </>
          )}
        </NavLink>
      </div>
    );

    return (
      <div key={_id} data-id={_id}>
        <Tooltip label={domain} content={tooltipContent} />
      </div>
    );
  },
);

const SortableGrid = ({ showSidebar }) => {
  const dispatch = useAppDispatch();
  const { mySpaces: reduxSpaces } = useAppSelector((state) => state.global);
  const gridRef = useRef<HTMLInputElement>(null);
  const sortableJsRef = useRef<HTMLInputElement>(null);
  const [mySpaces, setMySpaces, mySpacesRef] = useState(reduxSpaces);

  useEffect(() => {
    if (reduxSpaces?.length > 0) {
      setMySpaces(reduxSpaces);
    }
  }, [reduxSpaces, setMySpaces]);

  const onListChange = throttle((event) => {
    const newData = [...gridRef.current.children].map((i: HTMLElement) =>
      mySpacesRef.current.find((item) => item._id === parseInt(i.dataset.id)),
    );
    dispatch(updateMySpaces(newData));
  }, 300);

  useEffect(() => {
    const sortable = new Sortable(gridRef.current, {
      animation: 150,
      group: 'answers',
      onEnd: onListChange,
    });
    sortableJsRef.current = sortable;
    return () => {
      sortable.destroy();
      onListChange.cancel(); // important to cancel the throttled function
    };
  }, [onListChange]);

  return (
    <div ref={gridRef} id="gridDemo">
      {mySpaces?.map((space, i) => (
        <NavLinkWithTooltip key={i} {...space} showSidebar={showSidebar} />
      ))}
    </div>
  );
};

export default SortableGrid;
