import React, { useState, useEffect } from 'react';
import { Block } from 'components/BaseComponents/Block';
import NoResults from './NoResults';
import TreasuryAssetsList from './TreasuryAssetsList';
import { TreasuryWalletsList } from './TreasuryWalletstList';
import useTreasury from 'composables/useTreasury';

export interface SelectedWallet {
  id?: number;
  address?: string;
  name?: string;
  network?: number;
  balances?: {
    algo: number;
    assets: Record<string, number>;
  };
}

function SpaceTreasury({ appId, space }) {
  const [selectedWallet, setSelectedWallet] = useState<SelectedWallet>();
  const [localSpaceTreasuries, setLocalSpaceTreasuries] = useState([]);
  const { loadingBalances, spaceTreasuries } = useTreasury();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (spaceTreasuries?.length > 0) {
      setLocalSpaceTreasuries(spaceTreasuries);
      setLoading(false);
    }
  }, [spaceTreasuries]);

  const handleClick = () => {
    setSelectedWallet(spaceTreasuries?.[0]);
  };

  //console.log(localSpaceTreasuries);

  return (
    <div id="content-right" className="relative float-right w-full pl-0 lg:w-3/4 lg:pl-5">
      {loading ? (
        <Block>
          <div className="lazy-loading mb-2 rounded-md" style={{ width: '60%', height: 28 }} />
          <div className="lazy-loading rounded-md" style={{ width: '50%', height: 28 }} />
        </Block>
      ) : localSpaceTreasuries?.length > 0 ? (
        <>
          <div className="mb-3 flex px-4 md:px-0">
            <h2>Treasury</h2>
          </div>

          {localSpaceTreasuries?.length === 0 && <NoResults space={space} />}
          {localSpaceTreasuries?.length > 0 && (
            <div>
              <div className="my-4 space-y-4">
                {selectedWallet ? (
                  <TreasuryAssetsList />
                ) : (
                  <TreasuryWalletsList
                    wallets={localSpaceTreasuries}
                    handleClick={handleClick}
                    admins={[]}
                  />
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <NoResults space={space} />
      )}
    </div>
  );
}

export default SpaceTreasury;
