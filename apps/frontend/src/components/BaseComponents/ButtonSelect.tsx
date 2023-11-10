import clsx from 'clsx';
import { CheckmarkIcon } from 'icons/Checkmark';
import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef, ReactNode } from 'react';

interface Props
  extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  primary?: boolean;
  loading?: boolean;
  children?: ReactNode;
  className?: string;
  type?: any;
  text: any;
  selected: any;
  onClick: any;
}

export const SelectedButton = forwardRef<HTMLButtonElement, Props>(function Button(
  {
    text,
    selected,
    onClick,
    className = '',
    type = 'button',
    primary = false,
    loading,
    children,
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      data-v-1b931a55=""
      onClick={onClick}
      className={clsx(
        'button px-[22px] relative mb-2 block w-full',
        'hover:border-skin-text',
        {
          'border border-primary bg-primary text-white hover:brightness-95': primary,
        },
        `${selected ? 'selected' : ''}`,
      )}
      disabled={rest.disabled || loading}
      type={type}
      {...rest}
    >
      {selected && (
    
          <CheckmarkIcon className="absolute" />
     
      )}{' '}
      {text}
    </button>
  );
});
