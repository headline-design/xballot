import React, { useState, useCallback, useMemo } from 'react';
import { ReactSortable } from 'react-sortablejs';
import AddInput from 'components/AddInput';
import { PlusIcon } from 'icons/Plus';
import { arrayMove } from '../../utils/functions';
import { Choice } from '../../helpers/interfaces';
import { v4 as uuidv4 } from 'uuid';

interface DraggableGridProps {
  formData: any;
  values: any;
  upStreamChoices: any;
  formDataSetter: (data: any) => void;
  formDataRef: React.MutableRefObject<any>;
  setFieldValue: (field: string, value: any) => void;
}

const DraggableGrid: React.FC<DraggableGridProps> = ({
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
      error: null,
    })),
  );

  const handleTextChange = useCallback(
    (index: number, newText: string) => {
      const newChoices = [...choices];

      // Clear all existing duplicate errors
      newChoices.forEach(choice => {
        if (choice.error === 'Duplicate choice not allowed') {
          choice.error = null;
        }
      });

      // Check if the new choice already exists in the choices
      const duplicateIndex = newChoices.findIndex((c, i) => c.choice === newText && i !== index);

      if (duplicateIndex >= 0) {
        newChoices[index].error = 'Duplicate choice not allowed';
        newChoices[duplicateIndex].error = 'Duplicate choice not allowed';
      }

      newChoices[index].choice = newText;
      setChoices(newChoices);
      upStreamChoices(newChoices);

      const formikChoices = newChoices.map(({ key, id, choice, error }) => ({
          key,
          id,
          choice,
          ...(error !== null && { error })
      }));
      formDataSetter({ ...formData, choices: formikChoices });
      setFieldValue('choices', formikChoices);
    },
    [choices, formData, formDataSetter, setFieldValue, upStreamChoices],
  );

  const onListChange = useCallback(
    (event) => {
      const newChoices = arrayMove([...choices], event.oldIndex, event.newIndex);
      sessionStorage.setItem('grid-options', JSON.stringify(newChoices));
      const formikChoices = newChoices.map(({ key, id, choice, error }) => ({
          key,
          id,
          choice,
          ...(error !== null && { error })
      }));
      formDataSetter({ ...formDataRef.current, choices: [...formikChoices] });
      setFieldValue('choices', formikChoices);
    },
    [choices, formDataSetter, formDataRef, setFieldValue],
  );



  const maxChoices = useMemo(() => 5, []);

  const addNewChoice = useCallback(() => {
    if (choices.length < maxChoices) {
      setChoices([
        ...choices,
        {
          key: choices.length + 1,
          id: uuidv4(),
          choice: '',
          error: null,
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
                  <AddInput
                    name={`choices[${uuidv4}].choice`}
                    choiceKey={index}
                    handleChange={handleTextChange}
                    text={choice.choice}
                    errorTag={choice.error}
                    errorField={choice.error}
                  />
                </div>
              </React.Fragment>
            ))}
          </ReactSortable>
        </div>
        <div className="ml-2 flex w-[48px] items-end">
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

export default DraggableGrid;
