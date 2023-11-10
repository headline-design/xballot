import clsx from 'clsx';
import InfoTooltip from 'components/Tooltip/InfoTooltip';
import { ReactNode } from 'react';
import BaseCounter from './BaseCounter';
import { LoadingSpinner } from 'components/Loaders/LoadingSpinner';

interface Props {
  children?: ReactNode;
  className?: string;
  slim?: boolean;
  title?: string;
  hideBottomBorder?: boolean;
  label?: string;
  loading?: boolean;
  tableLoading?: boolean;
  labelTooltip?: string | any;
  isCollapsable?: boolean;
  counter?: number | any;
  buttonRight?: any;
}

export const Block = ({
  children,
  className = '',
  slim = false,
  title = '',
  hideBottomBorder,
  label,
  labelTooltip,
  isCollapsable,
  loading,
  tableLoading,
  buttonRight,
  counter,
}: Props) => {
  return (
    <div
      className={clsx(
        'border-y border-skin-border bg-skin-block-bg text-base md:rounded-xl md:border',
        className,
      )}
    >
      {title !== '' ? (
        <div
          className={clsx(
            'group flex h-[57px] justify-between rounded-t-none border-b border-skin-border px-4 pb-[12px] pt-3 md:rounded-t-lg',
            {
              'border-b-0': hideBottomBorder || isCollapsable,
            },
            { 'cursor-pointer': isCollapsable },
          )}
        >
          <h4 className="flex items-center">
            <div>{title}</div>
            {counter ? <BaseCounter counter={counter} /> : null}
            {labelTooltip ? <InfoTooltip label={label} /> : null}
          </h4>
          {buttonRight}
        </div>
      ) : null}
      <div className={clsx('leading-5 sm:leading-6', { 'p-4': !slim })}>
        {children}
        {tableLoading ? (
            <div className="flex">
                <LoadingSpinner className="loading md mx-auto py-3" />
          </div>
        ) : null}
      </div>
    </div>
  );
};
