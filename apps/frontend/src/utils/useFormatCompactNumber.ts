import { useMemo } from 'react';

// Format a number using the compactNumberFormatter
export const useFormatCompactNumber = (number: number) => {
  // Define the getNumberFormatter function, which returns a memoized Intl.NumberFormat instance
  const useGetNumberFormatter = (options?: Intl.NumberFormatOptions) =>
    useMemo(() => new Intl.NumberFormat('en', options || { notation: 'standard' }), [options]);

  // Define default and compact number formatters
  const defaultNumberFormatter = useGetNumberFormatter({ maximumFractionDigits: 2 });
  const compactNumberFormatter = useGetNumberFormatter({
    notation: 'compact',
    compactDisplay: 'short',
  });

  // Format a number with the given formatter (or default to the defaultNumberFormatter)
  const formatNumber = (number: number, formatter?: Intl.NumberFormat) => {
    formatter = formatter || defaultNumberFormatter;

    return formatter.format(number);
  };
  return formatNumber(number, compactNumberFormatter);
};
 