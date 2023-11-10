import InputDate from 'components/InputDate';
import { useState, useMemo, useCallback } from 'react';
import { getRound } from 'orderFunctions';
import { staticValues } from 'utils/endPoints';

const options: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};

export function SpaceCreateVotingDateStart({ upStreamStart }) {
  const [upStreamStarter, setUpStreamStarter] = useState<any>();
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState();

  const dateString = useMemo(() => {
    return Math.round(upStreamStarter / 10) === Math.round(Number((Date.now() / 1e3).toFixed()) / 10)
      ? 'Now'
      : new Date(upStreamStarter * 1000).toLocaleDateString('en-US', options);
  }, [upStreamStarter]);

  const handleSelect = useCallback(async (timestamp) => {
    setStartDate(timestamp);
    const round = await unixToRound(timestamp);
    localStorage.setItem('startRound', round);
    localStorage.setItem('startDate', timestamp);
    setUpStreamStarter(timestamp);
    upStreamStart(timestamp);
  }, [upStreamStart]);

  //console.log(upStreamStart)

  const unixToRound = useMemo(() => {
    return async (unix) => {
      const roundRange = (unix - Date.now() / 1000) / staticValues.roundTime;
      const current = await getRound();
      const startRound = current + roundRange;
      localStorage.setItem('startRound', upStreamStarter);
      return startRound.toFixed(0);
    };
  }, [upStreamStarter]);



  return (
    <InputDate
      label="Start"
      type="start"
      information=""
      disabled={false}
      date={upStreamStarter}
      dateString={dateString}
      upStreamStart={handleSelect}
      upStreamStartDate={setStartDate}
      onUpdateDate={handleSelect}
      streamValue={startDate || 'Now'}
      onSelect={handleSelect}
      handleClick={handleSelect}
      callBack={setIsOpen}
      value={upStreamStarter}
      onChange={handleSelect}
      isOpen={isOpen}
      onClose={!isOpen}
    />
  );
}
