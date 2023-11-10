import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const [isChanging, setIsChanging] = useState(false);

  function CounterUnit({ current, next }) {
    return (
      <div className={`Counter-unit ${isChanging ? 'is-changing' : ''}`}>
        <div className="Counter-number" data-js="current">
          {current}
        </div>
        <div className="Counter-number" data-js="next">
          {next}
        </div>
      </div>
    );
  }

  function updateCounter(value, el) {
    const current = el.querySelector('[data-js="current"]');
    const next = el.querySelector('[data-js="next"]');
    let timeout;

    if (count === value) {
      return;
    }

    setIsChanging(true);
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      current.innerHTML = next.innerHTML;
      setIsChanging(false);
    }, 210);

    next.innerHTML = value;
    setCount(value);
  }

  function increment() {
    let newCount = count + 1;

    if (newCount > 99) {
      newCount = 0;
    }

    const tens = Math.floor(newCount / 10);
    const ones = newCount % 10;

    updateCounter(tens, document.querySelector('[data-js="counter-tens"]'));
    updateCounter(ones, document.querySelector('[data-js="counter-ones"]'));
  }

  return (
    <div className="counter-container">
      <div className="Counter">
        <CounterUnit current={0} next={0} data-js="counter-tens" />
        <CounterUnit current={0} next={0} data-js="counter-ones" />
        <button onClick={increment}>Increment</button>
      </div>
    </div>
  );
}

export default Counter;
