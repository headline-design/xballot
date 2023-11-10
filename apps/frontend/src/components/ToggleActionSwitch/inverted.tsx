import { useEffect, useState } from 'react';
import { Switch } from '@headlessui/react';

interface Props {
  modelValue?: boolean;
  label?: string;
  textRight?: string;
  definition?: any;
  information?: string;
  defaultEnabled?: any;
  handleChange?: any;
  action;
  actionParams?: any;
  disabled?: any;
}

const ToggleActionSwitchInverted: React.FC<Props> = ({
  modelValue,
  action,
  label,
  textRight,
  definition,
  information,
  defaultEnabled,
  actionParams,
  disabled,
}) => {
  const [enabled, setEnabled] = useState(defaultEnabled ?? false);

  useEffect(() => {
    if(enabled !== undefined) {
      action(enabled)
    }
  }, [enabled])

  return (
    <div className="flex items-center space-x-2 pt-1 pr-2">
         <Switch
        disabled={disabled}
        checked={enabled}
        onChange={setEnabled}
        className={`${
          enabled
            ? 'relative inline-flex h-[22px] w-[38px] flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-green outline-offset-2 transition-colors duration-200 ease-in-out'
            : 'bg-teal-700'
        }
            relative inline-flex h-[22px] w-[38px] flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-skin-border outline-offset-2 transition-colors duration-200 ease-in-out`}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={`${
            enabled
              ? 'shadow pointer-events-none inline-block h-[18px] w-[18px] translate-x-[16px] transform rounded-full bg-skin-bg transition duration-200 ease-in-out'
              : 'shadow  pointer-events-none inline-block h-[18px] w-[18px] translate-x-[0px] transform rounded-full bg-skin-bg transition duration-200 ease-in-out'
          }
              shadow pointer-events-none inline-block h-[18px] w-[18px] translate-x-[0px] transform rounded-full bg-skin-bg transition duration-200 ease-in-out`}
        >
          <span
            className="absolute inset-0 flex h-full w-full items-center justify-center text-skin-text opacity-100 transition-opacity duration-200 ease-in"
            aria-hidden="true"
          >
            {enabled ? (
              <span
                className="absolute inset-0 flex h-full w-full items-center justify-center text-green opacity-100 transition-opacity duration-200 ease-in"
                aria-hidden="true"
              >
                <svg className="h-[10px] w-[10px]" fill="currentColor" viewBox="0 0 12 12">
                  <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                </svg>
              </span>
            ) : (
              <svg className="h-[10px] w-[10px]" fill="none" viewBox="0 0 12 12">
                <path
                  d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
        </span>
      </Switch>
    </div>
  );
};

export default ToggleActionSwitchInverted;
