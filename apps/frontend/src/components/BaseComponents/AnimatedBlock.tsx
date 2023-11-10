import React, { useState, ReactNode } from 'react';
import Collapse from './Collapse';
import clsx from 'clsx';
import InfoTooltip from 'components/Tooltip/InfoTooltip';
import BaseCounter from './BaseCounter';

interface Props {
  children?: ReactNode;
  className?: string;
  slim?: boolean;
  title?: string;
  hideBottomBorder?: boolean;
  label?: string;
  loading?: boolean;
  labelTooltip?: string | any;
  isCollapsable?: boolean;
  counter?: number | any;
  buttonRight?: any;
  collapsableContent?: ReactNode;
  isCollapsed?: boolean;
  isOpen?: any;
  setIsOpen?: any;
}

const AnimatedBlock = ({
  children,
  className = '',
  slim = false,
  title = '',
  hideBottomBorder,
  label,
  labelTooltip,
  isCollapsable,
  loading,
  buttonRight,
  counter,
  collapsableContent,
  isOpen,
  isCollapsed,
  setIsOpen,
}: Props) => {
  return (
    <>
      <Collapse isActive={!isCollapsed}>
        <div
          className={clsx(
            'border-y border-skin-border bg-skin-block-bg text-base md:rounded-xl md:border',
            className,
          )}
        >
          {title !== '' ? (
            <div
              className={clsx(
                'group flex h-[57px] justify-between rounded-t-none border-b border-skin-border px-4 pt-3 pb-[12px] md:rounded-t-lg',
                {
                  'border-b-0': hideBottomBorder,
                },
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
            <div className="space-y-1 p-4 leading-5 sm:leading-6">
              {children}
              <Collapse isActive={isOpen || !isCollapsable}>
                <>{collapsableContent}</>
              </Collapse>
            </div>
          </div>
        </div>
      </Collapse>
    </>
  );
};

export default AnimatedBlock;
