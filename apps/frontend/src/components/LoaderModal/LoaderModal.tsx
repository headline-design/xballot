import './styles.css';
import { Dialog } from './Modal';
import ProgressBar from './ProgressBar';
import Button from 'components/BaseComponents/BaseButton/BaseButton';
import { NoticeIcon } from 'icons/NoticeIcon';

const RenewalNotice = ({ faqBody, link, linkTitle }) => (
  <div>
    <NoticeIcon />
    <div className="leading-5">
      <span>
        {faqBody}
        {link && (
          <a href={link} target="_blank" className="whitespace-nowrap" rel="noopener noreferrer">
            {' '}
            {linkTitle}
            <svg
              viewBox="0 0 24 24"
              width="1.2em"
              height="1.2em"
              className="ml-1 mb-[2px] inline-block text-xs"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        )}
      </span>
    </div>
  </div>
);

const LoaderModalContent = ({
  title,
  timer,
  percentage,
  nextLoading,
  nextDisabled,
  handleUnRegistered,
  handleRegistered,
  onAssetOptIn,
  onPayment,
  onAppOptIn,
  onAssetCreate,
  onAssetRequest,
  handleAssetRequest,
  handleAssetCreate,
  handleAppOptIn,
  handlePayment,
  handleAssetOptIn,
  faqBody,
  link,
}) => (
  <>
    <div className="border-b p-4 text-center">
      <h3 className="text-lg font-medium leading-6 text-gray-900"> Register domain</h3>
    </div>
    <div className="modal-body">
      <ProgressBar message={title} timer={timer} barStyle={{ width: `${percentage}%` }} />
      <div className="m-4">
        <span className="flex">
          <RenewalNotice faqBody={faqBody} link={link} linkTitle="Learn more" />
        </span>
      </div>
    </div>
    <div className="border-t p-4 pt-3 text-center">
      <Button
        loading={
          onAppOptIn
            ? false
            : onPayment
            ? false
            : onAssetCreate
            ? false
            : onAssetOptIn
            ? false
            : onAssetRequest
            ? false
            : nextLoading
        }
        disabled={
          onAppOptIn
            ? false
            : onPayment
            ? false
            : onAssetCreate
            ? false
            : onAssetOptIn
            ? false
            : onAssetRequest
            ? false
            : nextDisabled
        }
        type="button"
        onClick={
          onAppOptIn
            ? handleAppOptIn
            : onPayment
            ? handlePayment
            : onAssetCreate
            ? handleAssetCreate
            : onAssetOptIn
            ? handleAssetOptIn
            : onAssetRequest
            ? handleAssetRequest
            : handleRegistered
        }
        className="loading button button--primary mt-2 flex w-full items-center justify-center px-[22px] hover:brightness-95"
        onChange={undefined}
      >
        {onAppOptIn
          ? 'Create application'
          : onPayment
          ? 'Send payment'
          : onAssetCreate
          ? 'Mint domain'
          : onAssetOptIn
          ? 'Opt in'
          : onAssetRequest
          ? 'Request asset'
          : 'Next'}
      </Button>
      <button
        type="button"
        onClick={handleUnRegistered}
        className="button button--secondary mt-2 w-full px-[22px] hover:brightness-95"
      >
        Close
      </button>
    </div>
  </>
);

const LoaderModal = ({
  title,
  nextLoading,
  nextDisabled,
  timer,
  handleRegistered,
  handleUnRegistered,
  percentage,
  onAssetOptIn,
  handleAssetOptIn,
  onAssetCreate,
  onAssetRequest,
  handleAssetCreate,
  handlePayment,
  onPayment,
  open,
  onAppOptIn,
  handleAppOptIn,
  handleAssetRequest,
  link,
  faqBody,
  forceStayOpen,
}) => (
  <Dialog
    forceStayOpen={forceStayOpen}
    open={open}
    render={() => (
 <LoaderModalContent
            title={title}
            timer={timer}
            percentage={percentage}
            nextLoading={nextLoading}
            nextDisabled={nextDisabled}
            handleUnRegistered={handleUnRegistered}
            onAssetOptIn={onAssetOptIn}
            handleAssetOptIn={handleAssetOptIn}
            handleAssetRequest={handleAssetRequest}
            handleRegistered={handleRegistered}
            onAssetCreate={onAssetCreate}
            handleAssetCreate={handleAssetCreate}
            onPayment={onPayment}
            handlePayment={handlePayment}
            onAppOptIn={onAppOptIn}
            handleAppOptIn={handleAppOptIn}
            faqBody={faqBody}
            link={link}
            onAssetRequest={onAssetRequest}
          />
    )}
    closeModalFunction={undefined}
    children={undefined}
  />
);

export default LoaderModal;
