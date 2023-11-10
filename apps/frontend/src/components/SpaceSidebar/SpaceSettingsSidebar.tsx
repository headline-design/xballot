import React, { useState } from 'react';
import { Button } from 'components/BaseComponents/Button';
import SaveSettingsBtn from 'components/BaseComponents/SaveButton';

const SpaceSettingsSidebar = ({
  handleSecondary,
  textSecondary,
  secondaryType,
  appId,
  data,
  disabled,
  loading,
  buttonType,
  send,
  callbacks,
  navLink,
}) => {
  return (
    <>
      <div className="flex px-4 pt-2 md:px-0">
        <div className="float-left w-2/4 pr-2">
          <Button
            type={secondaryType}
            onClick={handleSecondary}
            className="button block w-full px-[22px]"
            data-v-1b931a55
          >
            {textSecondary}
          </Button>
        </div>
        <div className="float-left w-2/4 pl-2">
          <SaveSettingsBtn
            data={data}
            type={buttonType}
            send={send}
            appId={appId}
            title={'Save'}
            onSubmitting={callbacks.onSubmitting}
            onError={callbacks.onError}
            onSuccess={callbacks.onSuccess}
            loading={loading}
            navLink={navLink}
            openModal={true}
            disabled={disabled}
          />
        </div>
      </div>
    </>
  );
};

export default SpaceSettingsSidebar;
