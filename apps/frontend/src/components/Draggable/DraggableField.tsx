import { PlusIcon } from 'icons/Plus';
import React, { useState } from 'react';
import { DraggableDots } from 'icons/DraggableDots';
import { WarningIcon } from 'icons/Warning';

interface DraggableFieldProps {
  choice: any; // Define the proper type for this
  handleChange: (value: string, type: string, index: number) => void;
  data?: {
    value?: string;
  };
}

const DraggableField = ({ choice, handleChange, data = {} }: DraggableFieldProps) => {
  const [inputValue, setInputValue] = useState(data?.value || '');

  const handleInputChange = (event) => {
    if (event.target.value.length <= 32) {
      setInputValue(event.target.value);
      handleChange(event.target.value, 'value', choice - 1);
    }
  };

  return (
    <>
      <div className="relative z-10 flex w-full rounded-3xl border border-skin-border bg-skin-bg px-3 text-left leading-[42px] outline-none transition-colors focus-within:border-skin-text">
        <div className="mr-2 whitespace-nowrap text-skin-text">
          <div className="drag-handle flex cursor-grab items-center active:cursor-grabbing">
            <DraggableDots />
            Choice {choice}
          </div>
        </div>
        <input
          placeholder=""
          type="text"
          className="input w-full flex-auto"
          value={inputValue}
          onChange={handleInputChange}
          maxLength={32}
        />
        <span className="hidden text-xs text-skin-text group-focus-within:block">
          {inputValue.length}/32
        </span>
      </div>
      <div className="s-error relative z-0 -mt-[48px] opacity-0">
        <WarningIcon />{' '}
      </div>
    </>
  );
};

export default DraggableField;
