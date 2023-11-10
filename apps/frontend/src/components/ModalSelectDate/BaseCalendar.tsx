import React, { useState, useEffect, useMemo, useCallback } from 'react';

const BaseCalendar = ({ value, handleToggleDay }) => {
  const [
    yearNow = new Date().getFullYear(),
    monthNow = new Date().getMonth(),
    // dayNow = new Date().getDate()
  ] = value ? value.split('-') : [];
  const [modelValue, setModelValue] = useState('');
  const handleUpdate = (value) => {
    setModelValue(value);
  };

  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [today, setToday] = useState(new Date().toLocaleDateString());
  const [input, setInput] = useState([]);
  const [dateValue, setDateValue] = useState([]);

  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
    new Date(year, month),
  );
  const [activeDate, setActiveDate] = useState(new Date().toLocaleDateString());
  const daysOfWeek = useMemo(() => {
    const sunday = new Date(2017, 0, 0);
    return [...Array(7)].map(() => {
      sunday.setDate(sunday.getDate() + 1);
      return sunday.toLocaleDateString('en-US', {
        weekday: 'short',
      });
    });
  }, []);

  const numberOfDays = new Date(year, month + 1, 0).getDate();

  const firstDayOfMonth = new Date(year, month).getDay();

  const emptyDays = new Date(year, month, 1).getDay();

  const days = Object.values(Array.from({ length: numberOfDays }, (_, i) => i + 1));
  const formatDate = (year, month, day) => {
    return new Date(year, month, day).toLocaleDateString();
  };

  const toggleDay = (year, month, day) => {
    const date = new Date(year, month, day).toLocaleDateString();
    setActiveDate(date);
    const newInputValue = formatDate(year, month, day);
    toggleDay(newInputValue);
    const index = input.indexOf(date);
    setModelValue(input.value);
    handleUpdate(modelValue);

    console.log(newInputValue);
    if (index === -1) {
      setInput([...input, date]);
      setActiveDate(date);
    } else {
      const newInput = [...input];
      newInput.splice(index, 1);
      setInput(newInput);
    }
  };

  const handleToggle = (year, month, day) => {
    const date = new Date(year, month, day).toLocaleDateString();
    setActiveDate(date);
    const newInputValue = formatDate(year, month, day);
    handleToggleDay(newInputValue);
    const index = input.indexOf(date);
    console.log(newInputValue);
    if (index === -1) {
      setInput([...input, date]);
      setActiveDate(date);
    } else {
      const newInput = [...input];
      newInput.splice(index, 1);
      setInput(newInput);
    }
  };

  function isSelectable(year, month, day) {
    const date = new Date(year, month, day);
    const dateNow = new Date().setHours(0, 0, 0, 0);
    return !(dateNow - Number(date) > 0);
  }

  return (
    <div data-v-42c369df="" className="calendar mx-auto mb-2">
      <div className="mb-2 flex items-center" data-v-42c369df="">
        <div className="w-1/4 text-left" data-v-42c369df="">
          <a
            className="iconfont iconback text-lg font-semibold text-skin-text"
            onClick={() => setMonth(month - 1)}
          />
        </div>
        <h4 className="h-full w-full text-center">
          {monthName} {year}
        </h4>
        <div className="w-1/4 text-right">
          <a
            className="iconfont icongo text-lg font-semibold text-skin-text"
            onClick={() => setMonth(month + 1)}
          />
        </div>
      </div>
      <div data-v-42c369df="" className="overflow-hidden border-l border-t">
        {daysOfWeek.map((dayOfWeek) => (
          <div key={dayOfWeek} data-v-438f1e50="" className="day border-b border-r text-skin-link">
            {dayOfWeek}
          </div>
        ))}
        {[...Array(emptyDays)].map((_, i) => (
          <div key={`empty-${i}`} data-v-438f1e50="" className="day border-b border-r"></div>
        ))}
        {days.map((day, index) => (
          <div data-v-438f1e50="" key={index}>
            {isSelectable(year, month, day) ? (
              <a
                value={day}
                data-v-438f1e50=""
                className={`day border-b border-r bg-transparent text-skin-link hover:bg-skin-link hover:text-skin-bg ${
                  formatDate(year, month, day) === today ? 'ring-1 ring-inset ring-primary' : ''
                } ${
                  activeDate === formatDate(year, month, day) ? '!bg-skin-link text-skin-bg' : ''
                }`}
                onClick={() => handleToggle(year, month, day)}
              >
                {day}
              </a>
            ) : (
              <div
                data-v-438f1e50=""
                className="day cursor-not-allowed border-b border-r text-skin-border"
              >
                {day}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BaseCalendar;
