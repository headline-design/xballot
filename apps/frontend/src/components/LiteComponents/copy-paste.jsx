import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CopyIcon as Copy } from 'icons/CopyUpdated';
import { CheckCircle } from 'icons/CheckCircle';

const CopyPasteText = ({ text, copyText: copyTextOpt, hideIcon }) => {
  const [isCopied, setIsCopied] = useState(false);
  const copyText = copyTextOpt ?? text;

  const onCopy = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  return (
    <CopyToClipboard text={copyText} onCopy={onCopy}>
      <div className="Copy__TransactionStatusText-sc-1v0ek9s-1 iGMpJz cursor-pointer">
        <span
          className={`align-center flex justify-between whitespace-nowrap align-middle ${
            isCopied ? 'active' : ''
          }`}
        >
          <div className="copyable__text" style={{ marginLeft: '4px' }}>
            {isCopied ? 'Copied!' : 'Copy Address'}
          </div>
          {isCopied ? (
            <CheckCircle size={'16'} className="ml-1 mb-[2px] inline-block text-xs" />
          ) : (
            <Copy className="ml-1 mb-[2px] inline-block text-xs" size={'16'} />
          )}
        </span>
      </div>
    </CopyToClipboard>
  );
};

export default CopyPasteText;
