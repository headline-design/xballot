import InputDate from 'components/InputDate';
import { useState, useEffect, useMemo, useContext, useCallback } from 'react';
import { getRound } from 'orderFunctions';
import { staticValues } from 'utils/endPoints';

const options = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};

export function SpaceCreateVotingDateEnd({ upStreamEnd, disabled, handleClick, onMaxRound }) {
  const [isOpen, setIsOpen] = useState(false);
  const [upStreamEnder, setUpStreamEnder] = useState();
  const dateString =
    Math.round(upStreamEnd / 10) === Math.round(Number((Date.now() / 1e3).toFixed()) / 10)
      ? 'Now'
      : new Date(upStreamEnder * 1000).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
  const [date, setDate] = useState(upStreamEnder || 'Now');
  const [endDate, setEndDate] = useState();

  useEffect(() => {
    setDate(upStreamEnder);
  }, [upStreamEnder]);

  const today = new Date();
  const threeDaysFromNow = new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000));

  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };

  const formattedDate = threeDaysFromNow.toLocaleDateString('en-US', options);
  //console.log(formattedDate);

  async function handleSelect(timestamp) {
    let round = await unixToRound(timestamp);
    localStorage.setItem('endRound', round);
    localStorage.setItem('endDate', timestamp);
    setUpStreamEnder(timestamp);
    upStreamEnd(timestamp);
    //console.log(timestamp);
  }

  async function handleUpStreamEndDate(dateStamp) {
    setEndDate(dateStamp);
    //console.log(dateStamp);
  }

  async function unixToRound(unix) {
    let roundRange = (unix - Date.now() / 1000) / staticValues.roundTime;

    let current = await getRound();
    //console.log(current)
    let endRound = current + roundRange;
    localStorage.setItem('endRound', date);
    onMaxRound(endRound.toFixed(0)); // Pass the maxRound value to the callback
    return endRound.toFixed(0);
  }

  return (
    <InputDate
      label="End"
      type="End"
      information=""
      disabled={disabled}
      date={upStreamEnder}
      dateString={dateString}
      upStreamStart={undefined}
      upStreamStartDate={undefined}
      upStreamEnd={handleSelect}
      upStreamEndDate={handleUpStreamEndDate}
      onUpdateDate={handleSelect}
      streamValue={endDate || formattedDate}
      onSelect={handleClick}
      handleClick={handleClick}
      callBack={function (setting) {
        setIsOpen(setting);
      }}
      value={upStreamEnder}
      onChange={handleSelect}
      isOpen={isOpen}
      onClose={!isOpen}
    />
  );
}
