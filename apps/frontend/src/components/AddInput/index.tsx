import React, { useEffect, useState } from 'react';
import { DraggableDots } from 'icons/DraggableDots';
import { WarningIcon } from 'icons/Warning';
import { Field } from 'formik';

const AddInput = ({ choiceKey, handleChange, text, name, errorTag, errorField }) => {
  const [inputValue, setInputValue] = useState(text || '');

  useEffect(() => {
    if (text !== undefined) {
      setInputValue(text);
    }
  }, [text]);

  return (
    <>
      <Field name={name} className="group relative z-10">
        {({ field, form }) => (
          <>
            <div
              className={`relative z-10 flex w-full rounded-3xl border border-skin-border bg-skin-bg px-3 text-left leading-[42px] outline-none transition-colors focus-within:border-skin-text ${
                errorTag ? errorTag && '!border-red' : null
              }`}
            >
              <div className="mr-2 whitespace-nowrap text-skin-text">
                <div className="drag-handle flex cursor-grab items-center active:cursor-grabbing">
                  <DraggableDots />
                  Choice {choiceKey + 1}
                </div>
              </div>

              <input
                placeholder=""
                type="text"
                name={name}
                className="input w-full flex-auto"
                value={inputValue}
                onChange={(e) => {
                  if (e.target.value.length <= 32) {
                    setInputValue(e.target.value);
                    handleChange(choiceKey, e.target.value);
                    form.setFieldValue(field.name, e.target.value);
                  }
                }}
                maxLength={32}
              />
              <span className="hidden text-xs text-skin-text group-focus-within:block">
                {inputValue.length}/32
              </span>
            </div>
            {errorTag && (
              <div className="s-error -mt-[21px] opacity-100">
                <WarningIcon  />
                {errorField}
              </div>
            )}
          </>
        )}
      </Field>
    </>
  );
};

export default AddInput;
