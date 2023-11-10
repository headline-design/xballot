import clsx from 'clsx';
import { ComponentProps, forwardRef, useId } from 'react';

interface Props extends ComponentProps<'textarea'> {
  limit?: number;
  label?: string;
  className?: string;
  error?: boolean;
  count?: number;
  fileUpload?: any;
  setFormBody?: any;
  formikForm?: any;

  formikField?: any;
}

export const MarkdownEditor = forwardRef<HTMLTextAreaElement, Props>(function TextArea(
  {
    label,
    limit = 14000,
    className,
    error,
    count,
    onChange,
    fileUpload,
    setFormBody,
    formikForm,
    formikField,
    ...props
  },
  ref,
) {
  const id = useId();

  const handleChange = (event: any) => {
    setFormBody(event.target.value);
    formikForm.setFieldValue(formikField.name, event.target.value);
    onChange && onChange(event);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between">
        <label className="mb-[2px] flex items-center gap-1 text-skin-text" htmlFor={id}>
          {label && <div>{label}</div>}
        </label>
        <div className="text-xs">
          {count} / {limit}
        </div>
      </div>
      <div className="peer min-h-[240px] overflow-hidden rounded-t-xl border border-skin-border focus-within:border-skin-text">
        <textarea
          id={id}
          onChange={handleChange}
          className={clsx(
            's-input mt-0 h-full min-h-[240px] w-full !rounded-xl border-none pt-0 text-base',
            { '!border-red': error },
            { 'cursor-not-allowed placeholder:!opacity-30': props.disabled },
            className,
          )}
          ref={ref}
          {...props}
          maxLength={limit}
        />
      </div>

      <label className="relative flex items-center justify-between rounded-b-xl border border-t-0 border-skin-border py-1 px-2 peer-focus-within:border-skin-text">
        {fileUpload}
        <span className="pointer-events-none relative pl-1 text-sm">
          <span>Attach images by dragging &amp; dropping, selecting or pasting them.</span>
        </span>
        <a
          href="https://docs.github.com/github/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax"
          target="_blank"
          className="relative inline whitespace-nowrap"
          rel="noopener noreferrer"
        >
          <i
            className="iconfont iconmarkdown text-skin-text"
            style={{ fontSize: 'px', lineHeight: '16px' }}
          />
        </a>
      </label>
    </div>
  );
});
