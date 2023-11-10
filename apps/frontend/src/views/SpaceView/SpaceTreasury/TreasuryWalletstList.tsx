import { useState, useEffect } from 'react';
import { TreasuryWallet } from 'helpers/interfaces';
import { Block } from 'components/BaseComponents/Block';
import TreasuryWalletsListItem from './TreasuryWalletsListItem';
import { useNavigate } from 'react-router-dom';
import Pipeline from "@pipeline-ui-2/pipeline/index";
import useTreasury from 'composables/useTreasury';

interface Props {
  wallets: TreasuryWallet[] | any;
  admins: string[];
  handleClick: any;
}

export const TreasuryWalletsList: React.FC<Props> = ({ wallets, admins, handleClick }) => {
  const { loadFilteredTokenBalances } = useTreasury();
  const navigate = useNavigate();

  const [walletBalances, setWalletBalances] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchBalances = async () => {
      const balances = await Promise.all(
        wallets.map(async (wallet: TreasuryWallet) => {
          const walletBalances = await loadFilteredTokenBalances(wallet.address);
          return { [wallet.address]: walletBalances };
        })
      );

      const walletBalancesObject = balances.reduce((acc, curr) => ({ ...acc, ...curr }), {});
      setWalletBalances(walletBalancesObject);
    };

    fetchBalances();
  }, []); // Empty dependency array to run the effect only once

  //console.log(walletBalances);
  //console.log(wallets);

  return (
    <>
      <Block
        data-testid="treasury-wallets-block"
        title="Wallets"
        counter={wallets.length}
        label="24h Change"
        slim
buttonRight={<div className='flex items-center'><div className='text-xs text-skin-link'>24h change</div></div>}
      >
        <ul>
          {wallets.map((wallet: TreasuryWallet, index: number) => (
            <TreasuryWalletsListItem
              key={`TreasuryWalletsListItem_${index}`}
              wallet={wallet}
              domain={undefined}
              handleClick={() => handleClick(wallet.address)}
              balances={walletBalances[wallet.address] || []}
            />
          ))}
        </ul>
      </Block>
      {!wallets.length && (
        <Block data-testid="treasury-wallets-message-block" className="text-center">
          <div>
            <div>Treasury Wallets are empty</div>
            {admins?.includes(Pipeline.address.web3Account) && (
              <button className="mt-3" onClick={() => navigate('settings')}>
                Add Treasury
              </button>
            )}
          </div>
        </Block>
      )}
    </>
  );
};
