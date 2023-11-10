import { useEffect, useState } from 'react';

// Example
//  const address = useWalletAddress();
// console.log(address)

export function useWalletAddress() {
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    const url = window.location.href;
    const parts = url.split('/');
    const address = parts.find((part) => part.length === 58);
    if (address) {
      setWalletAddress(address);
    }
  }, []);

  return walletAddress;
}

export function useWalletDomain() {
  const [walletDomain, setWalletDomain] = useState('');

  useEffect(() => {
    const url = window.location.href;
    const parts = url.split('/');
    const domain = parts.find((part) => part.includes('algo')); // use includes instead of strict equality check
    if (domain) {
      setWalletDomain(domain);
    }
  }, [setWalletDomain]); // add setWalletDomain as a dependency to useEffect

  return walletDomain;
}
