import React from 'react';
import AvatarToken from 'components/AvatarToken';
import IndicatorAssetsChange from 'components/IndicatorAssetsChange';
import { staticEndpoints } from 'utils/endPoints';
import { tokenHash } from 'utils/constants/tokenHash';

const TreasuryAssetsListItem = ({ asset }) => {
  return (

    <li className="flex items-center gap-2 border-b border-skin-border px-4 py-[12px] last:border-b-0">
      <AvatarToken
        src={(staticEndpoints.ipfs + tokenHash[asset.assetId]) || (staticEndpoints.ipfs + tokenHash[1])}
        address={asset.assetId}
        className="mr-1 rounded-full bg-skin-border object-cover"
        size="38"
      />
      <div className="flex w-full justify-between">
        <div className="leading-6">
          <div data-testid="asset-name" className="text-md font-semibold text-skin-heading">
            {asset.name}
          </div>
          <div>
            <span data-testid="asset-balance" className="mr-1">
              {asset.amount}
            </span>
            <span data-testid="asset-symbol">{asset.unitName}</span>
          </div>
        </div>
        <div className="text-right">
          <div data-testid="asset-quote" className="text-md text-skin-heading">
            ${asset.balance}
          </div>
          <IndicatorAssetsChange
            quote={asset.price}
            quote24hPercentage={asset.change_24h}
            quoteOpen={asset.open_24h}
          />
        </div>
      </div>
    </li>
  );
};

export default TreasuryAssetsListItem;
