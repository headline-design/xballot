import { PeraIcon } from 'icons/PeraIcon';
import { Modal } from 'components/BaseComponents/Modal';
import { getEndpoints, getTerms } from 'utils/endPoints';
import { FlameIcon } from 'icons/Flame';
import { PasswordModal } from 'views/ProfileView/ProfileWallet/Components/PasswordModal';
import { useLoginModal } from 'contexts/LoginModalContext';
import { NavbarNotice } from './NavbarNotice';
import { NavbarAccountDetails } from './NavbarAccountDetails';
import { NavbarButtonRow } from './NavbarButtonRow';
import { NavbarWalletButton } from './NavbarWalletButton';
import React from 'react';

export default function NavbarModal({
  domainData,
  closeModal,
  isOpen,
  connected,
  PipeConnectors,
  pipeState,
  Pipeline,
  switchWallet,
  disconnectWallet,
  viewProfile,
  viewAbout,
  reload,
  ...props
}) {
  const endPoints = getEndpoints();
  const terms = getTerms();
  const { isXWalletOpen, setXWalletOpen } = useLoginModal();

  const MemoizedNavbarNotice = React.memo(NavbarNotice);
  const MemoizedNavbarAccountDetails = React.memo(NavbarAccountDetails);
  const MemoizedNavbarButtonRow = React.memo(NavbarButtonRow);
  const MemoizedNavbarWalletButton = React.memo(NavbarWalletButton);

  const handleClose = () => {
    closeModal();
  };

  const wallets = [
    {
      name: 'Pera Wallet',
      id: 'PeraWallet',
      icon: <PeraIcon />,
      connector: 'PeraWallet',
    },
    {
      name: 'MyAlgo Wallet',
      id: 'MyAlgoWallet',
      icon: <img width={25} height={25} src="/wallet-icons/MyAlgoWallet.svg" alt="Icon" />,
      connector: 'MyAlgoWallet',
    },
    {
      name: 'X Wallet',
      id: 'XWallet',
      icon: <FlameIcon />,
      connector: 'XWallet',
    },
  ];

  return (
    <Modal onClose={handleClose} open={isOpen} title={!connected ? 'Connect wallet' : 'Account'}>
      {isXWalletOpen ? (
        <PasswordModal
          setIsXWalletOpen={setXWalletOpen}
          PipeConnectors={PipeConnectors}
          switchWallet={switchWallet}
        />
      ) : (
        <>
          <div className="modal-body">
            <MemoizedNavbarNotice connected={connected} terms={terms} />
            {!connected ? (
              <>
                <MemoizedNavbarWalletButton
                  wallets={wallets}
                  PipeConnectors={PipeConnectors}
                  switchWallet={switchWallet}
                  Pipeline={Pipeline}
                  setXWalletOpen={setXWalletOpen}
                />
              </>
            ) : (
              <MemoizedNavbarAccountDetails
                endPoints={endPoints}
                domainData={domainData}
                pipeState={pipeState}
              />
            )}
          </div>
          <MemoizedNavbarButtonRow
            connected={connected}
            disconnectWallet={disconnectWallet}
            viewProfile={viewProfile}
            viewAbout={viewAbout}
            reload={reload}
          />
        </>
      )}
    </Modal>
  );
}
