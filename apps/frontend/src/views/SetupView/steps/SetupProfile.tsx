import React, { useState } from 'react';
import PrevNextLinks from '../components/PrevNextLinks';
import SpaceSettings from 'views/SpaceView/SpaceSettings/SpaceSettings';
import toast from 'react-hot-toast';

export default function SetupProfile({ ticket }) {
  const [setupComplete, setSetupComplete] = useState(false);

  const handleCallbacks = {
    onSubmitting: (txId) => {
      console.log('---Submitting', txId);
    },

    onSuccess: (txId) => {
      console.log('Success', txId);
      toast.success('Saved!');
      setSetupComplete(true);
    },

    onError: (error) => {
      console.error('Error', error);
      toast.error('Error occurred', error);
      setSetupComplete(false);
    },
  };

  return (
    <>
      <SpaceSettings
        sideBar={false}
        sideBarContainer={false}
        viewOnly={false}
        header={false}
        plugins={false}
        treasury={false}
        strategy={false}
        rawSettings={true}
        ipfsTest={true}
        spaceData={ticket}
        navLink={`${ticket?.domain}`}
        appId={ticket?.appId}
        baseData={ticket}
        handleDisabled={setupComplete ? true : false}
        adminSideBar={false}
        callbacks={handleCallbacks}
      />
      <div className="px-4 md:px-0">
        <PrevNextLinks isValid={setupComplete ? true : false} domain={ticket?.domain} />
      </div>
    </>
  );
}
