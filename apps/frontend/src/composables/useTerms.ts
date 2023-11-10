import { useState, useEffect } from 'react';
import { lsSet, lsGet } from 'helpers/utils';

export function useTerms(spaceKey) {
  const [modalTermsOpen, setModalTermsOpen] = useState(false);
  const [acceptedSpaces, setAcceptedSpaces] = useState(JSON.parse(lsGet('acceptedTerms', '[]')));
  const [termsAccepted, setTermsAccepted] = useState(acceptedSpaces.includes(spaceKey));

  useEffect(() => {
    setTermsAccepted(acceptedSpaces.includes(spaceKey));
  }, [acceptedSpaces, spaceKey]);

  function acceptTerms() {
    const updatedAcceptedSpaces = [...acceptedSpaces, spaceKey];
    setAcceptedSpaces(updatedAcceptedSpaces);
    lsSet('acceptedTerms', JSON.stringify(updatedAcceptedSpaces));
    setTermsAccepted(true);
  }

  return { modalTermsOpen, setModalTermsOpen, termsAccepted, acceptTerms };
}
