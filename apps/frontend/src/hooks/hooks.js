import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * A custom hook that builds on useLocation to parse the query string for you.
 */
export function useUrlQueryParams() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export function useUrlHash() {
  const { hash } = useLocation();
  return useMemo(() => new URLSearchParams(hash), [hash]);
}
