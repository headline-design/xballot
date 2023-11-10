import React from 'react';
import LabelInput from 'components/BaseComponents/BaseLabel';
import { Button } from 'components/BaseComponents/Button';
import { ChevronDown } from 'icons/ChevronDown';

const InputSelect = ({
  modelValue,
  title,
  information,
  isDisabled = false,
  tooltip = null,
  className,
  onSelect,
}) => {
  const handleClick = () => {
    if (!isDisabled) {
      onSelect();
    }
  };

  // Add the necessary logic to display the tooltip using your preferred tooltip library

  return (
    <div className="w-full">
      <LabelInput information={information}>{title}</LabelInput>
      <Button
        className={`${
          className || ''
        } relative !h-[42px] w-full truncate pl-3 pr-5 text-left ${
          isDisabled ? 'cursor-not-allowed !border-skin-border' : ''
        }`}
        disabled={isDisabled}
        onClick={handleClick}
      >
        <span className={`${isDisabled ? 'text-skin-text' : ''}`}>
          {modelValue}
        </span>
        <ChevronDown className="absolute inset-y-[12px] right-[14px] text-xs text-skin-text" />
      </Button>
    </div>
  );
};

export default InputSelect;
