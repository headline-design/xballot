import { Field } from 'formik';
import { WarningIcon } from 'icons/Warning';
import React, { useState } from 'react';

const FormikTextArea = ({
  count,
  title,
  placeholder,
  maxLength,
  id,
  name,
  value,
  errorTag,
  errorField,
  style,
}) => {
  const [charCount, setCharCount] = useState(0);

  return (
    <div className="group w-full rounded-3xl">
      <span className="mb-[2px] flex items-center gap-1 text-skin-text">{title}</span>
        <Field name={name}>
          {({ field, form }) => (
            <>
              <div className="group group relative z-10 bg-skin-bg br-9999">
                <textarea
                  value={value}
                  id={id}
                  style={style || {resize: 'none', height: '65px', overflow: 'hidden' }}
                  maxLength={maxLength}
                  placeholder={placeholder}
                  name={name}
                  className={
                    errorTag
                      ? errorTag && 's-input !rounded-3xl !mt-1 h-auto w-full rounded-3xl border border-skin-border py-3 px-4 focus-within:border-skin-text hover:border-skin-text s-input !h-[65px] !border-red !pr-[65px]'
                      : !errorTag && 's-input !rounded-3xl !mt-1 h-auto w-full rounded-3xl border border-skin-border py-3 px-4 focus-within:border-skin-text hover:border-skin-text s-input !h-[65px] !pr-[65px]'
                  }
                  type="text"
                  {...field}
                  onChange={(e) => {
                    form.setFieldValue(field.name, e.target.value);
                    setCharCount(e.target.value.length);
                  }}
                  onBlur={form.handleBlur}
                />

                <span className="hidden text-xs text-skin-text group-focus-within:block absolute pointer-events-none absolute top-3 right-0 flex hidden items-center pr-3 align-middle text-xs text-skin-text">
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

export default FormikTextArea;
