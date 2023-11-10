import React, { useCallback } from 'react';
import { ModalCloseIcon } from 'icons/ModalClose';

interface SettingsStrategiesBlockItemProps {
  selectedItems: any;
  handleSelection: any;
}

const SettingsStrategiesBlockItem: React.FC<SettingsStrategiesBlockItemProps> = ({
  selectedItems,
  handleSelection,
}) => {
  return (
    <>
      {selectedItems.map((item, i) => (
        <div className="relative" key={item.title || item.name}>
          <div className="flex h-full truncate">
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-md border p-4"
            >
              <div className="flex items-center gap-2 truncate pr-[20px] text-left">
                <h4 className="truncate">{item.title || item.name}</h4>
                <span className="rounded-full bg-skin-text px-2 text-center text-xs leading-5 text-white">
                  Algo
                </span>
              </div>
              <span
                onClick={() => handleSelection(item)}
                className="-mr-2 flex items-center rounded-full p-[6px] text-md text-skin-text transition-colors duration-200 hover:text-skin-link"
              >
                <ModalCloseIcon style={{fontSize: "14px", lineHeight: "14px"}}/>
              </span>
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default SettingsStrategiesBlockItem;
