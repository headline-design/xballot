import React from 'react';

const BasePill = (props) => {
  return (
    <span className="rounded-full bg-skin-text px-2 text-center text-xs leading-5 text-white">
      {props.children}
    </span>
  );
};

export default BasePill;