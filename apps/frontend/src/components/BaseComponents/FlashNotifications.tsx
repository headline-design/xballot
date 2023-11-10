import React, { useEffect } from 'react';
import { Transition } from '@headlessui/react';
import toast, { Toaster, useToaster } from 'react-hot-toast';
import clsx from 'clsx';
import { XIcon } from 'icons/XIcon';
import { Button } from './Button';
import { CheckmarkIcon } from 'icons/Checkmark';

export const FlashNotifications = () => {
  const { toasts } = useToaster();
  const TOAST_LIMIT = 3;

  useEffect(() => {
    toasts
      .filter((t) => t.visible)
      .filter((_, i) => i >= TOAST_LIMIT)
      .forEach((t) => toast.dismiss(t.id));
  }, [toasts]);

  return (
    <Toaster position="bottom-center">
      {(t) => (
        <Transition
          className="bottom-center"
          appear
          show={t.visible}
          enter="transition-all duration-150"
          enterFrom="opacity-0 scale-50"
          enterTo="opacity-100 scale-100"
          leave="transition-all duration-150"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-75"
        >
          <Button
            style={{ zIndex: 1000 }}
            dataId="data-v-1b931z55"
            className={clsx(
              'text-skin-bg-3 flex items-center space-x-2 !border-none px-[22px] !text-white',
              {
                '!bg-green': t.type === 'success',
                '!bg-red': t.type === 'error',
              },
            )}
            onClick={() => toast.dismiss(t.id)}
            onChange={function (value: any): void {
              throw new Error('Function not implemented.');
            }}
          >
            {t.type === 'success' && (
              <CheckmarkIcon width="1.2em" height="1.2em" className="h-[16px] w-[16px]" />
            )}
            {t.type === 'error' && (
              <XIcon width="1.2em" height="1.2em" className="h-[16px] w-[16px]" />
            )}
            <span>{t.message as string}</span>
          </Button>
        </Transition>
      )}
    </Toaster>
  );
};
