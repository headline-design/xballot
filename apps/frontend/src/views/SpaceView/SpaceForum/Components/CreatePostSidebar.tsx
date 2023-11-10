import { Button } from 'components/BaseComponents/Button';
import React, { useContext } from 'react';
import { useState } from 'react';
import { useLoginModal } from 'contexts/LoginModalContext';
import PipeStateContext from 'contexts/PipeStateContext';

export const Sidebar = ({
  handlePrimary,
  handleSecondary,
  textPrimary,
  textSecondary,
  disabled,
  loading,
}) => {
  const { openLoginModal } = useLoginModal();
  const pipeState = useContext(PipeStateContext);

  return (
    <div className="p-4 leading-5 sm:leading-6">
      <div className="space-y-2 md:flex md:space-x-3 md:space-y-0">
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
            loading={loading}
            className="button button--primary block w-full px-[24px] hover:brightness-95"
            data-v-1b931a55
            primary
            type="submit"
            onClick={handlePrimary}
          >
            {textPrimary}
          </Button>
        ) : (
          <Button
            className="button button--primary block w-full px-[24px] hover:brightness-95"
            data-v-1b931a55
            primary
            onClick={() => openLoginModal()}
          >
            Connect wallet
          </Button>
        )}
      </div>
    </div>
  );
};
