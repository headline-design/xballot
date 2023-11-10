import React from 'react';
import SettingsStrategiesBlockItem from './SettingsStrategiesBlockItem';
import { Block } from 'components/BaseComponents/Block';
import { Button } from 'components/BaseComponents/Button';
import StrategySettingsModal from './StrategySettingsModal';

const SettingsStrategiesBlock = ({ context, isViewOnly, formik, items, endPoints, space }) => {
  const [modalStrategy, setModalStrategy] = React.useState(null);

  const handleRemoveStrategy = (i) => {
    const updatedStrategies = formik.values.strategies.filter((_, index) => index !== i);
    formik.setFieldValue('strategies', updatedStrategies);
  };

  const handleEditStrategy = (i) => {
    if (isViewOnly) return;
    const currentStrategy = formik.values.strategies[i];
    setModalStrategy({ strategy: currentStrategy, index: i });
  };

  const handleAddStrategy = () => {
    setModalStrategy({ strategy: null, index: null });
  };

  return (
    <Block title="Strategies">
      {formik.values?.strategies?.length > 0 && (
        <SettingsStrategiesBlockItem
          strategies={formik.values.strategies}
          onEditStrategy={handleEditStrategy}
          onRemoveStrategy={handleRemoveStrategy}
        />
      )}

      <Button disabled={isViewOnly} className="block w-full" onClick={handleAddStrategy}>
        Add strategy
      </Button>
      {modalStrategy && (
        <StrategySettingsModal
          items={items}
          open={true}
          strategy={modalStrategy.strategy}
          onClose={() => setModalStrategy(null)}
          formik={formik}
          Spaces={undefined}
        />
      )}
    </Block>
  );
};

export default SettingsStrategiesBlock;
