import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import moment from 'moment';
import { getRound } from 'orderFunctions';
import { staticValues } from './endPoints';

export const unixTimestampTwoWeeksAgo = Number(
  (new Date().getTime() / 1000 - 604800 * 2).toFixed(0),
);

export function unixToDate(unix: number, format = 'YYYY-MM-DD'): string {
  return dayjs.unix(unix).format(format);
}

export async function roundToUnix(space) {
  let current = await getRound();
  let optedRound = space?.optedRound;
  let optedTime = current - optedRound;
  let secondsTime = optedTime * staticValues.roundTime * 1000;
  let momentTime = moment.now() - secondsTime;
  let unixTime = moment(momentTime).unix();

  console.log('unixTime', unixTime);

  return unixTime;
}

dayjs.extend(utc);
dayjs.extend(timezone);

export function unixFullDate(
  unix: number,
  format = 'MMM D, YYYY, h:mm A',
  timeZone: string = 'UTC',
): string {
  return dayjs.unix(unix).tz(timeZone).format(format);
}

export const formatTime = (unix: string) => {
  const now = dayjs();
  const timestamp = dayjs.unix(parseInt(unix));

  const inSeconds = now.diff(timestamp, 'second');
  const inMinutes = now.diff(timestamp, 'minute');
  const inHours = now.diff(timestamp, 'hour');
  const inDays = now.diff(timestamp, 'day');

  if (inHours >= 24) {
    return `${inDays} ${inDays === 1 ? 'day' : 'days'} ago`;
  } else if (inMinutes >= 60) {
    return `${inHours} ${inHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (inSeconds >= 60) {
    return `${inMinutes} ${inMinutes === 1 ? 'minute' : 'minutes'} ago`;
  } else {
    return `${inSeconds} ${inSeconds === 1 ? 'second' : 'seconds'} ago`;
  }
};
