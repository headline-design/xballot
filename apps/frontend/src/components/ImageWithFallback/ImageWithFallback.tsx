import { useEffect, useRef, useState } from 'react';

const ImageWithFallback = ({
  id = undefined,
  className = undefined,
  style = undefined,
  src = '',
  fallbackSrc,
  alt = 'XBallot image',
}) => {
  const [srcToUse, setSrcToUse] = useState(src);
  const imgLoadedOnInitSrc = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!imgLoadedOnInitSrc.current && fallbackSrc) {
        setSrcToUse(fallbackSrc);
      }
    }, 7000);

    return () => clearTimeout(timer);
  }, [fallbackSrc]);

  return (
    <img
      id={id}
      className={className}
      style={style}
      src={srcToUse}
      alt={alt}
      onLoad={() => {
        imgLoadedOnInitSrc.current = true;
      }}
      onError={(e) => {
        e.currentTarget.src = '/missingMedia.png';
      }}
    />
  );
};

export default ImageWithFallback;
