import { useState } from 'react';
import { Listbox } from '@headlessui/react';
import { CheckmarkIcon } from 'icons/Checkmark';


function WalletListbox({upStream, title, items}) {
console.log(items[0])
    const [selectedItem, setSelectedItem] = useState(items[0] || []);
    console.log(selectedItem)

    function handleChange(item) {
        setSelectedItem(item);
        console.log(item)
        upStream(item)
    }

    return (
        <>
            <div className="group w-full rounded-3xl">
                <span className="mb-[2px] flex items-center gap-1 text-skin-text">{title}</span>
                <div className="relative ">
                    <Listbox value={selectedItem} onChange={handleChange}>
                        <div className="relative">
                            <Listbox.Button
                                className={
                                    'relative h-[42px] w-full truncate rounded-full border border-skin-border pl-3 pr-[40px] text-left text-skin-link hover:border-skin-text'
                                }
                            >
                                <span>{selectedItem.name}</span>{' '}
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-[12px]">
                                    <svg
                                        viewBox="0 0 24 24"
                                        width="1.2em"
                                        height="1.2em"
                                        className="text-[14px] text-skin-text"
                                    >
                                        <path
                                            fill="none"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="m19 9l-7 7l-7-7"
                                        />
                                    </svg>
                                </span>
                            </Listbox.Button>
                        </div>
                        <Listbox.Options className="absolute z-40 mt-1 w-full overflow-hidden rounded-md border border-skin-border bg-skin-bg text-base shadow-lg focus:outline-none sm:text-sm">
                            <div className="max-h-[180px] overflow-y-scroll">
                                {items.map((item) => (
                                    <Listbox.Option
                                        key={item.name}
                                        className={({ active }) =>
                                            `relative cursor-pointer select-none py-2 pr-[50px] pl-3 ${active
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
            </div>
        </>
    );
}

export default WalletListbox;
