import React from 'react';
import { useEffect, useRef } from 'react';

interface Props {
  src: string | undefined;
  size?: string;
  previewFile?: File | undefined;
  address?: any;
  profile?: any;
}

const defaultProps: Props = {
    src: undefined,
  size: '22',
  previewFile: undefined
};

function BaseAvatar(props: Props) {
  const avatarImage = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (avatarImage.current && props.previewFile) {
      avatarImage.current.src = URL.createObjectURL(props.previewFile);
    } else if (avatarImage.current?.src.startsWith('blob') && !props.previewFile) {
      avatarImage.current.src = '';
    }
  }, [props.previewFile]);

  return (
    <span className="flex shrink-0 items-center justify-center">
      {props.previewFile && (
        <img
          ref={avatarImage}
          className="rounded-full bg-skin-border object-cover"
          style={{
            width: `${Number(props.size)}px`,
            height: `${Number(props.size)}px`,
            minWidth: `${Number(props.size)}px`
          }}
          alt="avatar"
        />
      )}
      {!props.previewFile && props.src && (
        <img
          src={props.src}
          className="rounded-full bg-skin-border object-cover"
          style={{
            width: `${Number(props.size)}px`,
            height: `${Number(props.size)}px`,
            minWidth: `${Number(props.size)}px`
          }}
          alt="avatar"
        />
      )}
      {!props.src && !props.previewFile && (
        <div
          className="rounded-full bg-skin-border"
          style={{
            width: `${Number(props.size)}px`,
            height: `${Number(props.size)}px`,
            minWidth: `${Number(props.size)}px`
          }}
        />
      )}
    </span>
  );
}

BaseAvatar.defaultProps = defaultProps;

export default BaseAvatar