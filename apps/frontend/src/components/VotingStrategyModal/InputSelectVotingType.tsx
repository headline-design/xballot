import React, { useState } from 'react';
import InputSelect from './InputSelect'; // Import InputSelect component
import ModalVotingType from './ModalVotingType'; // Import ModalVotingType component

const VotingTypeSelector = ({
  information = '',
  allowAny = false,
  isDisabled = false,
  isDisabledSettings = false,
  onUpdateType,
  formik,
}) => {
  const [modalVotingTypeOpen, setModalVotingTypeOpen] = useState(false);

  const handleSelect = () => {
    setModalVotingTypeOpen(true);
  };

  const handleClose = () => {
    setModalVotingTypeOpen(false);
  };

  const handleUpdateType = (updatedType) => {
    onUpdateType(updatedType);
  };



  return (
    <>
      <InputSelect
        title={'Type'}
        information={information}
        modelValue={formik?.strategyType?.title || formik?.strategyType[0]?.title || 'select type'}
        isDisabled={isDisabled || isDisabledSettings}
        tooltip={isDisabled ? '' : null}
        onSelect={handleSelect}
        className={undefined}
      />
      <ModalVotingType
        selectedType={formik?.strategyType}
        open={modalVotingTypeOpen}
        allowAny={allowAny}
        onUpdateSelected={handleUpdateType}
        onClose={handleClose}
        defaultType={formik?.strategyType[0]?.text || null}      />
    </>
  );
};

export default VotingTypeSelector;
