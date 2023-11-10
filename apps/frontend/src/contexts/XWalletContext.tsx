import React, { createContext, useState, useContext } from 'react';

interface XWalletContextData {
  isWalletUnlocked: boolean;
  setIsWalletUnlocked: (value: boolean) => void;
}

export const XWalletContext = createContext<XWalletContextData>({
  isWalletUnlocked: false,
  setIsWalletUnlocked: () => {},
});

export const XWalletProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [isWalletUnlocked, setIsWalletUnlocked] = useState(false);

  return (
    <XWalletContext.Provider value={{ isWalletUnlocked, setIsWalletUnlocked }}>
      {children}
    </XWalletContext.Provider>
  );
};

export const useXWallet = () => useContext(XWalletContext);
