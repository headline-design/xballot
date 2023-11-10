import React from 'react';

const DomainPill = (props) => {
  return (
    <span className={props.className + "  px-2 text-center text-xs leading-5 ml-1 rounded-full border px-[7px] text-xs text-skin-text"}>
      {props.children}
    </span>
  );
};

export default DomainPill;