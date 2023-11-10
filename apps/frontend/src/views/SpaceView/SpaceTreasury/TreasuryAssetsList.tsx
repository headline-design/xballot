import useTreasury from 'composables/useTreasury';
import { useEffect, useState } from 'react';
import { TreasuryWallet } from 'helpers/interfaces';
import { BackButton } from 'components/BaseComponents/BackButton';
import { Block } from 'components/BaseComponents/Block';
import TreasuryAssetsListItem from './TreasuryAssetsListItem';
import { Link, useParams } from 'react-router-dom';

const TreasuryAssetsList = () => {
  const { spaceTreasuries, loadFilteredTokenBalances, loadingBalances } =
    useTreasury();
  const { treasuryKey, spaceKey } = useParams<{ treasuryKey: string, spaceKey: any }>();
  const [walletAssets, setWalletAssets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState<TreasuryWallet>();

  useEffect(() => {
    if (spaceTreasuries && spaceTreasuries.length > 0) {
      const wallet = spaceTreasuries.find((treasury) => treasury.address === treasuryKey);
      setSelectedWallet(wallet);
    }
  }, [spaceTreasuries, treasuryKey]);

  useEffect(() => {
    const fetchWalletAssets = async () => {
      if (selectedWallet) {
        const assets = await loadFilteredTokenBalances(
          selectedWallet.address,
        );
        setWalletAssets(assets);
      }
    };

    fetchWalletAssets();
  }, [selectedWallet, loadFilteredTokenBalances]);

  return (
    <>
      <div id="content-right" className="relative float-right w-full pl-0 lg:w-3/4 lg:pl-5">
        {loadingBalances ? (
          <Block>
            <div className="lazy-loading mb-2 rounded-md" style={{ width: '60%', height: 28 }} />
            <div className="lazy-loading rounded-md" style={{ width: '50%', height: 28 }} />
          </Block>
        ) : (
          <>
            <div className="mb-3 px-4 md:px-0">
              <Link to={`/${spaceKey}/treasury`}>
                <BackButton />
              </Link>
              <h3>{selectedWallet?.name}</h3>
            </div>
            <Block
              title="Assets"
              counter={walletAssets?.length}
              label="24h Change"
              loading={loadingBalances}
              slim
            >
              {walletAssets?.length ? (
                <ul>
                  {walletAssets?.map((asset) => (
                    <TreasuryAssetsListItem key={asset?.assetId} asset={asset} />
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center">No assets found</div>
              )}
            </Block>
          </>
        )}
      </div>
    </>
  );
};

export default TreasuryAssetsList;
