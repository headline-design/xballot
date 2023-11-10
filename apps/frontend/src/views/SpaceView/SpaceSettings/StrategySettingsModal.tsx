import React, { useEffect, useState } from 'react';
import { Listbox } from '@headlessui/react';
import { Modal } from 'components/BaseComponents/Modal';
import { CheckmarkIcon } from 'icons/Checkmark';
import { Button } from 'components/BaseComponents/Button';
import { GithubIcon } from 'icons/GithubIcon';

const StrategySettingsModal = ({ Spaces, open, strategy, onClose, formik, items }) => {
  const [strategies, setStrategies] = useState({
    title: strategy?.title || '',
    text: strategy?.text || '',
    description: strategy?.description || '',
  });

  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if (strategy) {
      setStrategies(strategy);
    } else {
      const selectedItems = items.filter((item) =>
        formik.values.strategies.some((strategy) => strategy.text === item.text),
      );
      setSelectedItems(selectedItems);
      setStrategies({
        title: '',
        text: '',
        description: '',
      });
    }
  }, [strategy, formik.values.strategies]);

  const handleClick = () => {
    if (strategy) {
      onClose();
    } else {
      console.log('Submitting:', strategies);
      formik.setFieldValue('strategies', selectedItems); // Set the formik value for strategies
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={strategy ? 'Strategy details' : 'Add strategy'}>
      <div className="modal-body">
        <div className="m-4">
          {strategy ? (
            <>
              <div className="flex items-baseline">
                <h3 className="mt-0 truncate">{strategy.title}</h3>
                <div className="ml-1">v0.1.1</div>
              </div>
              <div>{strategy?.description}</div>
            </>
          ) : (
            <Listbox
              value={selectedItems}
              onChange={(newSelectedItems) => {
                setSelectedItems(newSelectedItems);
              }}
              multiple
            >
              <Listbox.Options static className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="cursor-pointer border-y border-skin-border bg-skin-block-bg text-base hover:border-skin-text md:rounded-xl md:border"
                  >
                    <div className="p-4 leading-5 sm:leading-6">
                      <Listbox.Option
                        className={({ active }) =>
                          `relative cursor-pointer select-none pr-[50px] ${
                            active ? 'relative cursor-pointer select-none' : 'text-gray-900'
                          }`
                        }
                        value={item}
                      >
                        {({ selected }) => (
                          <>
                            <div className="flex items-baseline">
                              <h3 className="mt-0 truncate">{item.title}</h3>
                              <div className="ml-1">v0.1.1</div>
                            </div>
                            {selected && (
                              <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <CheckmarkIcon
                                  width="1.5em"
                                  height="1.5em"
                                  className="text-skin-text"
                                  aria-hidden="true"
                                />
                              </span>
                            )}
                            <div className="align-center flex text-skin-text">
                              <GithubIcon className="mr-2" /> headline-design
                            </div>
                            <div>In {Spaces?.length} space(s)</div>
                          </>
                        )}
                      </Listbox.Option>
                    </div>
                  </div>
                ))}
              </Listbox.Options>
            </Listbox>
          )}
        </div>
      </div>
      <div className="border-t p-4 text-center">
        <Button
          disabled={!(!formik.errors?.name && !formik.errors?.address)}
          type="button"
          className="button button--primary w-full px-[22px] hover:brightness-95"
          onClick={handleClick}
        >
          {strategy ? 'Close' : 'Save'}
        </Button>
      </div>
    </Modal>
  );
};

export default StrategySettingsModal;
