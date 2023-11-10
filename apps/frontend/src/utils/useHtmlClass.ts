import { useEffect } from 'react';

export const useHtmlClass = (className: string, condition: boolean) => {
  useEffect(() => {
    if (condition) {
        document.documentElement.classList.add(className);
    } else {
        document.documentElement.classList.remove(className);
    }

    return () => {
        document.documentElement.classList.remove(className);
    };
  }, [className, condition]);
};


export default useHtmlClass;
