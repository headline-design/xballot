import { useEffect, useState } from 'react';

export function useSpaceDomain() {
  const [spaceDomain, setSpaceDomain] = useState('');

  useEffect(() => {
    const url = window.location.href;
    const parts = url.split('/');
    const spaceKey = parts[parts.length - 1]; // get last part of the URL
    if (spaceKey) {
      setSpaceDomain(spaceKey);
    }
  }, []);

  return spaceDomain;
}
