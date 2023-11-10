import React from 'react';
import { Strategy } from 'helpers/interfaces';
import { ModalCloseIcon } from 'icons/ModalClose';

interface SettingsStrategiesBlockItemProps {
  strategies: Strategy[];
  onRemoveStrategy: (index: number) => void;
  onEditStrategy: (index: number) => void;
}

const SettingsStrategiesBlockItem: React.FC<SettingsStrategiesBlockItemProps> = ({
  strategies,
  onRemoveStrategy,
  onEditStrategy,
}) => {
  console.log('strategies', strategies);
  return (
    <>
      {strategies.map((strategy, i) => (
        <div key={i} className="mb-3 grid gap-3">
          <div className="flex h-full truncate">
            <button
              className="flex w-full items-center justify-between rounded-md border p-4"
              onClick={() => onEditStrategy(i)}
            >
              <div className="pr-20px flex items-center gap-2 truncate text-left">
                <h4 className="truncate">{strategy.title}</h4>
              </div>
              <button
              type="button"
                className="-mr-2"
                onClick={(event) => {
                  event.stopPropagation();
                  onRemoveStrategy(i);
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

export default SettingsStrategiesBlockItem;
