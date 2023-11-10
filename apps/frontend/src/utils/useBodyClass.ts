import { useEffect } from 'react';

export const useBodyClass = (className: string, condition: boolean) => {
  useEffect(() => {
    if (condition) {
      document.body.classList.add(className);
    } else {
      document.body.classList.remove(className);
    }

    return () => {
      document.body.classList.remove(className);
    };
  }, [className, condition]);
};


export default useBodyClass;
