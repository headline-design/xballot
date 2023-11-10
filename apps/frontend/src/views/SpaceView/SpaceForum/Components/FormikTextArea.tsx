import { WarningIcon } from 'icons/Warning';
import { useState } from 'react';

const FormikTextArea = ({
  id,
  formik,
  name,
  value,
  errorTag,
  errorField,
  title,
  count,
  maxLength,
}) => {
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e) => {
    setCharCount(e.target.value.length);
    formik.handleChange(e);
  };

  return (
    <div className="group w-full rounded-3xl">
      <span className="mb-[2px] flex items-center gap-1 text-skin-text">{title}</span>
      <>
        <div className="group group relative z-10 bg-skin-bg br-9999">
          <textarea
            style={{ resize: 'none', height: '65px', overflow: 'hidden' }}
            name={name}
            className={
              errorTag
                ? errorTag &&
                  's-input s-input !mt-1 h-auto !h-[65px] w-full !rounded-3xl rounded-3xl border border-skin-border !border-red py-3 px-4 !pr-[65px] focus-within:border-skin-text hover:border-skin-text'
                : !errorTag &&
                  's-input s-input !mt-1 h-auto !h-[65px] w-full !rounded-3xl rounded-3xl border border-skin-border py-3 px-4 !pr-[65px] focus-within:border-skin-text hover:border-skin-text'
            }
            id={id}
            placeholder="e.g. hello world"
            onChange={handleChange}
            onBlur={formik.handleBlur}
            value={value}
          />
          <span className="pointer-events-none absolute absolute top-3 right-0 flex hidden hidden items-center pr-3 align-middle text-xs text-xs text-skin-text text-skin-text group-focus-within:block">
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
    </div>
  );
};

export default FormikTextArea;
