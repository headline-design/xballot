import React, { useRef, useEffect } from 'react';
import { SearchIcon } from 'icons/Search';
import { XIcon } from 'icons/XIcon';
import { LoadingSpinner } from 'components/Loaders/LoadingSpinner';

interface BaseInputProps {
  value: string;
  placeholder?: string;
  modal?: boolean;
  focusOnMount?: boolean;
  loading?: boolean;
  onChange?: (value: string) => void;
  clearUrl?: boolean;
  onClearUrl?: () => void;
}

const BaseSearch: React.FC<BaseInputProps> = ({
  value,
  placeholder,
  modal,
  focusOnMount,
  loading,
  onChange,
  clearUrl,
  onClearUrl,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusOnMount && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focusOnMount]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const clearInput = () => {
    onChange?.('');
    if (clearUrl && onClearUrl) {
      onClearUrl();
    }
  };

  return (
    <div className={`flex items-center w-full ${modal ? 'border-b bg-skin-bg py-3 pl-4' : ''}`}>
      <SearchIcon />
      <input
        ref={inputRef}
        value={value}
        placeholder={placeholder}
        type="text"
        autoCorrect="off"
        autoCapitalize="none"
        className="input w-full border-none"
        onChange={handleInputChange}
      />
      {loading ? (
        <div className="loading pr-2">
          <LoadingSpinner />
        </div>
      ) : (
        value && (
          <button onClick={clearInput}>
            <XIcon
              className="mr-2 flex-shrink-0 cursor-pointer text-[16px]"
              width="1.2em"
              height="1.2em"
            />
          </button>
        )
      )}
    </div>
  );
};

export default BaseSearch;
