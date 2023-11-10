import { getAppIdFromDomain, getSettingsObject } from 'orderFunctions';
import { useEffect, useState } from 'react';
import { getTreasuryBalances } from 'utils/functions';
import { TreasuryWallet } from 'helpers/interfaces';

const CACHE_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes cache expiry time

const TOKEN_LIST = [
  '0', // example token address 1
  '1', // example token address 2
  '137594422', // example token address 3
  '10458941',
];

interface LocalSpaceTreasury {
  address: string;
  balances: LocalSpaceTreasury[];
  assetId: any;
  amount: any;
  name: any;
  unitName: any;
  decimals: any;
  price: any;
  balance: number;
  network: any;
  lastRefreshTime?: number;
}

interface LocalSpaceTreasuries {
  treasuries: LocalSpaceTreasury[];
}

const useTreasury = () => {
  const [treasuryAssets, setTreasuryAssets] = useState<Record<string, LocalSpaceTreasury[]>>({});
  const [spaceTreasuries, setSpaceTreasuries] = useState<TreasuryWallet[]>([]);
  const [loadingBalances, setLoadingBalances] = useState<boolean>(false);
  const [addresses, setAddresses] = useState<string[]>([]);

  useEffect(() => {
    const getApp = async () => {
      const dArray = window.location.href.split('/');
      const domain = dArray[3];

      let appId;
      try {
        appId = await getAppIdFromDomain(domain);
      } catch (error) {
        console.error('Failed to fetch appId:', error);
        return;
      }

      if (appId !== undefined && appId !== 'undefined') {
        let settings: LocalSpaceTreasuries;
        try {
          settings = await getSettingsObject(appId);
        } catch (error) {
          console.error('Failed to fetch settings:', error);
          return;
        }

        const addrs: string[] = settings.treasuries.map((entry: { address: string }) => entry.address);

        setAddresses(addrs);

        const cachedTreasuryAssets: Record<string, LocalSpaceTreasury[]> = {};
        const updatedTreasuryAssets: Record<string, LocalSpaceTreasury[]> = {};

        for (let i = 0; i < settings.treasuries.length; i++) {
          const address = settings.treasuries[i].address;

          const cachedBalance = localStorage.getItem(`${domain}.treasuries.${address}`);
          const parsedBalance: LocalSpaceTreasury[] = JSON.parse(cachedBalance);
          const lastRefreshTime = parsedBalance?.[0]?.lastRefreshTime || 0;
          const elapsedTime = Date.now() - lastRefreshTime;

          if (cachedBalance && elapsedTime <= CACHE_EXPIRY_TIME) {
            cachedTreasuryAssets[address] = parsedBalance;
          } else {
            const thisBalance: LocalSpaceTreasury[] = await getTreasuryBalances(
              address,
              TOKEN_LIST,
              true,
            );
            thisBalance.forEach((balance) => {
              balance.lastRefreshTime = Date.now(); // Record the last refresh time
            });
            updatedTreasuryAssets[address] = thisBalance;

            // Update local storage with new cached results for each treasury
            localStorage.setItem(
              `${domain}.treasuries.${address}`,
              JSON.stringify(thisBalance),
            );
          }
        }

        setTreasuryAssets((prevState) => ({
          ...prevState,
          ...cachedTreasuryAssets,
        }));
        setSpaceTreasuries(
          settings.treasuries.map((t: LocalSpaceTreasury) => ({
            ...t,
            balances: t.balances || [],
            lastRefreshTime: t.lastRefreshTime || Date.now(),
          })),
        );

        if (Object.keys(updatedTreasuryAssets).length > 0) {
          setTreasuryAssets((prevState) => ({
            ...prevState,
            ...updatedTreasuryAssets,
          }));
        }
      }
    };

    getApp();
  }, []);

  const loadFilteredTokenBalances = async (address: string) => {
    if (treasuryAssets[address]) {
      return treasuryAssets[address];
    }

    try {
      setLoadingBalances(true);

      const domain = window.location.href.split('/')[3];

      const cachedBalance = localStorage.getItem(`${domain}.treasuries.${address}`);
      const parsedBalance: LocalSpaceTreasury[] = JSON.parse(cachedBalance);
      const lastRefreshTime = parsedBalance?.[0]?.lastRefreshTime || 0;
      const elapsedTime = Date.now() - lastRefreshTime;

      if (cachedBalance && elapsedTime <= CACHE_EXPIRY_TIME) {
        return parsedBalance;
      }

      const balances = await getTreasuryBalances(address, TOKEN_LIST)
        .then(
          (balances) =>
            balances?.filter((balance) => TOKEN_LIST?.includes(balance.assetId.toString())) || [],
        )
        .catch(() => []);

      if (balances) {
        setTreasuryAssets((prevState) => ({
          ...prevState,
          [address]: balances as LocalSpaceTreasury[],
        }));

        localStorage.setItem(`${domain}.treasuries.${address}`, JSON.stringify(balances));
      }

      return balances;
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingBalances(false);
    }
  };

  const resetTreasuryAssets = () => {
    const domain = window.location.href.split('/')[3];
    Object.keys(treasuryAssets).forEach((address) => {
      localStorage.removeItem(`${domain}.treasuries.${address}`);
    });
    setTreasuryAssets({});
  };

  return {
    loadFilteredTokenBalances,
    resetTreasuryAssets,
    treasuryAssets: Object.values(treasuryAssets),
    loadingBalances,
    spaceTreasuries,
  };
};

export default useTreasury;
