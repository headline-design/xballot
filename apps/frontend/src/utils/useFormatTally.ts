// customHooks/useFormattedTally.js
import { useFormatCompactNumber } from 'utils/useFormatCompactNumber';

export const useFormattedTally = (tally, decimals) => {
  const formattedNumber = useFormatCompactNumber(tally / Math.pow(10, decimals));
  return formattedNumber;
};
