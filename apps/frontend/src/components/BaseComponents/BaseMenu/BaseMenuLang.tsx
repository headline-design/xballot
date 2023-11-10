import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import clsx from 'clsx';

const langs = [{ name: 'English' }, { name: 'Italian' }, { name: 'French' }, { name: 'German' }];

export default function BaseMenuLang() {
  const [selected, setSelected] = useState(langs[0]);

  return (
    <div className="inline-block h-full !h-[42px] text-left">
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <Listbox.Button
          aria-disabled="true"
            className="button flex !h-[44px] h-full w-full items-center px-[22px] !text-skin-text hover:!text-skin-link"
            data-v-4a6956ba=""
          >
            <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" className="mr-2">
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.055 11H5a2 2 0 0 1 2 2v1a2 2 0 0 0 2 2a2 2 0 0 1 2 2v2.945M8 3.935V5.5A2.5 2.5 0 0 0 10.5 8h.5a2 2 0 0 1 2 2a2 2 0 1 0 4 0a2 2 0 0 1 2-2h1.064M15 20.488V18a2 2 0 0 1 2-2h3.064M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0Z"
              />
            </svg>
            {selected.name}
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options as="menu" className="overflow-hidden mt-1 rounded-2xl border bg-skin-header-bg shadow-lg outline-none">
              {langs.map((lang, langIdx) => (
                <Listbox.Option key={langIdx} value={lang}>
                  {({ active }) => (
                    <div
                      className={clsx(
                        active
                          ? 'bg-skin-border text-skin-link'
                          : 'bg-skin-header-bg text-skin-text',
                        'cursor-pointer whitespace-nowrap px-3 py-2',
                      )}
                    >
                      {lang.name}
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
