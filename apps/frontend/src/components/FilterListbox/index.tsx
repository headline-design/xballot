import React from 'react';
import { Listbox } from '@headlessui/react';
import { CaretOutlineDown } from 'icons/CaretOutlineDown';
import { Float } from '@headlessui-float/react';
import { MenuSquares } from 'icons/MenuSquares';
import clsx from 'clsx';

const FilterListbox = ({ selectedFilter, setSelectedFilter, allFilters }) => {
  return (

      <Listbox
        value={selectedFilter}
        onChange={(value) => {
          setSelectedFilter(value);
        }}
      >
        <div className="mt-2 inline-block h-full w-full text-left xs:w-auto sm:mr-2 md:ml-2 md:mt-0">
          <Listbox.Button
            className="button w-full whitespace-nowrap px-[24px] pr-3"
            data-v-1b931a55=""
          >
            <div className="leading-2 flex items-center leading-3">
              <MenuSquares /> <span> {selectedFilter?.filter}</span>{' '}
              <CaretOutlineDown className="ml-1 text-xs text-skin-text" />
            </div>
          </Listbox.Button>
        </div>
        <Float
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
          zIndex={50}
          offset={5}
          shift={16}
          flip={16}
          portal
        >
          <div></div>
          <Listbox.Options className="z-50 scale-100 transform overflow-hidden rounded-2xl border bg-skin-header-bg opacity-100 shadow-lg outline-none">
            <div className="no-scrollbar max-h-[300px] overflow-auto">
              {allFilters.map((Filter) => (
                <Listbox.Option
                  key={`FiltersOptionItem_${Filter.filter}`}
                  value={Filter}
                  disabled={Filter?.unavailable}
                >
                  {({ active }) => (
                    <div
                      key={Filter.filter}
                      className={clsx(
                        active
                          ? 'bg-skin-border text-skin-link'
                          : 'bg-skin-header-bg text-skin-text',
                        'cursor-pointer whitespace-nowrap px-3 py-2',
                      )}
                    >
                      <div className="flex">
                        <span className="mr-3">{Filter.filter}</span>
                      </div>
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </div>
          </Listbox.Options>
        </Float>
      </Listbox>

  );
};

export default FilterListbox;
