import React, { useState } from 'react';

const Input = ({ id, checked, type, name, title, value, onChange, placeholder, maxLength }) => {
  const [count, setCount] = useState(0);

  return (
    <input
      style={{display: 'none'}}
      id={id}
      checked={checked}
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
  );
};

export default Input;
