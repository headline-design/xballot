import React, { useState, useCallback, useContext } from 'react';
import LabelInput from 'components/BaseComponents/BaseLabel/BaseLabel';
import { Button } from 'components/BaseComponents/Button';
import ModalSelectDate from 'components/ModalSelectDate';

function InputDate({
  label,
  onUpdateDate,
  type,
  information,
  disabled,
  date,
  dateString,
  streamValue,
  upStreamStart,
  upStreamStartDate,
  upStreamEnd,
  upStreamEndDate,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [upStreamStarter, setUpStreamStarter] = useState();
  const [upStreamEnder, setUpStreamEnder] = useState();
  const [upStreamDateStarter, setUpStreamDateStarter] = useState();
  const [upStreamDateEnder, setUpStreamDateEnder] = useState();

  const handleClick = useCallback(() => {
    if (!disabled) {
      setIsOpen(true);
    }
  }, [disabled]);

  function handleUpStreamStart(timestamp) {
    setUpStreamStarter(timestamp);
    upStreamStart(timestamp);
  }

  function handleUpStreamStartDate(dateStamp) {
    setUpStreamDateStarter(dateStamp);
    upStreamStartDate(dateStamp);
  }

  function handleUpStreamEnd(timestamp) {
    setUpStreamEnder(timestamp);
    upStreamEnd(timestamp);
  }

  function handleUpStreamEndDate(dateStamp) {
    setUpStreamDateEnder(dateStamp);
    upStreamEndDate(dateStamp);
  }

  return (
    <>
      <div className="w-full">
        {label && <LabelInput information={information}>{label}</LabelInput>}
        <Button
          type="button"
          data-v-4a6956bx=""
          className={`button relative inset-y-0 flex !h-[42px] w-full cursor-pointer items-center truncate px-[22px] pl-[44px] pr-3 text-left ${
            disabled ? 'cursor-not-allowed' : 'cursor-pointer'
          }`}
          onClick={handleClick}
        >
          <span className="w-full text-left text-skin-text">{streamValue}</span>
          <svg
            viewBox="0 0 24 24"
            width="1.2em"
            height="1.2em"
            className="absolute left-[16px] -mt-[1px] text-sm text-skin-text"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"
            />
          </svg>
        </Button>
        {isOpen ? (
          <ModalSelectDate
            label={label}
            type={type}
            dateString={dateString}
            value={date}
            onChange={onUpdateDate}
            onSelect={onUpdateDate}
            isOpen={isOpen}
            onClose={!isOpen}
            upStreamStart={handleUpStreamStart}
            upStreamDateStart={handleUpStreamStartDate}
            upStreamEnd={handleUpStreamEnd}
            upStreamDateEnd={handleUpStreamEndDate}
            callBack={function (setting) {
              setIsOpen(setting);
            }}
          />
        ) : null}
      </div>
    </>
  );
}

export default InputDate;
