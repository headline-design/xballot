import React from 'react';

const LazyImage = ({ src, alt, className, style }) => (
  <img className={className} style={style} src={src} alt={alt} />
);

export default LazyImage;