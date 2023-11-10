import { walletUtils } from './Components/WalletUtils';
import React, { useState } from 'react';
import { Block } from 'components/BaseComponents/Block';
import { LoadingRow } from 'components/BaseComponents/BaseLoading/LoadingRow';
import { Button } from 'components/BaseComponents/Button';
import ProfileWalletInfo from './Components/ProfileWalletInfo';
import WalletListItem from './Components/WalletListItem';
import Pipeline, { Escrow } from '@pipeline-ui-2/pipeline/index.js';

const WalletRewards = ({ loading, pipeState, domainData }) => {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleOpenModal = (event) => {
    event.preventDefault();
    openModal();
  };

  const processedWallets = [
    {
      address: pipeState.myAddress,
      name: domainData?.name || 'Wallet 1',
      asset: pipeState.myAsset || 'No asset',
      domain: pipeState.myDomain || 'No domain',
      network: pipeState.isMainnet ? 'Algorand Mainnet' : 'Algorand Testnet',
      params: {
        address: pipeState.myAddress || 'No address',
        name: pipeState.myName || 'Wallet 1',
      },
    },
  ];

  return (
    <div id="content-right" className="relative float-right w-full pl-0 lg:w-3/4 lg:pl-5">
      {loading ? (
        <LoadingRow />
      ) : (
        <>
          <div className="mb-3 text-center">
            <ProfileWalletInfo info="The XBallot hot wallet is an experimental feature. Use at your own risk." />
            <Block className="pt-1" title="Wallet(s)">
              {processedWallets.map((wallet, index) => (
                <WalletListItem key={index} pipeState={wallet} wallet={wallet} />
              ))}
              <Button className="w-full" onClick={handleOpenModal}>
                Add Wallet
              </Button>
            </Block>
          </div>
        </>
      )}
    </div>
  );
}

export default WalletRewards;
