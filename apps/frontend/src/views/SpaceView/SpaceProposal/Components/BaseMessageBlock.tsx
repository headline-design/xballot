import React from 'react';
import { Block } from 'components/BaseComponents/Block';
import BaseMessage from './BaseMessage';

const BaseMessageBlock = ({ level, isResponsive, children }) => {
  const classNames = [
    'rounded-xl border text-skin-text',
    level === 'warning' && '!border-skin-text',
    level === 'warning-red' && '!border-red',
    isResponsive && 'rounded-none border-x-0',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Block className={classNames}>
      <BaseMessage level={level}>{children}</BaseMessage>
    </Block>
  );
};

BaseMessageBlock.defaultProps = {
  isResponsive: false,
};

export default BaseMessageBlock;
