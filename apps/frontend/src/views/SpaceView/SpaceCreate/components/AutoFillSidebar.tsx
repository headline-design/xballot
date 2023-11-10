import React, { useState } from 'react';
import { Button } from 'components/BaseComponents/Button';

const Sidebar = ({
  handleAppChange,
  handlePrimary,
  handleSecondary,
  textPrimary,
  textSecondary,
  appId,
  appIdRef,
  disabled
}) => {
  const [count, setCount] = useState(0);
  return(

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
        <Button
          className="button button--primary block w-full px-[24px] hover:brightness-95"
          data-v-1b931a55
          primary
          type="submit"
          onClick={handlePrimary}
          disabled={disabled}
        >
          {textPrimary}
        </Button>

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
  )
};

export default Sidebar;
