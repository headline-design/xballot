import React from 'react';
import { AboutNavbar } from './components/AboutNavbar';

export const useNavbar = (selectedAboutViewIndex, aboutViews) => {
  const AboutNavbarComponent = (selectedAboutViewIndex === 0 ||
    selectedAboutViewIndex === 1 ||
    selectedAboutViewIndex === 2 ||
    selectedAboutViewIndex === 3) && (
    <AboutNavbar
      aboutViews={aboutViews}
      selectedAboutViewIndex={selectedAboutViewIndex}
    />
  );

  return { AboutNavbarComponent };
};
