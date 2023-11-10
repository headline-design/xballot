import React, { useState, useEffect } from 'react';
import { Block } from 'components/BaseComponents/Block';

export const DisplayFormikState = (props) => {
  const [value, setValue] = useState(JSON.stringify(props, null, 2));

  useEffect(() => {
    setValue(JSON.stringify(props, null, 2));
  }, [props]);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <>
      <Block title="All settings">
        <textarea
          className="no-scrollbar input !mt-1 h-auto w-full w-full !overflow-x-scroll whitespace-pre rounded-3xl border border-skin-border py-3 px-4 text-left font-mono text-sm focus-within:!border-skin-text hover:border-skin-text"
          placeholder="Strategy parameters"
          style={{ resize: 'none', height: '321px' }}
          value={value}
          onChange={handleChange}
        />
      </Block>
    </>
  );
};
