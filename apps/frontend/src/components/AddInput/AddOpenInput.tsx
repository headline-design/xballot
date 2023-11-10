import React, { useEffect, useState } from 'react';
import { DraggableDots } from 'icons/DraggableDots';
import { WarningIcon } from 'icons/Warning';
import { Field } from 'formik';

const AddOpenInput = ({ choiceKey, handleChange, text, name }) => {
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
            <div className="relative z-10 flex w-full rounded-3xl border border-skin-border bg-skin-bg px-3 text-left leading-[42px] outline-none transition-colors focus-within:border-skin-text">
              <div className="mr-2 whitespace-nowrap text-skin-text">
                <div className="drag-handle flex cursor-not-allowed items-center active:cursor-not-allowed">
                  <DraggableDots />
                  <input
                    placeholder="label"
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
                </div>
              </div>

              <div className="input w-full flex-auto" />
              <span className="hidden text-xs text-skin-text group-focus-within:block">
                {inputValue.length}/32
              </span>
            </div>
            <div className="s-error relative z-0 -mt-[48px] opacity-0">
              <WarningIcon  />
            </div>
          </>
        )}
      </Field>
    </>
  );
};

export default AddOpenInput;
