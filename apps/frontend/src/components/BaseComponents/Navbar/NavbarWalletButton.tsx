// WalletButton Component
export function NavbarWalletButton({
  PipeConnectors,
  switchWallet,
  Pipeline,
  wallets,
  setXWalletOpen,
}) {
  return (
    <div className="m-4 space-y-2">
      {wallets.map((wallet, index) => (
        <button
          key={index}
          id={wallet.id}
          className="button flex w-full items-center justify-between px-[22px]"
          onClick={() => {
            if (wallet.name === 'X Wallet') {
              setXWalletOpen(true);
            } else {
              Pipeline.pipeConnector = PipeConnectors[wallet.connector];
              switchWallet();
            }
          }}
          data-v-4a6956ba=""
        >
          <div className="Option__OptionCardLeft-sc-1cloobz-2 hwQHsX">
            <div color="#E8831D" className="Option__HeaderText-sc-1cloobz-6 jlWWnQ">
              {wallet.name}
            </div>
          </div>
          <div className="Option__IconWrapper-sc-1cloobz-8 lfZvhO">{wallet.icon}</div>
        </button>
      ))}
    </div>
  );
}
