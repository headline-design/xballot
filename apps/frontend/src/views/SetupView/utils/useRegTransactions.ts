import { useState, useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import toast from 'react-hot-toast';
import {
  handleAppTransaction,
  handlePaymentTransaction,
  handleAssetCreateTransaction,
  handleOptInTransaction,
  checkDomainAvailability,
  makeDomainRequest,
} from './useRegistrar';
import { updateRegistrationLoading } from 'redux/ui/loaders';

export const useRegTransactions = ({ onRegistrationComplete }) => {
  const [registered, setRegistered] = useState(false);
  const [checkLoading, setCheckLoading] = useState(false);
  const [primaryDisabled, setPrimaryDisabled] = useState(false);
  const [isSecondaryAvailable, setIsSecondaryAvailable] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [modalClose, setModalClose] = useState(false);
  const [percentage, setPercentage] = useState(15);
  const [regComplete, setRegComplete] = useState(false);
  const [optAssetTxn, setOptAssetTxn] = useState(null);
  const [appId, setAppId] = useState(null);
  const [assetId, setAssetId] = useState(null);
  const [domain, setDomain] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [callbacks, setCallbacks] = useState(null);
  const [goodToGo, setGoodToGo] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [onAppOptIn, setOnAppOptIn] = useState(false);
  const [onPayment, setOnPayment] = useState(false);
  const [onAssetCreate, setOnAssetCreate] = useState(false);
  const [onAssetOptIn, setOnAssetOptIn] = useState(false);
  const [onAssetRequest, setOnAssetRequest] = useState(false);
  const [nextLoading, setNextLoading] = useState(true);
  const [nextDisabled, setNextDisabled] = useState(true);

  //console.log(domain);

  const { registrationLoading } = useAppSelector((state) => state.loaders);
  const dispatch = useAppDispatch();

  const handleRegistered = useCallback(() => {
    setRegistered(true);
    setPrimaryDisabled(false);
    dispatch(updateRegistrationLoading({ forceStayOpen: false, open: false }));
  }, [dispatch]);

  const handleUnRegistered = useCallback(() => {
    setRegistered(false);
    setPrimaryDisabled(false);
    dispatch(updateRegistrationLoading({ forceStayOpen: false, open: false }));
  }, [dispatch]);

  const primaryDisabledCondition = () => {
    return primaryDisabled
      ? true
      : formik.errors.domain || formik.values.domain.length === 0
      ? true
      : !isAvailable
      ? false
      : !isSecondaryAvailable
      ? true
      : checkLoading
      ? true
      : formik.values.domain
      ? !formik.isValid
      : !formik.isValid;
  };

  const primaryButtonTextCondition = () => {
    return !primaryDisabled
      ? 'Check domain availability'
      : formik.errors.domain || formik.values.domain.length === 0
      ? 'Domain not available'
      : !isSecondaryAvailable
      ? 'Domain not available'
      : 'Check domain availability'
      ? checkLoading
        ? 'Check domain availability'
        : 'Check domain availability'
      : 'Domain not available';
  };

  const formik = useFormik({
    validationSchema: Yup.object({
      domain: Yup.string()
        .matches(/^[a-zA-Z0-9]*$/, {
          message: 'Domain name must contain only alphanumeric characters.',
        })
        .required('Please enter a domain name.'),
    }),
    initialValues: {
      domain: '',
    },
    onSubmit: (values) => {
      if (formik.isValid) {
        setPrimaryDisabled(true);
        setPercentage(15);
        setOnAppOptIn(true);
        setCheckLoading(true);
        setNextDisabled(true);
        setNextLoading(true);
        dispatch(
          updateRegistrationLoading({
            forceStayOpen: true,
            open: true,
            action: 'Register domain',
            target: 'Fetching information',
            cancellable: true,
          }),
        );
      } else {
        setShowLoader(true);
      }
    },
  });

  async function handleCheckAvailability() {
    try {
      const localDomain = formik.values.domain;
      console.log('Domain:', localDomain); // Add this line to log the domain value
      setCheckLoading(true);
      setDomain(localDomain);

      if (localDomain) {
        setTimeout(async () => {
          try {
            const appCallbacks = {
              onSuccess: () => {
                setIsAvailable(!isAvailable);
                setIsSecondaryAvailable(true);
                setGoodToGo(true);
                toast.success('Domain available');
              },

              onError: () => {
                setIsAvailable(isAvailable);
                setIsSecondaryAvailable(false);
                toast.error('Domain not available');
                setGoodToGo(false);
                setCheckLoading(false);
              },
            };

            await checkDomainAvailability(localDomain, appCallbacks);
          } catch (error) {
            console.error(error);
            toast('Error occurred');
          } finally {
            setCheckLoading(false);
          }
        }, 1000); // Set a timeout of 1 second (1000ms)
      } else {
        setOnAppOptIn(false);
        toast('Error occurred');
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleAppOptIn() {
    try {
      if (onAppOptIn) {
        setOnAppOptIn(false);
        const appCallbacks = {
          onSuccess: (appId) => {
            setAppId(appId);
            toast('App creation complete');
            setPercentage(30);
            setOnPayment(true);
          },
          onError: (appId) => {
            toast('App creation error');
            setOnAppOptIn(true);
          },
        };
        await handleAppTransaction(domain, goodToGo, appCallbacks);
      } else {
        toast('Error occured');
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function handleDomainTransaction() {
    try {
      if (onPayment) {
        setOnPayment(false);
        const paymentCallbacks = {
          onSuccess: (paymentId, callbacks) => {
            setOnPayment(false);
            setOnAssetCreate(true);
            setPaymentId(paymentId);
            setCallbacks(callbacks);
            setPercentage(45);
            toast('Payment complete');
          },
          onError: () => {
            setOnPayment(true);
            console.log('error');
          },
        };
        await handlePaymentTransaction(domain, paymentCallbacks);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function handleAssetCreate() {
    try {
      if (onAssetCreate) {
        setOnAssetCreate(false);
        const assetCreateCallbacks = {
          onSuccess: (assetId) => {
            setOnAssetOptIn(true);
            setAssetId(assetId);
            toast('Asset created');
            setPercentage(60);
          },
          onError: () => {
            console.log('Error occured');
          },
        };
        await handleAssetCreateTransaction(paymentId, appId, domain, assetCreateCallbacks);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function handleAssetOptIn() {
    console.log(percentage);
    try {
      if (onAssetOptIn) {
        setOnAssetOptIn(false);
        const assetOptInCallbacks = {
          onSuccess: (optTxId) => {
            console.log('Opt-in transaction successful, ID:', optTxId);
            setOnAssetOptIn(false);
            setOptAssetTxn(optTxId);
            setPercentage(80);
            setOnAssetRequest(true);
          },
          onError: () => {
            setOnAssetOptIn(true);
            console.log('error');
          },
        };
        await handleOptInTransaction(assetId, assetOptInCallbacks);
      }
    } catch (e) {
      console.log(e);
    }
  }

  //console.log(domain);
  //console.log(optAssetTxn);

  async function handleAssetRequest() {
    try {
      if (onAssetRequest) {
        setOnAssetRequest(false);
        const domainRequestCallbacks = {
          onSuccess: () => {
            setOnAssetOptIn(false);
            toast.success('Registration complete');
            setRegComplete(true);
            setPercentage(100);
            setNextDisabled(false);
            setNextLoading(false);

            // Call the onComplete callback with the required values
            onRegistrationComplete({
              optAssetTxn,
              paymentId,
              assetId,
              appId,
              domain,
            });
          },
          onError: () => {
            setOnAssetRequest(true);
            console.log('error');
          },
        };

        await makeDomainRequest(
          optAssetTxn,
          paymentId,
          assetId,
          appId,
          domain,
          domainRequestCallbacks,
        );
      }
    } catch (e) {
      console.log(e);
    }
  }

  return {
    registered,
    modalClose,
    handleRegistered,
    handleUnRegistered,
    isAvailable,
    setIsAvailable,
    isSecondaryAvailable,
    setIsSecondaryAvailable,
    checkLoading,
    primaryDisabled: primaryDisabledCondition(),
    primaryButtonText: primaryButtonTextCondition(),
    formik,
    handleCheckAvailability,
    setCheckLoading,
    registrationLoading,
    nextLoading,
    nextDisabled,
    onAppOptIn,
    onAssetCreate,
    onAssetOptIn,
    onAssetRequest,
    onRegistrationComplete,
    onPayment,
    regComplete,
    percentage,
    handleAppOptIn,
    handleAppTransaction,
    handleAssetCreate,
    handleAssetOptIn,
    handleDomainTransaction,
    handleAssetRequest,
    appId,
  };
};
