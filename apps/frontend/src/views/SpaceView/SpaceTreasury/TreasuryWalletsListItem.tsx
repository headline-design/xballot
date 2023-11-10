import React, { useEffect, useState } from 'react';
import { explorerUrl, shorten } from 'helpers/utils';
import useTreasury from 'composables/useTreasury';
import BaseLink from 'components/BaseComponents/BaseLink';
import { AvatarUser } from 'components/BaseComponents/AvatarUser';
import { Link } from 'react-router-dom';
import IndicatorAssetsChange from 'components/IndicatorAssetsChange';
import { staticEndpoints } from 'utils/endPoints';

const TreasuryWalletsListItem = ({ wallet, domain, handleClick, balances }) => {
  const { loadFilteredTokenBalances, loadingBalances } = useTreasury();

  useEffect(() => {
    loadFilteredTokenBalances(wallet.address);
  }, []);

  const [totalBalance, setTotalBalance] = useState(0);
  const [algoCurrentPrice, setAlgoCurrentPrice] = useState(0);
  const [algoOpenPrice, setAlgoOpenPrice] = useState(0);
  const [algo24hChangePercentage, setAlgo24hChangePercentage] = useState(0);


  useEffect(() => {
    if (!balances?.length) return;
    const sumOfAssets = balances.reduce((sum, asset) => {
      const adjustedAmount = Number(asset.amount);
      const adjustedPrice = Number(asset.price) * adjustedAmount;

      // Extract the Algorand 24-hour change and price
      if (asset.name === 'Algorand') {
        setAlgoCurrentPrice(asset.price);
        setAlgo24hChangePercentage(asset.change_24h);
        setAlgoOpenPrice(asset.open_24h);
      }

      return sum + adjustedPrice;
    }, 0);
    setTotalBalance(sumOfAssets.toFixed(2));
  }, [balances]);

  return (
    <li className="border-b border-skin-border last:border-b-0">
      <Link
        to={`${wallet.address}`}
        onClick={() => handleClick}
        className="flex justify-between whitespace-nowrap px-4 py-[12px]"
      >
        <div className="flex items-center gap-2">
          <AvatarUser
            size="35"
            address={wallet.address}
            src={wallet?.avatar || `${staticEndpoints.stamp}avatar/algo:${wallet.address}?s=100`}
          />
          <div>
            <div data-testid="wallet-name" className="text-md font-semibold text-skin-heading">
              {wallet.name}
            </div>
            <div className="flex items-center space-x-[6px] text-sm text-skin-text">
              {domain && (
                <span data-testid="wallet-ens-address" className="flex items-center">
                  {domain}
                  <div className="ml-1 h-1 w-1 rounded-full bg-skin-text" />
                </span>
              )}
              <BaseLink
                link={explorerUrl(wallet.network, wallet.address)}
                className="!text-skin-text hover:!text-skin-link"
                onClick={(e) => e.stopPropagation()}
              >
                {shorten(wallet.address)}
              </BaseLink>
            </div>
          </div>
        </div>
        {loadingBalances ? (
          <div className="flex flex-col items-end space-y-[12px]">
            <div className="lazy-loading h-3 w-[100px] rounded-md" />
            <div className="lazy-loading h-3 w-[120px] rounded-md" />
          </div>
        ) : (
          <div className="flex flex-col items-end text-right">
            <div className="text-md font-semibold text-skin-text">${totalBalance.toString()}</div>
            <IndicatorAssetsChange
              quote={algoCurrentPrice}
              quote24hPercentage={algoCurrentPrice * (1 + algo24hChangePercentage / 100)}
              quoteOpen={algoOpenPrice}
            />
          </div>
        )}
      </Link>
    </li>
  );
};

export default TreasuryWalletsListItem;
