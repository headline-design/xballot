import { NoticeIcon } from 'icons/NoticeIcon';
import React from 'react';
import { Link } from 'react-router-dom';
import FeeModal from 'components/DomainFeeModal';
import { Button } from 'components/BaseComponents/Button';
import { WarningIcon } from 'icons/Warning';
import { FormikErrors, FormikTouched } from 'formik';
import { ButtonArrowRight } from 'icons/ButtonArrowRight';
import { getTerms } from 'utils/endPoints';

export const RegistrationMessage = ({ registered }) => {
  return (
    <div className="mb-4 rounded-xl rounded-none border border-y border-x-0 border-skin-border bg-skin-block-bg text-base text-skin-text md:rounded-xl md:border">
      <div className="p-4 leading-5 sm:leading-6">
        {!registered ? <UnregisteredMessage /> : <RegisteredMessage />}
      </div>
    </div>
  );
};

export const UnregisteredMessage = () => {
const terms = getTerms();
  return (
  <>
    <div>
      <NoticeIcon />
      <div className="leading-5">
        One thing you need before you can create your own space, is an XBallot{' '}
        <span className="bold">domain</span> on {terms.chainTitle}.{' '}
        <span>
          You can also{' '}
          <a href="/" target="_blank" className="whitespace-nowrap" rel="noopener noreferrer">
            try the demo
            {/* ...SVG content here... */}
          </a>{' '}
          on Algorand testnet and mess with things there first.
        </span>
      </div>
    </div>
  </>
  )
  }

export const RegisteredMessage = () => (
  <>
    <div className="relative inset-y-0 flex items-center">
      <div className="pr-[44px] leading-5">
        Domain registration complete. You may now choose to use your XBallot domain as an XBallot Space or
        an XBallot user. Please select one of the options below.
      </div>
    </div>
  </>
);

export const OptionButtons = ({
  primaryDisabled,
  formik,
  navigate,
  nextSlug,
  isLast,
  domainRef,
  openLoginModal,
  setAvailable,
  setDomainAvailable,
  setCheckLoading,
  domainAvailable,
  primaryButtonText,
  handleCheckAvailability,
  checkLoading,
  pipeState,
}) => {
  return (
    <>
      <div className="mb-2">Choose the status of your XBallot domain:</div>
      <div className="space-y-2">
        <Link to={'/account/' + formik.values.domain + '/about'}>
          <button
            type="button"
            className="button flex w-full items-center justify-between px-[22px]"
            data-v-4a6956ba=""
          >
            XBallot user
            <ButtonArrowRight />
          </button>
        </Link>
        <button
          type="button"
          className="button flex w-full items-center justify-between px-[22px]"
          data-v-4a6956ba=""
          onClick={(values) => {
            navigate(isLast ? '/' : `/setup/${nextSlug}`, { state: { fromForm: true } });
          }}
        >
          XBallot space
          <ButtonArrowRight />
        </button>
      </div>
      <div className="mt-4 mb-2">Or register another domain:</div>
      <div>
      <form onSubmit={formik.handleSubmit}>
          <div>
            <div className="bg-input-group br-9999 group relative z-10">
              <input
                name="domain"
                className={
                  formik.touched.domain && formik.errors.domain
                    ? 's-input border-red-400 !h-[42px] !pr-[44px]'
                    : 's-input !h-[42px] border-gray-300 !pr-[44px]'
                }
                type="text"
                placeholder="e.g. yammerz"
                onBlur={formik.handleBlur}
                value={formik.values.domain}
                onChange={(e) => {
                  const value = e.target.value || '';
                  formik.setFieldValue('domain', value.toLowerCase());
                  setAvailable(true);
                  setDomainAvailable(true);
                  setCheckLoading(false);
                }}
              />
            </div>
            {formik.touched.domain && formik.errors.domain && (
              <div className="s-error -mt-[21px] opacity-100">
                <WarningIcon  />
                {formik.errors.domain}
              </div>
            )}
          </div>
          {domainAvailable ? (
            <Button
              disabled={primaryDisabled}
              loading={checkLoading ? true : false}
              type="button"
              onClick={() => handleCheckAvailability()}
              className="button button--primary mt-2 w-full px-[22px] hover:brightness-95"
            >
              {primaryButtonText}
            </Button>
          ) : (
            <Button
              disabled={primaryDisabled}
              type={pipeState.myAddress ? 'submit' : 'button'}
              onClick={
                pipeState.myAddress ? () => console.log('connected') : () => openLoginModal()
              }
              className="button button--primary mt-2 w-full px-[22px] hover:brightness-95"
            >
              {pipeState.myAddress ? 'Register' : 'Connect wallet'}
            </Button>
          )}
        </form>
      </div>
    </>
  );
};

interface DomainInputWrapperProps {
  formik: {
    handleSubmit: FormEventHandler<HTMLFormElement>;
    handleBlur: FocusEventHandler<HTMLInputElement>;
    values: any;
    errors: FormikErrors<{ domain: string }>;
    touched: FormikTouched<{ domain: string }>;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  };
  domainAvailable: any;
  primaryDisabled: any;
  primaryButtonText: any;
  handleCheckAvailability: () => void;
  checkLoading: any;
  pipeState: any; // Replace 'any' with the appropriate type for PipeStateContext
  openLoginModal: any;
  setAvailable: any;
  setDomainAvailable: any;
  setCheckLoading: any;
}

export const DomainInputWrapper: React.FC<DomainInputWrapperProps> = ({
  formik,
  openLoginModal,
  setAvailable,
  setDomainAvailable,
  setCheckLoading,
  domainAvailable,
  primaryDisabled,
  primaryButtonText,
  handleCheckAvailability,
  checkLoading,
  pipeState,
}) => {
  return (
    <div>
      <div className="mb-2">
        To create a space, you first need an XBallot domain. Enter one below and follow the XBallot
        registration instructions.
      </div>
      <div>
        <form onSubmit={formik.handleSubmit}>
          <div>
            <div className="bg-input-group br-9999 group relative z-10">
              <input
                name="domain"
                className={
                  formik.touched.domain && formik.errors.domain
                    ? 's-input border-red-400 !h-[42px] !pr-[44px]'
                    : 's-input !h-[42px] border-gray-300 !pr-[44px]'
                }
                type="text"
                placeholder="e.g. yammerz"
                onBlur={formik.handleBlur}
                value={formik.values.domain}
                onChange={(e) => {
                  const value = e.target.value || '';
                  formik.setFieldValue('domain', value.toLowerCase());
                  setAvailable(true);
                  setDomainAvailable(true);
                  setCheckLoading(false);
                }}
              />
            </div>
            {formik.touched.domain && formik.errors.domain && (
              <div className="s-error -mt-[21px] opacity-100">
                <WarningIcon  />
                {formik.errors.domain}
              </div>
            )}
          </div>
          {domainAvailable ? (
            <Button
              disabled={primaryDisabled}
              loading={checkLoading ? true : false}
              type="button"
              onClick={() => handleCheckAvailability()}
              className="button button--primary mt-2 w-full px-[22px] hover:brightness-95"
            >
              {primaryButtonText}
            </Button>
          ) : (
            <Button
              disabled={primaryDisabled}
              type={pipeState.myAddress ? 'submit' : 'button'}
              onClick={
                pipeState.myAddress ? () => console.log('connected') : () => openLoginModal()
              }
              className="button button--primary mt-2 w-full px-[22px] hover:brightness-95"
            >
              {pipeState.myAddress ? 'Register' : 'Connect wallet'}
            </Button>
          )}
        </form>
        <FeeModal />
      </div>
    </div>
  );
};
