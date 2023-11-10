import { useState } from 'react';
import { handleAppTransaction, handleAssetCreateTransaction, handleOptInTransaction, handlePaymentTransaction } from './useRegistrar';

// Interface for the App Transaction Result
interface AppTransactionResult {
  appId: string; // Replace with the correct type
}

// Interface for the Payment Transaction Result
interface PaymentTransactionResult {
  paymentId: string; // Replace with the correct type
}

// Interface for the Asset Create Transaction Result
interface AssetCreateTransactionResult {
  assetId: string; // Replace with the correct type
}

// Interface for the useTransactionFlow function's parameters
interface UseTransactionFlowProps {
  domain: string; // Replace with the correct type if needed
  callbackAppId: (appId: string) => void; // Replace with the correct type if needed
  callbackDomain: (domain: string) => void;
  callbackAssetId: (assetId: string) => void; // Replace with the correct type if needed
}

export const useTransactionFlow = ({ domain, callbackAppId, callbackDomain, callbackAssetId }: UseTransactionFlowProps) => {
  const [primaryDisabled, setPrimaryDisabled] = useState(false);

  const handleTransactionFlow = async () => {
    try {
      const appResult: AppTransactionResult = await handleAppTransaction(domain);
      callbackAppId(appResult.appId);

      const paymentResult: PaymentTransactionResult = await handlePaymentTransaction(domain);

      const assetResult: AssetCreateTransactionResult = await handleAssetCreateTransaction(paymentResult.paymentId, appResult.appId, domain);
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
