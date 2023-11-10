import Pipeline, { Escrow } from '@pipeline-ui-2/pipeline/index.js';
import { isOptedButton } from 'orderFunctions';

interface TransactionFunction {
  (
    openLoginModal: () => void,
    setXWalletOpen: (open: boolean) => void,
    id: string,
    setLoading: (loading: boolean) => void,
    onSuccess: (txId: string) => void,
    onSubmitting: (txId: string) => void,
    onError: (errorMessage: string) => void,
    openModal: boolean,
    openBody: boolean,
    openTransactionModal: (txId: string, onSuccess: () => void, emptyString: string) => void,
    openTransactionBody: (txId: string, onSuccess: () => void, emptyString: string) => void,
    pipeState?: any,
  ): Promise<void>;
}

export interface Functions {
  optInToApp: TransactionFunction;
  optInToAsset: TransactionFunction;
  sendTransaction: (
    openLoginModal: () => void,
    setXWalletOpen: (open: boolean) => void,
    amount: number,
    assetId: string,
    recipient: string,
    setLoading: (loading: boolean) => void,
    onSuccess: (txId: string) => void,
    onSubmitting: (txId: string) => void,
    onError: (errorMessage: string) => void,
    openModal: boolean,
    openBody: boolean,
    openTransactionModal: (txId: string, onSuccess: () => void, emptyString: string) => void,
    openTransactionBody: (txId: string, onSuccess: () => void, emptyString: string) => void,
    pipeState?: any,
  ) => Promise<void>;
}

const optInToApp: TransactionFunction = async (
  openLoginModal,
  setXWalletOpen,
  appId,
  setLoading,
  onSuccess,
  onSubmitting,
  onError,
  openModal,
  openBody,
  openTransactionModal,
  openTransactionBody,
  pipeState,
) => {
  setLoading(true);
  try {
    if (pipeState.provider === 'escrow' && !Escrow.address) {
      openLoginModal();
      setXWalletOpen(true);
      return;
    }
    const isOptedIn = await isOptedButton(Pipeline.address, appId);
    console.log('isOptedIn', isOptedIn);
    if (!isOptedIn) {
      let txId = await Pipeline.optIn(appId, ['register']);
      if (txId) {
        console.log('---TXN ID 2 ' + txId);
        const modalProps = {
          onSuccess: () => onSuccess(txId),
        };
        onSubmitting(txId);
        if (openModal) {
          openTransactionModal(txId, modalProps.onSuccess, '');
        } else if (openBody) {
          openTransactionBody(txId, modalProps.onSuccess, '');
        }
      } else {
        onError('Error occurred');
        console.log('Error occurred', txId);
      }
    } else {
      console.log('Already opted in');
    }
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

const optInToAsset: TransactionFunction = async (
  openLoginModal,
  setXWalletOpen,
  assetId,
  setLoading,
  onSuccess,
  onSubmitting,
  onError,
  openModal,
  openBody,
  openTransactionModal,
  openTransactionBody,
  pipeState,
) => {
  setLoading(true);
  try {
    if (pipeState.provider === 'escrow' && !Escrow.address) {
      openLoginModal();
      setXWalletOpen(true);
      return;
    }
    let txId = await Pipeline.send(Pipeline.address, 0, '', undefined, undefined, assetId);
    if (txId) {
      console.log('---TXN ID ' + txId);
      const modalProps = {
        onSuccess: () => onSuccess(txId),
      };
      onSubmitting(txId);
      if (openModal) {
        openTransactionModal(txId, modalProps.onSuccess, '');
      } else if (openBody) {
        openTransactionBody(txId, modalProps.onSuccess, '');
      }
    } else {
      onError('Error occurred');
      console.log('Error occurred', txId);
    }
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

const sendTransaction: Functions['sendTransaction'] = async (
  openLoginModal,
  setXWalletOpen,
  recipient,
  amount,
  assetId,
  setLoading,
  onSuccess,
  onSubmitting,
  onError,
  openModal,
  openBody,
  openTransactionModal,
  openTransactionBody,
  pipeState,
) => {
  setLoading(true);
  try {
    if (pipeState.provider === 'escrow' && !Escrow.address) {
      openLoginModal();
      setXWalletOpen(true);
      return;
    }
    console.log('data', recipient, amount, assetId);
    let txId = await Pipeline.send(recipient, parseInt(amount), '', undefined, undefined, assetId);
    if (txId) {
      console.log('TXN ID 2 ' + txId);
      const modalProps = {
        onSuccess: () => onSuccess(txId),
      };
      onSubmitting(txId);
      if (openModal) {
        openTransactionModal(txId, modalProps.onSuccess, '');
      } else if (openBody) {
        openTransactionBody(txId, modalProps.onSuccess, '');
      }
    } else {
      onError('Error occurred');
      console.log('Error occurred', txId);
    }
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

export { optInToAsset, optInToApp, sendTransaction };
