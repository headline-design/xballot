import React from 'react';
import { SearchIcon } from 'icons/Search';
import { ModalCloseIcon } from 'icons/ModalClose';

function ModalSearch({ value, onChange, placeholder, clearInput, className }) {
  return (
    <>
      <div className={className}>
        <SearchIcon />
        <input
          autoCorrect="off"
          autoCapitalize="none"
          className="input w-full flex-auto border-none"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          type="text"
        />
        {value && (
          <button onClick={clearInput}>
            <ModalCloseIcon />
          </button>
        )}
      </div>
    </>
  );
}

export default ModalSearch;
