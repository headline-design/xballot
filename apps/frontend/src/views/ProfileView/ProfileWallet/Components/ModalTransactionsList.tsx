import React, { useEffect, useState } from 'react';
import { Listbox } from '@headlessui/react';
import { Modal } from 'components/BaseComponents/Modal';
import { CheckmarkIcon } from 'icons/Checkmark';
import { Button } from 'components/BaseComponents/Button';
import { GithubIcon } from 'icons/GithubIcon';

const TransactionsListModal = ({ Spaces, open, strategy, onClose, items, upStream, title, }) => {

  const [selectedItem, setSelectedItem] = useState(items[0] || []);
  console.log(selectedItem)

  function handleChange(item) {
      setSelectedItem(item);
      console.log(item)
      upStream(item)
      onClose()
  }


  return (
    <Modal open={open} onClose={onClose} title={'Transactions'}>
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
              value={selectedItem}
              onChange={handleChange}
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
                              <h3 className="mt-0 truncate">{item.name}</h3>
                              <div className="ml-1">{item.entities}</div>
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
          disabled={undefined}
          type="button"
          className="button button--primary w-full px-[22px] hover:brightness-95"
          onClick={onClose}
        >
       Close
        </Button>
      </div>
    </Modal>
  );
};

export default TransactionsListModal;
