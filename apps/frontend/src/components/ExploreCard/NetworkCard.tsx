import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function NetworkCard({ logo, length, name, chainId, endPoints }) {
  return (
    <>
      <Link to={'?network=' + chainId} className="router-link-active router-link-exact-active">
        <div className="cursor-pointer border-y border-skin-border bg-skin-block-bg text-base hover:border-skin-text md:rounded-xl md:border">
          <div className="p-4 leading-5 sm:leading-6">
            <div className="mb-3 flex items-start">
              <span className="mr-2 mt-1 flex shrink-0 items-center justify-center">
                <img
                  className="rounded-full bg-skin-border object-cover"
                  alt="avatar"
                  style={{ width: 28, height: 28, minWidth: 28, display: 'none' }}
                />
                <img
                  src={endPoints.ipfs + logo}
                  className="rounded-full bg-skin-border object-cover"
                  alt="avatar"
                  style={{ width: 28, height: 28, minWidth: 28 }}
                />
              </span>
              <div className="overflow-hidden">
                <h3 className="my-0 truncate leading-6">{name}</h3>
                <div className="text-xs leading-4 text-skin-text">Chain #{chainId}</div>
              </div>
            </div>
            <div className="text-skin-text">In {length} space(s)</div>
          </div>
        </div>
      </Link>
    </>
  );
}

export default NetworkCard;
