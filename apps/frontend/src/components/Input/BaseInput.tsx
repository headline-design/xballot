import React, { useState } from 'react';
import { WarningIcon } from 'icons/Warning';

const Input = ({type, name, title, value, onChange, placeholder, maxLength }) => {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="group w-full rounded-3xl">
        <span className="mb-[2px] flex items-center gap-1 text-skin-text">{title}</span>
        <div className="relative z-10 flex w-full rounded-3xl border border-skin-border bg-skin-bg px-3 text-left leading-[42px] outline-none transition-colors focus-within:border-skin-text">
          <input
            className="input w-full flex-auto"
            type={type}
            name={name}
            value={value}
            onChange={(e) => {
              setCount(e.target.value.length);
              onChange(e);
            }}
            placeholder={placeholder}
            maxLength={maxLength}
          />
          <span className="hidden text-xs text-skin-text group-focus-within:block">
            {count + '/' + maxLength}
          </span>
        </div>
        <div className="s-error relative z-0 -mt-[48px] opacity-0">
        <WarningIcon  />
        </div>
      </div>
    </>
  );
};

export default Input;
