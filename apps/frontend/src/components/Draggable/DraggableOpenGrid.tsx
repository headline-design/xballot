import React, { useState, useCallback, useMemo } from 'react';
import { ReactSortable } from 'react-sortablejs';
import { PlusIcon } from 'icons/Plus';
import { arrayMove } from '../../utils/functions';
import { Choice } from '../../helpers/interfaces';
import { v4 as uuidv4 } from 'uuid';
import AddOpenInput from 'components/AddInput/AddOpenInput';

interface DraggableGridProps {
  formData: any;
  values: any;
  upStreamChoices: any;
  formDataSetter: (data: any) => void;
  formDataRef: React.MutableRefObject<any>;
  setFieldValue: (field: string, value: any) => void;
}

const DraggableOpenGrid: React.FC<DraggableGridProps> = ({
  formData,
  formDataSetter,
  formDataRef,
  values,
  upStreamChoices,
  setFieldValue,
}) => {
  const [choices, setChoices] = useState<Choice[]>(
    formDataRef.current.choices.map((choice) => ({
      ...choice,
      id: uuidv4(),
      label: choice.label || '',
    })),
  );

  const onListChange = useCallback(
    (event) => {
      const newChoices = arrayMove([...choices], event.oldIndex, event.newIndex);
      sessionStorage.setItem('grid-options', JSON.stringify(newChoices));
      formDataSetter({ ...formDataRef.current, choices: [...newChoices] });
      setFieldValue('choices', newChoices);
    },
    [choices, formDataSetter, formDataRef, setFieldValue],
  );

  const handleTextChange = useCallback(
    (index: number, newText: string) => {
      const newChoices = [...choices];
      newChoices[index] = { ...newChoices[index], label: newText, choice: "" };
      setChoices(newChoices);
      upStreamChoices(newChoices);
      formDataSetter({ ...formData, choices: newChoices });
      setFieldValue('choices', newChoices);
    },
    [choices, formData, formDataSetter, setFieldValue, upStreamChoices],
  );

  const maxChoices = useMemo(() => 5, []);

  const addNewChoice = useCallback(() => {
    if (choices.length < maxChoices) {
      setChoices([
        ...choices,
        {
          key: choices.length + 1,
          id: uuidv4(),
          label: '',
          choice: '',
        },
      ]);
    }
  }, [choices, maxChoices]);

  return (
    <>
      <div className="flex">
        <div className="w-full overflow-hidden">
          <ReactSortable
            id="choice-grid"
            className="space-y-2"
            list={choices}
            setList={setChoices}
            animation={150}
            group={'answers'}
            onEnd={onListChange}
          >
            {choices.map((choice, index) => (
              <React.Fragment key={index}>
                <div className="group w-full rounded-3xl">
                  <AddOpenInput
                    name={`choices[${uuidv4}].choice`}
                    choiceKey={index}
                    handleChange={handleTextChange}
                    text={choice.label}
                  />
                </div>
              </React.Fragment>
            ))}
          </ReactSortable>
        </div>
        <div style={{display: 'none'}} className="ml-2 flex w-[48px] items-end">
          <button
            type="button"
            onClick={addNewChoice}
            className="flex h-[44px]  w-[44px] cursor-pointer select-none items-center justify-center rounded-full border hover:border-skin-text"
          >
            <PlusIcon />
          </button>
        </div>
      </div>
    </>
  );
};

export default DraggableOpenGrid;
