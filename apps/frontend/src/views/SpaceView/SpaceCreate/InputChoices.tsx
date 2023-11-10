import React from 'react';
import { BasicVoting } from 'components/Draggable/StaticChoice';
import DraggableOpenGrid from 'components/Draggable/DraggableOpenGrid';
import DraggableGrid from 'components/Draggable/DraggableGrid';

interface InputChoicesProps {
  domainData: any;
  space: any;
  appId: any;
  values: any;
  textValue: any;
  setFormData: (data: any) => void;
  formData: any;
  setFieldValue: (field: string, value: any) => void;
  formDataRefOpen: React.MutableRefObject<any>;
  handleChoices: (choices: any) => void;
  formDataRefSingle: React.MutableRefObject<any>;
  formDataRefApproval: React.MutableRefObject<any>;
  formDataRefQuadratic: React.MutableRefObject<any>;
  formDataRefWeighted: React.MutableRefObject<any>;
  formDataRefRankedChoice: React.MutableRefObject<any>;
}

const InputChoices: React.FC<InputChoicesProps> = React.memo(
  ({
    domainData,
    space,
    appId,
    values,
    textValue,
    setFormData,
    formData,
    setFieldValue,
    formDataRefOpen,
    handleChoices,
    formDataRefSingle,
    formDataRefApproval,
    formDataRefQuadratic,
    formDataRefWeighted,
    formDataRefRankedChoice,
    ...props
  }) => {
    const strategyComponents = {
      basic: BasicVoting,
      open: DraggableOpenGrid,
      'single-choice': DraggableGrid,
      approval: DraggableGrid,
      quadratic: DraggableGrid,
      weighted: DraggableGrid,
      'ranked-choice': DraggableGrid,
    };

    const StrategyComponent = strategyComponents[textValue];

    const formDataRefs = {
      'single-choice': formDataRefSingle,
      approval: formDataRefApproval,
      quadratic: formDataRefQuadratic,
      weighted: formDataRefWeighted,
      'ranked-choice': formDataRefRankedChoice,
    };

    const formDataRef = formDataRefs[textValue];

    return (
      <div className="space-y-2">
        {textValue === 'basic' && <StrategyComponent />}
        {textValue === 'open' && (
          <StrategyComponent
            formData={formData}
            formDataSetter={setFormData}
            formDataRef={formDataRefOpen}
            setFieldValue={setFieldValue}
            values={values}
            upStreamChoices={handleChoices}
          />
        )}
        {['single-choice', 'approval', 'quadratic', 'weighted', 'ranked-choice'].includes(
          textValue
        ) && (
          <StrategyComponent
            formData={formData}
            formDataSetter={setFormData}
            formDataRef={formDataRef}
            setFieldValue={setFieldValue}
            values={values}
            upStreamChoices={handleChoices}
          />
        )}
      </div>
    );
  }
);

export default InputChoices;
