import React from 'react';
import { WarningIcon } from 'icons/Warning';
import { FormikHandlers } from 'formik';

interface DomainInputFieldProps {
  id: string;
  formik: {
    handleChange: FormikHandlers['handleChange'];
    handleBlur: FormikHandlers['handleBlur'];
    touched: { domain?: boolean };
    errors: { domain?: string };
  };
  infoModal: JSX.Element;
  name: string;
  value: string;
}

const DomainInputField = React.forwardRef<HTMLInputElement, DomainInputFieldProps>(
  ({ id, formik, infoModal, name, value }, ref) => {
    return (
      <div>
        <div className="group relative z-10">
          <input
            name={name}
            className={
              formik.touched.domain && formik.errors.domain
                ? 's-input border-red-400 !h-[42px] !pr-[44px]'
                : 's-input !h-[42px] border-gray-300 !pr-[44px]'
            }
            type="text"
            ref={ref}
            id={id}
            placeholder="e.g. yammerz"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={value}
          />
        </div>
        {formik.touched.domain && formik.errors.domain && (
          <div className="s-error -mt-[21px] opacity-100">
            <WarningIcon  />
            {formik.errors.domain}
          </div>
        )}
        {infoModal}
      </div>
    );
  },
);

export default DomainInputField;
