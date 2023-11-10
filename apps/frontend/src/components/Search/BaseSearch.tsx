import React, { useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
import { SearchIcon } from 'icons/Search';
import { ModalCloseIcon } from 'icons/ModalClose';
import { string, boolean } from 'yup';

export default function SearchBar(props) {
  return (
    <>
      <div className="">
        <SearchIcon />
        <input
          placeholder="placeholder"
          type="text"
          autoCorrect="off"
          autoCapitalize="none"
          className="input w-full flex-auto border-none"
          onChange={props.handleInput}
        />
        <a onClick={props.clearInput}>
          <ModalCloseIcon v-if="modelValue" />
        </a>
      </div>
    </>
  );
}
