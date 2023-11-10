import { useEffect, useState } from 'react';

export function useDebouncedValue<T>(input: T, time = 1000) {
  const [debouncedValue, setDebouncedValue] = useState(input);

  // every time input value has changed - set interval before it's actually committed
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(input);
    }, time);

    return () => {
      clearTimeout(timeout);
    };
  }, [input, time]);

  return debouncedValue;
}
