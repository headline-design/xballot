import { useEffect, useState } from 'react';
import { useSetUser } from './useSetUser';
import { useWalletAddress } from './useWalletAddress';

export function useFetcher(apiUrl) {
  const [user, setUser] = useState(null);
  const walletAddress = useWalletAddress();
  const setUserInLocalStorage = useSetUser();

  useEffect(() => {
    if (walletAddress) {
      fetch(`${apiUrl}/profiles/${walletAddress}`)
        .then(response => response.json())
        .then(data => {
          setUser(data);
          setUserInLocalStorage(data);
        });
    }
  }, [walletAddress]);

  return user;
}