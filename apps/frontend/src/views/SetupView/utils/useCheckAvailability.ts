

import { useState } from 'react';
import { handleAppTransaction, handleAssetCreateTransaction, handleOptInTransaction, handlePaymentTransaction } from './useRegistrar';
import { useAppSelector } from 'redux/hooks';

export const useTransactionFlow = ({ domain, callbackAppId, callbackDomain, callbackAssetId }) => {
  const [primaryDisabled, setPrimaryDisabled] = useState(false);

  const handleTransactionFlow = async () => {
    try {
      const appResult = await handleAppTransaction(domain);
      callbackAppId(appResult.appId);

      const paymentResult = await handlePaymentTransaction(domain);

      const assetResult = await handleAssetCreateTransaction(paymentResult.paymentId, appResult.appId, domain);
      callbackAssetId(assetResult.assetId);

      const optInResult = await handleOptInTransaction(paymentResult.paymentId, assetResult.assetId, appResult.appId, domain);

      return true;
    } catch (error) {
      console.log('Transaction flow error:', error);
      return false;
    }
  };

  const onTransactionFlowSuccess = async () => {
    setPrimaryDisabled(true);
    const success = await handleTransactionFlow();
    if (success) {
      callbackDomain(domain);
      setPrimaryDisabled(false);
    }

  };

  const primaryButtonText = primaryDisabled ? 'Processing...' : 'Register domain';

  return {
    primaryDisabled,
    primaryButtonText,
    onTransactionFlowSuccess,
  };
};
