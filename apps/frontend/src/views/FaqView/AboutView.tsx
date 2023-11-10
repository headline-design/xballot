import React, { useMemo, useContext, useState } from 'react';
import TokenWallpaper from './components/TokenWallpaper';
import AlgorandGovernance from './AlgorandView';
import Footer from './components/Footer';
import { useLocation, Routes, Route } from 'react-router-dom';
import OverviewView from './OverviewView';
import { useNavbar } from './useNavbar';
import TokenomicsView from './TokenomicsView';
import RoadmapView from './RoadmapView';

const AboutView = () => {
  const location = useLocation();
  const { pathname } = location;

  const aboutViews = useMemo(
    () => [
      { label: 'Overview', link: '', value: '0', end: true },
      { label: 'Tokenomics', link: 'tokenomics', value: '1', end: true },
      { label: 'Roadmap', link: 'roadmap', value: '2', end: true },
      { label: 'Algorand governace', link: 'algorand-governance', value: '3', end: true },
    ],
    [],
  );

  const selectedAboutViewIndex = useMemo(() => {
    const path = pathname.split('/')[2] || '';
    return aboutViews.findIndex((view) => view.link === path);
  }, [pathname, aboutViews]);

  const { AboutNavbarComponent } = useNavbar(selectedAboutViewIndex, aboutViews);

  const ROUTE_PATHS = {
    about: {
      base: '/',
      tokenomics: '/tokenomics',
      roadmap: '/roadmap',
      algorand: '/algorand-governance',
    },
  };

  return (
    <>
      <div id="app" data-v-app="">
        <div>
          <TokenWallpaper route={selectedAboutViewIndex} />
          {AboutNavbarComponent}
          <div id="content" className="flex h-full min-h-screen bg-skin-bg pt-[40px]">
            <div className="mx-auto w-full max-w-[1012px] border-l bg-gradient-to-r from-skin-bg to-transparent px-4 pl-0">
              <Routes>

                <Route path={ROUTE_PATHS.about.base} element={<OverviewView />} />
                <Route path={ROUTE_PATHS.about.roadmap} element={<RoadmapView />} />
                <Route path={ROUTE_PATHS.about.algorand} element={<AlgorandGovernance />} />
                <Route path={ROUTE_PATHS.about.tokenomics} element={<TokenomicsView />} />
              </Routes>
            </div>
          </div>
          <Footer />
        </div>
        <div className="pointer-events-none fixed left-0 right-0 bottom-0 z-[60] mb-4 flex flex-col items-center space-y-2" />
      </div>
    </>
  );
};

export default AboutView;
