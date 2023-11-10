import { Dialog } from '@headlessui/react';
import { Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

const BaseModal = ({ title, content, isOpen, closeModal, children, onClick }) => {
  const ModalClose = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute right-3 top-[20px] flex items-center rounded-full p-[6px] text-md text-skin-text transition-colors duration-200 hover:text-skin-link"
    >
      <svg viewBox="0 0 24 24" width="1.2em" height="1.2em">
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );

  return (
    <>
      <div className="mb-4 grid gap-3"></div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="modal z-50 mx-auto w-screen" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="backdrop fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="shell relative overflow-hidden rounded-none md:rounded-3xl">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="--bg-color shadow-xl shell relative overflow-hidden rounded-none md:rounded-3xl">
                <div className="border-b p-4 text-center">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    {title}
                  </Dialog.Title>
                </div>
                <div className="modal-body">
                  {children} {content}
                </div>
                <ModalClose onClick={onClick} />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default BaseModal;
