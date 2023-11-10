import { useState, useMemo } from 'react';

export function useIntl() {
  const getRelativeTimeFormatter = (options) =>
    new Intl.RelativeTimeFormat('en', options || { style: 'short', numeric: 'always' });

  const getNumberFormatter = (options) =>
    new Intl.NumberFormat('en', options || { notation: 'standard' });

  const defaultRelativeTimeFormatter = useMemo(() => getRelativeTimeFormatter({}), []);

  const longRelativeTimeFormatter = useMemo(
    () =>
      getRelativeTimeFormatter({
        style: 'long',
        numeric: 'always',
      }),
    [],
  );

  const defaultNumberFormatter = useMemo(
    () => getNumberFormatter({ maximumFractionDigits: 2 }),
    [],
  );
  const compactNumberFormatter = useMemo(
    () =>
      getNumberFormatter({
        notation: 'compact',
        compactDisplay: 'short',
      }),
    [],
  );
  const percentNumberFormatter = useMemo(
    () =>
      getNumberFormatter({
        style: 'percent',
        maximumFractionDigits: 2,
      }),
    [],
  );

  const formatRelativeTime = (timestamp, formatter) => {
    const relativeTo = new Date().getTime() / 1e3;

    const { duration, unit } = getDurationAndUnit(timestamp - relativeTo);

    formatter = formatter || defaultRelativeTimeFormatter;

    return formatter.format(duration, unit);
  };

  const formatDuration = (seconds) => {
    const { duration, unit } = getDurationAndUnit(seconds);

    return `${duration} ${unit}${duration !== 1 ? 's' : ''}`;
  };

  const formatNumber = (number, formatter) => {
    formatter = formatter || defaultNumberFormatter;

    return formatter.format(number);
  };

  const formatCompactNumber = (number) => formatNumber(number, compactNumberFormatter);
  const formatPercentNumber = (number) => formatNumber(number, percentNumberFormatter);

  const getRelativeProposalPeriod = (state, start, end) => {
    if (state === 'closed' || state === 'final') {
      return `Ended ${formatRelativeTime(end, longRelativeTimeFormatter)}`;
    }
    if (state === 'active') {
      return `Ends ${formatRelativeTime(end, longRelativeTimeFormatter)}`;
    }
    return `Starts ${formatRelativeTime(start, longRelativeTimeFormatter)}`;
  };

  return {
    formatRelativeTime,
    formatDuration,
    formatNumber,
    formatCompactNumber,
    formatPercentNumber,
    getRelativeProposalPeriod,
    longRelativeTimeFormatter,
  };
}

const getDurationAndUnit = (seconds) => {
  let unit = 'second';
  let duration = seconds;
  const abs = Math.abs(seconds);

  if (abs >= 60) {
    unit = 'minute';
    duration = duration / 60;
    if (abs >= 60 * 60) {
      unit = 'hour';
      duration = duration / 60;
      if (abs >= 60 * 60 * 24) {
        unit = 'day';
        duration = duration / 24;
        if (abs >= 60 * 60 * 24 * 365) {
          unit = 'year';
          duration = duration / 365;
        } else if (abs >= 60 * 60 * 24 * 30) {
          unit = 'month';
          duration = duration / 30;
        } else if (abs >= 60 * 60 * 24 * 7) {
          unit = 'week';
          duration = duration / 7;
        }
      }
    }
  }

  duration = Math.round(duration);

  return { duration, unit };
};
