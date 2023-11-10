import React, { useState, useContext } from 'react';
import { Button } from 'components/BaseComponents/Button';
import { useLoginModal } from 'contexts/LoginModalContext';
import PipeStateContext from 'contexts/PipeStateContext';

const Sidebar = ({
  handleAppChange,
  handlePrimary,
  handleSecondary,
  textPrimary,
  textSecondary,
  appId,
  appIdRef,
  disabled,
  domainData,
  loading,
}) => {
  const { openLoginModal } = useLoginModal();
  const pipeState = useContext(PipeStateContext);

  //console.log(pipeState)

  return (
    <div id="sidebar-right" className="w-full lg:w-4/12 lg:min-w-[321px]">
      <div className="border-y border-skin-border bg-skin-block-bg text-base md:rounded-xl md:border lg:fixed lg:w-[320px]">
        <div className="p-4 leading-5 sm:leading-6">
          <Button
            onClick={handleSecondary}
            className="button mb-2 block w-full px-[22px]"
            data-v-1b931a55
          >
            {textSecondary}
          </Button>
          {pipeState.myAddress ? (
            <Button
              disabled={disabled}
              className="button button--primary block w-full px-[24px] hover:brightness-95"
              data-v-1b931a55
              primary
              type="submit"
              loading={loading}
              onClick={handlePrimary}
            >
              {textPrimary}
            </Button>
          ) : (
            <Button
              onClick={() => openLoginModal()}
              className={'button button--primary block w-full px-[22px] hover:brightness-95'}
            >
              Connect wallet
            </Button>
          )}

          <input
            style={{ display: 'none' }}
            type="number"
            placeholder="app id"
            ref={appIdRef}
            id="appId"
            value={appId}
            onChange={handleAppChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
