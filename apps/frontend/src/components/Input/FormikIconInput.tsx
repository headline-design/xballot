import { Field } from 'formik';
import { WarningIcon } from 'icons/Warning';
import React, { useState } from 'react';

const FormikIconInput = ({
  count,
  icon,
  title,
  placeholder,
  maxLength,
  id,
  ref,
  name,
  value,
  errorTag,
  errorField,
}) => {
  const [charCount, setCharCount] = useState(0);

  return (
    <div>
      <div className="group w-full rounded-3xl">
        <span className="mb-[2px] flex items-center gap-1 text-skin-text">{title}</span>

        <Field name={name}>
          {({ field, form }) => (
            <>
              <div className="group group relative z-10 bg-skin-bg br-9999">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  {icon}
                </div>
                <input
                  maxLength={maxLength}
                  value={value}
                  placeholder={placeholder}
                  name={name}
                  className={
                    errorTag
                      ? errorTag && 's-input !h-[42px] !border-red !pl-[40px] !pr-[40px]'
                      : !errorTag && 's-input !h-[42px] !pl-[40px] !pr-[40px]'
                  }
                  {...field}
                  type="text"
                  ref={ref}
                  id={id}
                  onChange={(e) => {
                    form.setFieldValue(field.name, e.target.value);
                    setCharCount(e.target.value.length);
                  }}
                  onBlur={form.handleBlur}
                />

                <span className="pointer-events-none absolute inset-y-0 right-0 flex hidden items-center pr-3 align-middle text-xs text-skin-text group-focus-within:flex">
                  {count && <>{charCount} / {maxLength}</> }
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
    </div>
  );
};

export default FormikIconInput;
