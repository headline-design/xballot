import React, { createContext, useCallback, useContext, useState } from 'react';

interface TransactionModalContextData {
  isTransactionModalOpen: boolean;
  isTransactionBodyOpen: boolean;
  isTransactionModal: boolean;
  openTransactionModal: (txId: string, onSuccess: () => void, navigationLink?: string) => void;
  openTransactionBody: (txId: string, onSuccess: () => void, navigationLink?: string) => void;
  closeTransactionModal: () => void;
  resetTransactionState: () => void; // Added function to reset the transaction state
}

interface ModalProps {
  open: boolean;
  onSuccess: () => void;
  txId?: string;
  navigationLink?: string;
}

interface TransactionModalContextProps extends TransactionModalContextData {
  modalProps: ModalProps | null;
  txId: string;
  navigationLink?: string;
}

const TransactionModalContext = createContext<TransactionModalContextProps>({
  isTransactionModalOpen: false,
  isTransactionBodyOpen: false,
  isTransactionModal: null,
  openTransactionModal: () => {},
  closeTransactionModal: () => {},
  openTransactionBody: () => {},
  resetTransactionState: () => {}, // Initial empty implementation for resetTransactionState
  modalProps: null,
  navigationLink: '',
  txId: '',
});

const TransactionModalProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [modalProps, setModalProps] = useState<ModalProps | null>(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isTransactionBodyOpen, setIsTransactionBodyOpen] = useState(false);
  const [isTransactionModal, setIsTransactionModal] = useState(null);
  const [txId, setTxId] = useState('');
  const [navigationLink, setNavigationLink] = useState('');

  const openTransactionModal = useCallback(
    (txId: string, onSuccess: () => void, navigationLink?: string) => {
      setIsTransactionModal(true);
      setIsTransactionModalOpen(true);
      setNavigationLink(navigationLink);
      setModalProps({ open: true, txId, onSuccess, navigationLink });
      setTxId(txId);
    },
    [],
  );

  const closeTransactionModal = useCallback(() => {
    setIsTransactionModalOpen(false);
    setModalProps(null);
    setTxId('');
  }, []);

  const openTransactionBody = useCallback(
    (txId: string, onSuccess: () => void, navigationLink?: string) => {
      setIsTransactionModal(false);
      setIsTransactionBodyOpen(true);
      setNavigationLink(navigationLink);
      setModalProps({ open: true, txId, onSuccess, navigationLink });
      setTxId(txId);
    },
    [],
  );

  const resetTransactionState = useCallback(() => {
    setIsTransactionModal(false);
    setIsTransactionModalOpen(false);
    setIsTransactionBodyOpen(false);
    setModalProps(null);
    setTxId('');
    setNavigationLink('');
  }, []);

  return (
    <TransactionModalContext.Provider
      value={{
        isTransactionModal,
        isTransactionModalOpen,
        isTransactionBodyOpen,
        openTransactionModal,
        openTransactionBody,
        closeTransactionModal,
        resetTransactionState,
        modalProps,
        navigationLink,
        txId,
      }}
    >
      {children}
    </TransactionModalContext.Provider>
  );
};

function useTransactionModal(): TransactionModalContextData {
  const context = useContext(TransactionModalContext);

  if (!context) {
    throw new Error('useTransactionModal must be used within a TransactionModalProvider');
  }

  return context;
}

export { TransactionModalContext, TransactionModalProvider, useTransactionModal };
