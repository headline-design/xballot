import React from 'react';

const BaseIcon = ({ name, size = '16' }) => {
  const iconStyle = size
    ? {
        fontSize: `${size}px`,
        lineHeight: `${size}px`,
      }
    : {};

  return <i className={`iconfont icon${name}`} style={iconStyle} />;
};

export default BaseIcon;
