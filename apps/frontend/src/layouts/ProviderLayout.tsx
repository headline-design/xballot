import React, { useCallback, Suspense, useState } from 'react';
import { QueryClientProvider } from 'react-query';
import { ThemeProvider } from 'next-themes';
import clsx from 'clsx';
import Sidebar from 'components/Sidebar/Sidebar';
import { FlashNotifications } from 'components/BaseComponents/FlashNotifications';
import { Navbar } from 'components/BaseComponents/Navbar/Navbar';
import { useAppStore } from 'store/useAppStore';
import LoadingProvider from 'components/Loaders/LoadingSpinner2';

const MemoizedSidebar = React.memo(Sidebar);
const MemoizedNavbar = React.memo(Navbar);

interface ProviderLayoutProps {
  queryClient: any;
  GlobalStyle: any;
  children: React.ReactNode;
  upStream: (globalPipeState: any) => void;
  upStreamDomain: (domainData: any) => void;
}

const ProviderLayout: React.FC<ProviderLayoutProps> = ({
  queryClient,
  GlobalStyle,
  children,
  upStream,
  upStreamDomain,
}) => {
  const showSidebar = useAppStore((state) => state.showSidebar);
  const setShowSidebar = useCallback(
    (value: boolean) => useAppStore.getState().setShowSidebar(value),
    [],
  );
  const [loadingState, setLoadingState] = useState(true);
  const handleOverlayClick = useCallback(() => setShowSidebar(false), [setShowSidebar]);

  const [pipeState, setPipeState] = useState({
    myAddress: '',
    checked: true,
    labelNet: '',
  });

  const handleUpStream = (globalPipeState: any) => {
    setPipeState(globalPipeState);
    upStream(globalPipeState);
  };

  const handleUpStreamDomain = (domainData: any) => {
    upStreamDomain(domainData);
  };

  const handleLoadingChange = (isLoading) => {
    setLoadingState(isLoading);
  };

  return (
    <React.StrictMode>
      <ThemeProvider>
        <Suspense fallback={<LoadingProvider />}>
          <QueryClientProvider client={queryClient}>
            <GlobalStyle />
            <div id="app" data-v-app="" className="transition-all">
              <div className="flex min-h-screen">
                <div id="sidebar" className="flex flex-col">
                  <div
                    className={clsx(
                      'sticky top-0 z-40 h-screen overflow-hidden bg-skin-bg transition-all sm:w-[60px]',
                      { 'max-w-0 sm:max-w-none': !showSidebar },
                    )}
                  >
                    <MemoizedSidebar
                      className="border-r border-skin-border"
                      showSidebar={() => setShowSidebar(false)}
                      loading={loadingState}
                    />
                  </div>
                </div>
                <div className="relative flex w-screen min-w-0 shrink-0 flex-col sm:w-auto sm:shrink sm:grow">
                  {showSidebar && (
                    <div
                      className="absolute bottom-0 left-0 right-0 top-0 z-50 bg-skin-bg opacity-60"
                      onClick={handleOverlayClick}
                    />
                  )}
                  <div
                    id="navbar"
                    className="sticky top-0 z-40 border-b border-skin-border bg-skin-bg"
                  >
                    <MemoizedNavbar
                      upStream={handleUpStream}
                      upStreamDomain={handleUpStreamDomain}
                      onLoadingChange={handleLoadingChange}
                    />
                  </div>
                  {children}
                </div>
              </div>
              <FlashNotifications />
            </div>
          </QueryClientProvider>
        </Suspense>
      </ThemeProvider>
    </React.StrictMode>
  );
};

export default React.memo(ProviderLayout);
