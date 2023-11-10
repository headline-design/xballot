import { shorten } from 'helpers/utils';
import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CopyIcon as Copy } from 'icons/CopyUpdated';
import { CheckCircle } from 'icons/CheckCircle';

const CopyPaste = ({ text, copyText: copyTextOpt, hideIcon, shortenText }) => {
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
      <div className="flex cursor-pointer items-center rounded border px-1 text-xs" onClick={(event) => event.preventDefault()}>
        <div className="Copy__TransactionStatusText-sc-1v0ek9s-1 iGMpJz cursor-pointer">
          <span
            className={`align-center flex justify-between whitespace-nowrap align-middle ${
              isCopied ? 'active' : ''
            }`}
          >
            <div className="copyable__text" style={{ marginLeft: '4px' }}>
              {isCopied
                ? 'Copied!'
                : copyText
                ? shortenText
                  ? shorten(copyText)
                  : copyText
                : 'Copy address'}
            </div>
            {isCopied ? (
              <CheckCircle size={'16'} className="ml-1 mb-[2px] inline-block text-xs" />
            ) : (
              <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" className="ml-1 text-xs">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2m-6 12h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2Z"
                />
              </svg>
            )}
          </span>
        </div>
      </div>
    </CopyToClipboard>
  );
};

export default CopyPaste;
