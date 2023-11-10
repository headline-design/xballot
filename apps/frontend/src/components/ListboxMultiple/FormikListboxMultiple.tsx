import { useState } from 'react';
import { Listbox } from '@headlessui/react';
import { CheckmarkIcon } from 'icons/Checkmark';
import { useField, Field } from 'formik';
import { CaretOutlineDown } from 'icons/CaretOutlineDown';
import { WarningIcon } from 'icons/Warning';

const items = [
  { id: 1, name: 'Protocol' },
  { id: 2, name: 'Social' },
  { id: 3, name: 'Investment' },
  { id: 4, name: 'Grant' },
  { id: 5, name: 'Service' },
  { id: 6, name: 'Media' },
  { id: 7, name: 'Creator' },
  { id: 8, name: 'Collector' },
];

function FormikListboxMultiple({ title, name, errorTag, errorField }) {
  const [field, meta, helpers] = useField(name);
  const [selectedItems, setSelectedItems] = useState([items[0], items[1]]);

  return (
    <>
      <div className="group w-full rounded-3xl">
        <span className="mb-[2px] flex items-center gap-1 text-skin-text">{title}</span>
        <div className="relative ">
          <Listbox
            value={selectedItems}
            onChange={(newSelectedItems) => {
              setSelectedItems(newSelectedItems);
              helpers.setValue(newSelectedItems);
            }}
            multiple
          >
            <div className="relative">
              <Listbox.Button
                className={
                  'relative h-[42px] w-full truncate rounded-full border border-skin-border pl-3 pr-[40px] text-left text-skin-link hover:border-skin-text'
                }
              >
                <span>{selectedItems.map((item) => item?.name).join(', ')}</span>{' '}
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-[12px]">
                  <CaretOutlineDown />
                </span>
              </Listbox.Button>
            </div>
            <Listbox.Options className="absolute z-40 mt-1 w-full overflow-hidden rounded-md border border-skin-border bg-skin-bg text-base shadow-lg focus:outline-none sm:text-sm">
              <div className="max-h-[180px] overflow-y-scroll">
                {items.map((item) => (
                  <Listbox.Option
                    key={item.name}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pr-[50px] pl-3 ${
                        active
                          ? 'relative cursor-pointer select-none bg-skin-border'
                          : 'text-gray-900'
                      }`
                    }
                    value={item}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                        >
                          {item.name}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <CheckmarkIcon
                              width="1.2em"
                              height="1.2em"
                              className="text-skin-text"
                              aria-hidden="true"
                            />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </div>
            </Listbox.Options>
          </Listbox>
        </div>
        {errorTag && (
                <div className="s-error -mt-[21px] opacity-100">
                  <WarningIcon  />
                  {errorField}
                </div>
              )}
      </div>
    </>
  );
}

export default FormikListboxMultiple;
