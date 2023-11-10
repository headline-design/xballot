import React from 'react';
import Navbar from './Navbar';


interface AboutNavbarProps {
  aboutViews: any[];
  selectedAboutViewIndex: number;
}

export const AboutNavbar: React.FC<AboutNavbarProps> = React.memo(
  ({ aboutViews, selectedAboutViewIndex }) => {
    let filteredAboutViews = aboutViews;

    return (
      <>
        <Navbar
          link={filteredAboutViews}
          items={filteredAboutViews}
          value={selectedAboutViewIndex}
        />
      </>
    );
  },
);
