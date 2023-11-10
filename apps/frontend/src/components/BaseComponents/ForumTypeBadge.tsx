import React from 'react';

export default function ForumTypeBadge({ content, space, type }) {
  //console.log(type)
  let dataId;
  if (type === 'post') {
    dataId = `data-v-f27e3b11`;
  } else if (type === 'feed') {
    dataId = `data-v-f27e3b32`;
  }

console.log('content', content.sender === (space.creator || space.controller))

  return (
    <>
      {content.sender === (space.creator || space.controller) ? (
        <div className="State mr-2 bg-gray-500 text-white" {...{ [dataId]: '' }}>
          MGR
        </div>
      ) : (
        <div className="State mr-2 bg-violet-600 text-white" {...{ [dataId]: '' }}>
          OP
        </div>
      )}
    </>
  );
}
