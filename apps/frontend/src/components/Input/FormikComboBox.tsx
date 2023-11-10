import { useEffect, useState } from 'react';
import { Combobox } from '@headlessui/react';
import { CheckmarkIcon } from 'icons/Checkmark';
import { useField, useFormikContext } from 'formik';
import { CaretOutlineDown } from 'icons/CaretOutlineDown';

interface Item {
  network: string;
  name: string;
  id: number;
}

interface FormikComboboxProps {
  networkName: string;
  title: string;
  name: string;
  items: Item[];
  stateSetter: (id: number) => void;
  defaultItemId?: number;
}

function FormikCombobox({
  networkName,
  title,
  name,
  items,
  stateSetter,
  defaultItemId,
}: FormikComboboxProps) {
  const [field, meta, helpers] = useField(name);
  const { setFieldValue, setTouched } = useFormikContext();
  const [selectedItem, setSelectedItem] = useState(items[defaultItemId - 1]);
  console.log(selectedItem);
  const [filteredItems, setFilteredItems] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (items?.length > 0) {
      setFilteredItems(
        query === ''
          ? [...items]
          : items.filter((item) =>
              item.name
                .toLowerCase()
                .replace(/\s+/g, '')
                .includes(query.toLowerCase().replace(/\s+/g, '')),
            ),
      );
    }
  }, [query, items]);

  return (
    <>
      <div className="group w-full rounded-3xl">
        <span className="mb-[2px] flex items-center gap-1 text-skin-text">{title}</span>
        <div className="relative ">
          <Combobox
            value={selectedItem}
            onChange={(newSelectedItem) => {
              setSelectedItem(newSelectedItem);
              setFieldValue(networkName, newSelectedItem.id);
              setTouched({ [networkName]: true });
              stateSetter(newSelectedItem.id);
            }}
          >
            <div className="relative">
              <Combobox.Button className="w-full">
                <Combobox.Input
                  className="s-input w-full py-2 !pr-[30px] pl-3 focus:outline-none"
                  spellCheck="false"
                  displayValue={(item: Item) => item.network}
                  onChange={(event) => setQuery(event.target.value)}
                />
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-[12px]">
                  <CaretOutlineDown />
                </span>
              </Combobox.Button>
            </div>
            <Combobox.Options className="absolute z-40 mt-1 w-full overflow-hidden rounded-md border border-skin-border bg-skin-bg text-base shadow-lg focus:outline-none sm:text-sm">
              {filteredItems.length === 0 && query !== '' ? null : (
                <div className="max-h-[180px] overflow-y-scroll">
                  {filteredItems.map((item, index) => (
                    <Combobox.Option
                      key={`${item.network}_${index}`}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-3 pr-[50px] ${
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
                            {item.network}
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
                    </Combobox.Option>
                  ))}
                </div>
              )}
            </Combobox.Options>
          </Combobox>
        </div>
      </div>
    </>
  );
}

export default FormikCombobox;
