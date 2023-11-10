import localStore from 'store';
import { MY_SPACES_KEY } from 'utils/constants/common';
import { OptedCheck } from 'components/OptButton/OptedCheck';
import { useState, useEffect, useMemo, useRef } from 'react';
import _ from 'lodash';

const useOptContent = (applicationId, joinLabel, joinedLabel, leaveLabel) => {
  const [opted, setOpted] = useState(false);
  const previousMySpaces = useRef();

  useEffect(() => {
    const mySpaces = localStore.get(MY_SPACES_KEY);

    // Check if the mySpaces have really changed (ignoring the order)
    if (!previousMySpaces.current || !_.isEqual(previousMySpaces.current.sort(), mySpaces.sort())) {
      previousMySpaces.current = mySpaces;
      const index = mySpaces.find((space) => Number(space?.appId) === Number(applicationId));
      setOpted(index?.appId ? true : false);
    }
  }, [applicationId]);

  const optedContent = useMemo(() => {
    if (opted) {
      return (
        <>
          <span className="">
            <span className="flex items-center gap-2 group-hover:hidden">
              <OptedCheck />
              {joinedLabel}
            </span>
            <span className="hidden group-hover:block">{leaveLabel}</span>
          </span>
        </>
      );
    } else {
      return <span className="flex items-center justify-center">{joinLabel}</span>;
    }
  }, [opted, joinLabel, joinedLabel, leaveLabel]);

  return optedContent;
};

export default useOptContent;
