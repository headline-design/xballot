import React, {
  Fragment,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useContext,
} from 'react';
import { Modal } from 'components/BaseComponents/Modal';
import { Button } from 'components/BaseComponents/Button';
import BaseCalendar from './BaseCalendar';

type Props = {
  open: boolean;
  value?: number;
  type?: string;
};

const options = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};

function ModalSelectDate(props) {
  const {
    value,
    type,
    delay,
    date,
    dateString,
    upStreamStart,
    upStreamDateStart,
    upStreamDateEnd,
    upStreamEnd,
  } = props;
  const [step, setStep] = useState(0);
  const [input, setInput] = useState('');
  const [time, setTime] = useState('12:00');
  const [inputValue, setInputValue] = useState('');
  const [data, setData] = useState('');
  const handleInputValue = (value) => {
    setInputValue(value);
  };

  function formatDate(date) {
    const output = { h: '12', m: '00', dateString: '' };
    if (!date) return output;
    const dateObject = new Date(date * 1000);
    const offset = dateObject.getTimezoneOffset();
    const data = new Date(dateObject.getTime() - offset * 60 * 1000);
    output.dateString = data.toISOString().split('T')[0];
    output.h = `0${dateObject.getHours().toString()}`.slice(-2);
    output.m = `0${dateObject.getMinutes().toString()}`.slice(-2);
    return output;
  }

  const [open, setOpen] = React.useState(false);
  let [isOpen, setIsOpen] = useState(false);
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  useEffect(() => {
    setStep(0);
    if (!value) return;
    const { dateString, h, m } = formatDate(value);
    setTime(`${h}:${m}`);
    setInput(dateString);
  }, [open, value]);

  const handleSubmit = async () => {
    if (step === 0) return setStep(1);
    const dateString = `${inputValue} ${time}:00`;
    const timestamp = new Date(dateString).getTime() / 1000;
    props.onSelect(timestamp);
    const dateStamp = new Date(dateString).toLocaleDateString('en-US', options).replace('at', '');

    if (props.label === 'Start') {
      upStreamStart(timestamp);
      upStreamDateStart(dateStamp);
    } else {
      upStreamEnd(timestamp);
      upStreamDateEnd(dateStamp);
    }
    props.callBack(false);
    console.log(timestamp);
    console.log(dateStamp);
  };

  return (
    <>
      <Modal
        onClose={() => {
          props.callBack(false);
        }}
        open={props.isOpen}
        title={
          step === 0
            ? type === 'start'
              ? 'Select start date'
              : 'Select end date'
            : type === 'start'
            ? 'Select start date'
            : 'Select end date'
        }
      >
        <div className="modal-body">
          <div className="">
            {step === 0 && (
              <div className="m-4">
                <BaseCalendar value={input} handleToggleDay={handleInputValue} />
              </div>
            )}
            {step === 1 && (
              <div className="m-4 mx-auto max-w-[140px]">
                <input
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  type="time"
                  className="s-input form-input text-center text-lg"
                />
              </div>
            )}
          </div>
        </div>
        <div className="border-t p-4 text-center">
          <div className="float-left w-2/4 pr-2">
            <Button
              className="button w-full px-[22px]"
              type="button"
              onClick={() => {
                props.callBack(false);
              }}
            >
              {'Cancel'}
            </Button>
          </div>
          <div className="float-left w-2/4 pl-2">
            <Button
              type="submit"
              disabled={!inputValue}
              className="button button--primary w-full px-[22px] hover:brightness-95"
              primary
              onClick={handleSubmit}
              data-v-4a6956ba=""
            >
              {step === 0 ? 'next' : 'select'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ModalSelectDate;
