import { useCallback } from 'react';

export function useSetUser() {
  return useCallback((user) => {
    if (user && user.walletAddress) {
      localStorage.setItem(user.walletAddress, JSON.stringify(user));
    }
  }, []);
}