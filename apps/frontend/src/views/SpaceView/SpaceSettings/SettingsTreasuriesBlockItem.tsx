import React from 'react';
import { TreasuryWallet } from 'helpers/interfaces';
import { ModalCloseIcon } from 'icons/ModalClose';

interface SettingsTreasuriesBlockItemProps {
  treasuries: TreasuryWallet[];
  onRemoveTreasury: (index: number) => void;
  onEditTreasury: (index: number) => void;
}

const SettingsTreasuriesBlockItem: React.FC<SettingsTreasuriesBlockItemProps> = ({
  treasuries,
  onRemoveTreasury,
  onEditTreasury,
}) => {
  return (
    <>
      {treasuries.map((treasury, i) => (
        <div key={i} className="mb-3 grid gap-3">
          <div className="flex h-full truncate">
            <button
              className="flex w-full items-center justify-between rounded-md border p-4"
              onClick={() => onEditTreasury(i)}
            >
              <div className="pr-20px flex items-center gap-2 truncate text-left">
                <h4 className="truncate">{treasury.name}</h4>
              </div>
              <button
                className="-mr-2"
                onClick={(event) => {
                  event.stopPropagation();
                  onRemoveTreasury(i);
                }}
              >
                <ModalCloseIcon style={{ fontSize: '14px', lineHeight: '14px' }} />
              </button>
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default SettingsTreasuriesBlockItem;
