import 'styles/style.scss';
import 'styles/template.scss';
import Pipeline from "@pipeline-ui-2/pipeline/index";
import { CHAIN_NETWORK_KEY } from './utils/constants/common';
import localStore from 'store';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from 'App';

export default function AppProvider() {
  const chainNetworkValue = localStore.get(CHAIN_NETWORK_KEY);
  const isNetworkMainnet = process.env.REACT_APP_NETWORK_TYPE === 'mainnet';

  Pipeline.main = chainNetworkValue === null ? isNetworkMainnet : chainNetworkValue;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Adjust based on your needs
        refetchOnWindowFocus: false, // Adjust based on your needs
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <App queryClient={queryClient} />
    </QueryClientProvider>
  );
}
