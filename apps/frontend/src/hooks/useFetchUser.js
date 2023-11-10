import { useEffect, useState } from 'react';
import { useSetUser } from './useSetUser';
import { useWalletAddress } from './useWalletAddress';

export function useFetchUser() {
  const [user, setUser] = useState(null);
  const walletAddress = useWalletAddress();
  const setUserInLocalStorage = useSetUser();

  useEffect(() => {
    if (walletAddress) {
      const userData = localStorage.getItem(walletAddress);
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, [walletAddress]);

  return user;
}