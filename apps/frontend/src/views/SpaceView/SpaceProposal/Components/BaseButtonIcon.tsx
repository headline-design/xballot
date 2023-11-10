import React from 'react';
import { LoadingSpinner } from 'components/Loaders/LoadingSpinner';

const BaseButtonIcon = ({ loading, children, className, onClick }) => {
  return (
    <button
    onClick={onClick}
      className={
        className &&
        'flex items-center rounded-full p-[6px] text-md text-skin-text transition-colors duration-200 hover:text-skin-link'
      }
    >
      {loading ? <LoadingSpinner /> : children}
    </button>
  );
};

export default BaseButtonIcon;
