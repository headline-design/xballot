import React, { useEffect, useRef, CSSProperties, Fragment } from 'react';
import { Transition } from '@headlessui/react';
import useWindowSize from 'hooks/useWindowSize';
import { ModalCloseIcon } from 'icons/ModalClose';
import useBodyClass from 'utils/useBodyClass';
import { createPortal } from 'react-dom';

interface ModalProps {
  title?: string;
  open: boolean;
  hideClose?: boolean;
  maxHeight?: string;
  onClose?: () => void;
  hideHeader?: React.ReactNode | any;
  footerSlot?: React.ReactNode | any;
  children?: any;
  style?: string | any;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  hideClose = false,
  maxHeight = '420px',
  title,
  onClose,
  hideHeader,
  style,
  children,
}) => {
  const { height } = useWindowSize();
  const transitionRef = useRef(null);
  const heightStyle: CSSProperties = {
    height: `${height}px !important`,
  };

  useBodyClass('overflow-hidden', open);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeydown);
    } else {
      document.removeEventListener('keydown', handleKeydown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [open, onClose]);

  return (
    <>
      {createPortal(
        <>
          <Transition show={open} as={Fragment}>
            {(state) => (
              <div className="modal z-50 mx-auto w-screen" style={style} ref={transitionRef}>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div
                    className="backdrop fixed inset-0 bg-black bg-opacity-25"
                    onClick={onClose}
                  />
                </Transition.Child>
                <div
                  className="shell relative scale-100 overflow-hidden rounded-none opacity-100 transition-all md:rounded-3xl"
                  style={heightStyle}
                >
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <div className="shell relative overflow-hidden rounded-none transition-all md:rounded-3xl">
                      {!hideHeader && (
                        <div className="border-b p-4 text-center">
                          <h3 className="text-lg font-medium leading-6 text-gray-900 m-0">{title}</h3>
                        </div>
                      )}

                      {!hideClose && (
                        <button
                          className="absolute right-3 top-[20px] flex items-center rounded-full p-[6px] text-md text-skin-text transition-colors duration-200 hover:text-skin-link hover:text-skin-link"
                          onClick={onClose}
                        >
                          <ModalCloseIcon />
                        </button>
                      )}
                      {children}
                    </div>
                  </Transition.Child>
                </div>
              </div>
            )}
          </Transition>
        </>,
        document.body,
      )}
    </>
  );
};
