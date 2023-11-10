import React from 'react';
import { Modal } from 'components/BaseComponents/Modal';
import BaseModalSelectItem from './BaseModalSelectItem';
import { strategyTypes } from 'utils/constants/schemas/strategyTypes';

const ModalVotingType = ({ open, selectedType, allowAny, onClose, onUpdateSelected, defaultType}) => {
  const handleSelect = (id) => {
    onUpdateSelected(id);
    onClose();
  };

console.log('ModalVotingType', selectedType)

  return (
    <Modal title="Select voting system" open={open} onClose={onClose}>
      <div className="mx-0 my-4 flex flex-col space-y-3 md:mx-4">
        {allowAny && (
          <button onClick={() => handleSelect(undefined)}>
            <BaseModalSelectItem
              selected={!selectedType}
              title="Any Type"
              tag={undefined}
              description={undefined}
            />
          </button>
        )}
        {strategyTypes.map((type, key) => {
          return (
            <button key={key} onClick={() => handleSelect(type)}>
              <BaseModalSelectItem
                selected={type.text === selectedType.text || type.text === defaultType || null}
                title={type.title}
                description={type.description}
                tag={undefined}
              />
            </button>
          );
        })}
      </div>
    </Modal>
  );
};

export default ModalVotingType;
