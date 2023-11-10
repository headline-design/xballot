import React, { createContext, useCallback, useContext, useState } from 'react';

interface LoginModalContextData {
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  isXWalletOpen: boolean;
  setXWalletOpen: (value: boolean) => void;
}

const LoginModalContext = createContext<LoginModalContextData>({
  isLoginModalOpen: false,
  openLoginModal: () => {},
  closeLoginModal: () => {},
  isXWalletOpen: false,
  setXWalletOpen: () => {},
});

const LoginModalProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isXWalletOpen, setIsXWalletOpen] = useState(false);

  const openLoginModal = useCallback(() => {
    setIsXWalletOpen(false);
    setIsLoginModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);

  const setXWalletOpen = useCallback((value: boolean) => {
    setIsXWalletOpen(value);
  }, []);

  return (
    <LoginModalContext.Provider
      value={{
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        isXWalletOpen,
        setXWalletOpen,
      }}
    >
      {children}
    </LoginModalContext.Provider>
  );
};

function useLoginModal(): LoginModalContextData {
  const context = useContext(LoginModalContext);

  if (!context) {
    throw new Error('useLoginModal must be used within a LoginModalProvider');
  }

  return context;
}

export { LoginModalContext, LoginModalProvider, useLoginModal };
