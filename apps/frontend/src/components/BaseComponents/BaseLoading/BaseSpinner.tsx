
import React from 'react';

function BaseBlock(props) {
  if (props.block) {
    return <BaseBlock slim>{props.children}</BaseBlock>;
  } else {
    return <div>{props.children}</div>;
  }
}

export default BaseBlock;
