import React, { useState } from 'react';
import { staticEndpoints } from 'utils/endPoints';

const AvatarToken = ({className, src, address = '137594422', size = '22' }) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      src={imgSrc}
      className={className ? className : "rounded-full bg-skin-border object-cover"}
      style={{
        width: `${Number(size)}px`,
        height: `${Number(size)}px`,
        minWidth: `${Number(size)}px`
      }}
      alt="Token logo"
      onError={(event) => {
        const imgElement = event.target as HTMLImageElement;
        setImgSrc(`${staticEndpoints.stamp}avatar/algo:${address}?s=100`);
      }}
    />
  );
};

export default AvatarToken;