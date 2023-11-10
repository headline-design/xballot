import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

const IFrameComponent = ({ children }) => {
  const [contentRef, setContentRef] = useState(null);
  const mountNode = useRef(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    const doc = iframe.contentDocument;
    mountNode.current = doc.body;
    setContentRef(doc.body);
  }, []);

  return (
    <iframe title="My Frame" ref={iframeRef}>
      {contentRef && ReactDOM.createPortal(children, contentRef)}
    </iframe>
  );
};

export default IFrameComponent;