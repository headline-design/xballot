import { MutableRefObject, useEffect } from 'react';

/**
 * Hook that alerts clicks outside of the passed ref
 */
export const useOutsideDetector = (refs: Array<MutableRefObject<any>>, callback) => {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (refs) {
        let clickArr = [];
        for (let i = 0; i < refs.length; ++i) {
          const ref = refs[i];
          if (ref.current && !ref.current.contains(event.target)) {
            clickArr.push(true); // Clicked outside
          } else {
            clickArr.push(false); // Clicked inside
          }
        }
        if (!clickArr.includes(false)) {
          // There was an outside click. Callback function gets called.
          callback();
        }
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [refs]);
};
