import React, { useCallback, useContext } from 'react';
import { Button } from 'components/BaseComponents/Button';
import PipeStateContext from 'contexts/PipeStateContext';
import { useLoginModal } from 'contexts/LoginModalContext';
import { useOptSpace } from 'composables/useOptSpace';
import useOptContent from 'composables/useOptContent';

export interface OptButtonProps {
  spaceKey: string;
  space: any;
  applicationId: any;
  bg: string;
  optedLabel?: string;
  optInLabel?: string;
  optOutLabel?: string;
  type?: string;
  optedContent?: any;
}

const JOINED_LABEL = 'Joined';
const JOIN_LABEL = 'Join';
const LEAVE_LABEL = 'Leave';

const OptButton = ({
  spaceKey,
  space,
  applicationId,
  optedLabel = JOINED_LABEL,
  optInLabel = JOIN_LABEL,
  optOutLabel = LEAVE_LABEL,
  type,
}: OptButtonProps) => {
  const { opted, loadingOpt, optIn, optOut } = useOptSpace(applicationId, space, spaceKey, type);

  const pipeState = useContext(PipeStateContext);
  const { openLoginModal } = useLoginModal();

  const joinedLabel = optedLabel || JOINED_LABEL;
  const joinLabel = optInLabel || JOIN_LABEL;
  const leaveLabel = optOutLabel || LEAVE_LABEL;
  const optedContent = useOptContent(applicationId, joinLabel, joinedLabel, leaveLabel);

  const buttonClasses = `button group !mb-0 min-w-[120px] px-[22px] ${
    opted ? 'hover:!border-red hover:!bg-red hover:!bg-opacity-5 hover:!text-red' : ''
  }`;

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      if (!pipeState.myAddress) {
        openLoginModal();
      } else {
        opted ? optOut() : optIn();
      }
    },
    [opted, optOut, optIn, pipeState.myAddress, openLoginModal],
  );

  return (
    <Button loading={loadingOpt} type="button" className={buttonClasses} onClick={handleClick}>
      <span>{optedContent}</span>
    </Button>
  );
};

export default OptButton;
