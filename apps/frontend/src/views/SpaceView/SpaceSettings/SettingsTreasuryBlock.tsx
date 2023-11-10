import React from 'react';
import SettingsTreasuriesBlockItem from './SettingsTreasuriesBlockItem';
import { Block } from 'components/BaseComponents/Block';
import { Button } from 'components/BaseComponents/Button';
import ModalTreasury from './ModalTreasury';

const SettingsTreasuryBlock = ({ context, isViewOnly, formik, items }) => {
  const [modalTreasury, setModalTreasury] = React.useState(null);

  const handleRemoveTreasury = (i) => {
    const updatedTreasuries = formik.values.treasuries.filter((_, index) => index !== i);
    formik.setFieldValue('treasuries', updatedTreasuries);
  };

  const handleEditTreasury = (i) => {
    if (isViewOnly) return;
    const currentTreasury = formik.values.treasuries[i];
    setModalTreasury({ treasury: currentTreasury, index: i });
  };

  const handleAddTreasury = () => {
    setModalTreasury({ treasury: null, index: null });
  };

  const handleSubmitTreasury = (treasury) => {
    if (modalTreasury?.index !== null) {
      const updatedTreasuries = [...formik.values.treasuries];
      updatedTreasuries[modalTreasury.index] = treasury;
      formik.setFieldValue('treasuries', updatedTreasuries);
    } else {
      formik.setFieldValue('treasuries', [...formik.values.treasuries, treasury]);
    }
    setModalTreasury(null);
  };

  return (
    <Block title="Treasuries">
      {formik.values?.treasuries?.length > 0 && (

          <SettingsTreasuriesBlockItem
            treasuries={formik.values.treasuries}
            onEditTreasury={handleEditTreasury}
            onRemoveTreasury={handleRemoveTreasury}
          />

      )}

      <Button disabled={isViewOnly} className="block w-full" onClick={handleAddTreasury}>
      Add treasury
      </Button>
      {modalTreasury && (
        <ModalTreasury
          items={items}
          open={true}
          treasury={modalTreasury.treasury}
          onClose={() => setModalTreasury(null)}
          onAdd={handleSubmitTreasury}
          formik={formik}
        />
      )}
    </Block>
  );
};

export default SettingsTreasuryBlock;
