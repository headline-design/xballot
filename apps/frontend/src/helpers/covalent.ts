import { getJSON } from './utils';

const API_URL = '';
const API_KEY = '';
export const ALGO_CONTRACT = '';

export async function getTokenBalances(address: string, chainId: string): Promise<any[] | null> {
  const tokenBalanceUrl = `${API_URL}/${chainId}/address/${address}/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=true&key=${API_KEY}`;
  const tokenBalances = await getJSON(tokenBalanceUrl);

  const validTokenBalances = tokenBalances.data.items.filter(
    (item) => item.contract_name && item.contract_ticker_symbol && item.logo_url && item.quote,
  );

  // If there is an ether item, move it to the top of the list
  const algoItem = validTokenBalances.find((item) => item.contract_address === ALGO_CONTRACT);
  if (algoItem) {
    const index = validTokenBalances.findIndex((item) => item.contract_address === ALGO_CONTRACT);
    validTokenBalances.splice(index, 1);
    validTokenBalances.unshift(algoItem);
  }

  return validTokenBalances;
}

export async function getTokenPrices(contract: string, chainId: string): Promise<any> {
  const tokenPricesUrl = `${API_URL}/pricing/historical_by_addresses_v2/${chainId}/USD/${contract}/?quote-currency=USD&format=JSON&key=${API_KEY}`;
  return await getJSON(tokenPricesUrl);
}
