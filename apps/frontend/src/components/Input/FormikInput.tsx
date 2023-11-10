import { Field } from 'formik';
import { WarningIcon } from 'icons/Warning';
import React, { useState } from 'react';

const FormikIconInput = ({
  count,
  title,
  placeholder,
  maxLength,
  id,
  ref,
  name,
  value,
  errorTag,
  errorField,
  type,
}) => {
  const [charCount, setCharCount] = useState(0);

  return (
    <div className="group w-full rounded-3xl">
      <span className="mb-[2px] flex items-center gap-1 text-skin-text">{title}</span>
      <Field name={name}>
        {({ field, form }) => (
          <>
            <div className="group group relative z-10 bg-skin-bg br-9999">
              <input
                maxLength={maxLength}
                type={type}
                value={value}
                placeholder={placeholder}
                name={name}
                className={
                  errorTag
                    ? errorTag && 's-input !h-[42px] !border-red !pr-[40px]'
                    : !errorTag && 's-input !h-[42px] !pr-[40px]'
                }
                {...field}
                ref={ref}
                id={id}
                onChange={(e) => {
                  form.setFieldValue(field.name, e.target.value);
                  setCharCount(e.target.value.length);
                }}
                onBlur={form.handleBlur}
              />
              <span className="pointer-events-none absolute inset-y-0 right-0 flex hidden items-center pr-3 align-middle text-xs text-skin-text group-focus-within:flex">
                {count && (
                  <>
                    {charCount} / {maxLength}
                  </>
                )}
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
    </div>
  );
};

export default FormikIconInput;
