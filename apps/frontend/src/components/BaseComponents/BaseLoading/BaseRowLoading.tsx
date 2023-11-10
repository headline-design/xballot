import React from 'react';

function BaseBlock(props) {
  if (props.block) {
    return <BaseBlock >{props.children}</BaseBlock>;
  } else {
    return <div>{props.children}</div>;
  }
}

export default BaseBlock;