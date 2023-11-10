import { useState, useRef, memo } from 'react';
import { useNavigate } from 'react-router';
import { useCurrentPosition } from '../components/order';
import LoaderModal from 'components/LoaderModal';
import { useLoginModal } from 'contexts/LoginModalContext';
import { DomainInputWrapper, OptionButtons, RegistrationMessage } from '../components/SetupBlocks';
import { getTitleText, getFaqBody, getLoaderModalTimerText } from '../utils/modFunctions';
import { useRegTransactions } from '../utils/useRegTransactions';

interface SetupDomainProps {
  onRegistrationComplete: any;
  pipeState: any;
}

const SetupDomain: React.FC<SetupDomainProps> = memo(({ onRegistrationComplete, pipeState }) => {
  const { index, nextSlug, isLast } = useCurrentPosition();
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(true);
  const { openLoginModal } = useLoginModal();

  const handleRegistrationComplete = (data) => {
    console.log('Registration completed in child component:', data);
    onRegistrationComplete(data);
  };

  const {
    registered,
    isAvailable,
    modalClose,
    primaryDisabled,
    primaryButtonText,
    isSecondaryAvailable,
    registrationLoading,
    formik,
    checkLoading,
    nextLoading,
    nextDisabled,
    onAppOptIn,
    onAssetCreate,
    onAssetOptIn,
    onAssetRequest,
    onPayment,
    regComplete,
    percentage,
    setCheckLoading,
    setIsSecondaryAvailable,
    setIsAvailable,
    handleCheckAvailability,
    handleRegistered,
    handleUnRegistered,
    handleAssetCreate,
    handleAssetOptIn,
    handleAssetRequest,
    handleAppOptIn,
    handleDomainTransaction,
  } = useRegTransactions({ onRegistrationComplete: handleRegistrationComplete });

  const domainRef = useRef(null);
  //console.log(onAppOptIn);
  //console.log(isSecondaryAvailable);

  return (
    <>
      <h4 className="mb-2 px-4 md:px-0">Setup your XBallot domain</h4>
      {registrationLoading.open && (
        <LoaderModal
          handleAssetCreate={handleAssetCreate}
          handleAssetOptIn={handleAssetOptIn}
          handlePayment={handleDomainTransaction}
          handleAppOptIn={handleAppOptIn}
          handleAssetRequest={handleAssetRequest}
          onAssetOptIn={onAssetOptIn}
          onAssetRequest={onAssetRequest}
          regComplete={regComplete}
          onAssetCreate={onAssetCreate}
          disabled={disabled}
          onAppOptIn={onAppOptIn}
          onPayment={onPayment}
          nextLoading={nextLoading}
          nextDisabled={nextDisabled}
          faqBody={getFaqBody(percentage)}
          timer={getLoaderModalTimerText(percentage)}
          title={getTitleText(percentage)}
          handleUnRegistered={handleUnRegistered}
          handleRegistered={handleRegistered}
          percentage={percentage}
          {...registrationLoading}
          closeModalFunction={modalClose}
          forceStayOpen={registrationLoading.forceStayOpen}
          isOpen={registrationLoading.open}
        />
      )}
      <RegistrationMessage registered={registered} />
      <div className="border border-skin-border bg-skin-block-bg text-base md:rounded-xl md:border">
        <div className="p-4 leading-5 sm:leading-6">
          {registered ? (
            <OptionButtons
              formik={formik}
              navigate={navigate}
              nextSlug={nextSlug}
              isLast={isLast}
              domainRef={domainRef}
              domainAvailable={isAvailable}
              primaryDisabled={primaryDisabled}
              primaryButtonText={primaryButtonText}
              handleCheckAvailability={handleCheckAvailability}
              checkLoading={checkLoading}
              setCheckLoading={setCheckLoading}
              pipeState={pipeState}
              setDomainAvailable={setIsAvailable}
              setAvailable={setIsSecondaryAvailable}
              openLoginModal={openLoginModal}
            />
          ) : (
            <DomainInputWrapper
              formik={formik}
              domainAvailable={isAvailable}
              primaryDisabled={primaryDisabled}
              primaryButtonText={primaryButtonText}
              handleCheckAvailability={handleCheckAvailability}
              checkLoading={checkLoading}
              setCheckLoading={setCheckLoading}
              pipeState={pipeState}
              setDomainAvailable={setIsAvailable}
              setAvailable={setIsSecondaryAvailable}
              openLoginModal={openLoginModal}
            />
          )}
        </div>
      </div>
    </>
  );
});

export default SetupDomain;
