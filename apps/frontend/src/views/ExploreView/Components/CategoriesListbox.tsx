import { Listbox } from '@headlessui/react';
import { MenuSquares } from 'icons/MenuSquares';
import { CaretOutlineDown } from 'icons/CaretOutlineDown';
import { Float } from '@headlessui-float/react';
import clsx from 'clsx';

function CategoriesListbox({ categories, selectedCategory, setSelectedCategory }) {
  return (
    <Listbox value={selectedCategory} onChange={setSelectedCategory}>
      <div>
        <Listbox.Button className="button w-full whitespace-nowrap px-[22px] pr-3">
          <div className="leading-2 flex items-center leading-3">
            <MenuSquares /> <span> {selectedCategory.name}</span>
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
        <div />
        <Listbox.Options className="z-50 scale-100 transform overflow-hidden rounded-2xl border bg-skin-header-bg opacity-100 shadow-lg outline-none">
          <div className="no-scrollbar max-h-[300px] overflow-auto">
            {categories.map((category, index) => (
              <Listbox.Option
                key={`CategoriesOptionItem_${category?.name}`}
                value={category}
                disabled={category?.count === 0}
              >
                {({ active }) => (
                  <div
                    key={`CategoryItem_${index}`}
                    className={clsx(
                      active ? 'bg-skin-border text-skin-link' : 'bg-skin-header-bg text-skin-text',
                      'cursor-pointer whitespace-nowrap px-3 py-2',
                    )}
                  >
                    <div className="flex">
                      <span className="mr-3">{category.name}</span>
                      <span className="ml-auto mt-[-3px] flex">
                        <div className="my-auto h-[20px] min-w-[20px] rounded-full bg-skin-text px-1 text-center text-xs leading-normal text-white">
                          {category.count}
                        </div>
                      </span>
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
}

export default CategoriesListbox;
