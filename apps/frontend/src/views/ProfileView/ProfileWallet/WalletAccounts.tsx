import React, { useCallback, useMemo, useState } from 'react';
import { Block } from 'components/BaseComponents/Block';
import { LoadingRow } from 'components/BaseComponents/BaseLoading/LoadingRow';
import { Button } from 'components/BaseComponents/Button';
import ProfileWalletInfo from './Components/ProfileWalletInfo';
import WalletListItem from './Components/WalletListItem';
import WalletExpandedAccount from './WalletAccount';

const WalletAccounts = ({ loading, pipeState, domainData }) => {
  const MemoizedProfileWalletInfo = React.memo(ProfileWalletInfo);
  const MemoizedWalletListItem = React.memo(WalletListItem);
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

  const processedWallets = useMemo(
    () => [
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
    ],
    [pipeState, domainData],
  );

  const [walletExpanded, setWalletExpanded] = useState(false);
  const [expandedDomain, setExpandedDomain] = useState(null);

  const handleExpand = (wallet) => {
    console.log('expanding');
    setExpandedDomain(wallet);
    setWalletExpanded(true);
  };

  return (
    <div id="content-right" className="relative float-right w-full pl-0 lg:w-3/4 lg:pl-5">
      {loading ? (
        <LoadingRow />
      ) : (
        <>
          <MemoizedProfileWalletInfo info="The XBallot hot wallet is an experimental feature. Use at your own risk." />
          {processedWallets.length > 0 && !walletExpanded && (
            <div className="mb-3 text-center">
              <Block className="pt-1" title="Wallet(s)">
                {processedWallets.map((wallet, index) => (
                  <>
                    <MemoizedWalletListItem
                      key={index}
                      pipeState={wallet}
                      wallet={wallet}
                      expand={() => handleExpand(wallet)}
                    />
                  </>
                ))}
                <Button className="w-full" onClick={handleOpenModal}>
                  Add Wallet
                </Button>
              </Block>
            </div>
          )}
          {processedWallets.length > 0 && walletExpanded && (
            <>
              <WalletExpandedAccount pipeState={pipeState} wallet={expandedDomain} />
              <div className="px-4 md:px-0">
                <Button
                  className="button  mt-4 w-full px-[22px]"
                  onClick={() => setWalletExpanded(false)}
                >
                  Back
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default WalletAccounts;
