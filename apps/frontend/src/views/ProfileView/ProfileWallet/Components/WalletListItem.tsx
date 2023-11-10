import { shorten } from 'helpers/utils';

import { Block } from 'components/BaseComponents/Block';
import BaseButtonIcon from 'views/SpaceView/SpaceProposal/Components/BaseButtonIcon';
import BaseLink from 'components/BaseComponents/BaseLink';

import { PlayIcon } from 'icons/PlayIcon';
import { InfoIcon } from 'icons/InfoIcon';
import { PencilIcon } from 'icons/Pencil';
import { TrashIcon } from 'icons/Trash';
import { explorerUrl } from '../../../../helpers/utils';

interface WalletProps {
  showDelete?: boolean;
  showEdit?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
  pipeState: any;
  wallet: any;
  expand?: () => void;
}

const WalletListItem: React.FC<WalletProps> = ({
  showDelete,
  showEdit,
  onDelete,
  onEdit,
  wallet = {},
  expand,
}) => {
  const isAddress = wallet;

  const openWallet = () => {
    const walletRoute = `accounts/${wallet?.address}`;
    window.open(walletRoute, '_blank');
  };

  return (
    <div onClick={expand}>
      <Block
        slim
        className=" group mb-3 cursor-pointer rounded-md !border border-y border-skin-border bg-skin-block-bg p-4 text-base text-skin-link transition-all last:!mb-0 hover:border-skin-text md:rounded-xl md:border"
      >
        <div className="items-center justify-between sm:flex" onClick={expand}>
          <h3 className=" my-0 leading-5">{shorten(wallet?.address)}</h3>
          <div className="-mx-[8px] my-2 flex shrink flex-row-reverse items-center gap-3 sm:my-0 sm:flex-row">
            {showDelete && (
              <BaseButtonIcon onClick={onDelete} loading={undefined} className={undefined}>
                {' '}
                <TrashIcon />
              </BaseButtonIcon>
            )}
            {showEdit && (
              <BaseButtonIcon onClick={onEdit} loading={undefined} className={undefined}>
                {' '}
                <PencilIcon />
              </BaseButtonIcon>
            )}
            <PlayIcon />
            <BaseButtonIcon onClick={openWallet} loading={undefined} className={undefined}>
              {' '}
              <InfoIcon />
            </BaseButtonIcon>
          </div>
        </div>

        <div>
          {wallet?.network && (
            <div className="flex justify-between">
              <span className="start mr-1 flex flex-auto text-skin-text"> network </span>
              <span>{wallet?.network}</span>
            </div>
          )}
          {wallet?.params &&
            Object.entries(wallet.params).map(([key, param]) => (
              <div key={key} className="flex justify-between">
                <span className="mr-1 flex flex-auto text-skin-text">{key}</span>
                {key === 'address' || (typeof param === 'string' && isAddress) ? (
                  <BaseLink
                    link={explorerUrl(wallet?.network || wallet?.network, param as string)}
                    className="block"
                  >
                    <span>{shorten(param as string)}</span>
                  </BaseLink>
                ) : typeof param === 'string' && param.startsWith('http') ? (
                  <BaseLink link={param} className="ml-2 block truncate">
                    <span>{param}</span>
                  </BaseLink>
                ) : (
                  <span className="ml-2 truncate">
                    {['string', 'number', 'boolean'].includes(typeof param) ? param : typeof param}
                  </span>
                )}
              </div>
            ))}
        </div>
      </Block>
    </div>
  );
};

export default WalletListItem;
