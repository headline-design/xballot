import { ThemeProvider } from 'next-themes';
import { Suspense } from 'react';
import React from 'react';
import { QueryClientProvider } from 'react-query';

interface ProviderLayoutProps {
  queryClient: any;
  GlobalStyle: any;
  children: any;
}

const ProviderLayout: React.FC<ProviderLayoutProps> = ({ queryClient, GlobalStyle, children }) => {
  return (
    <>
      <Suspense>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <GlobalStyle />
            <Suspense>
              <>
               {children}
              </>
            </Suspense>
          </QueryClientProvider>
        </ThemeProvider>
      </Suspense>
    </>
  );
};

export default React.memo(ProviderLayout);
