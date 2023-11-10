import React, { useState, useCallback } from 'react';
import { Proposal } from 'helpers/interfaces';

import BaseMessage from './BaseMessage';
import { Button } from 'components/BaseComponents/Button';
import BaseIcon from 'components/BaseComponents/ProposalsItem/BaseIcon';
import BaseLink from 'components/BaseComponents/BaseLink';
import { staticEndpoints } from 'utils/endPoints';

interface ErrorComponentProps {
  proposal: Proposal;
  isAdmin: boolean;
  isPending: boolean;
  isInvalid: boolean;
  onReload: () => void;
}

export const ErrorComponent: React.FC<ErrorComponentProps> = ({
  proposal,
  isAdmin,
  isPending,
  isInvalid,
  onReload,
}) => {
  const [retrying, setRetrying] = useState(false);

  const retry = useCallback(async () => {
    if (isInvalid || isPending) {
      setRetrying(true);
      await fetch(proposal as any);
      setRetrying(false);
    }
    onReload();
  }, [isInvalid, isPending, onReload, proposal]);

  return (
    <>
      {isPending && (
        <BaseMessage level="info">Final results are being calculated. If you still see this message after a few minutes contact the space admin.</BaseMessage>
      )}
      {isInvalid && (
        <BaseMessage level="warning">
          <div>Results could not be calculated.</div>
        </BaseMessage>
      )}
      <Button className="mt-3 w-full" loading={retrying} primary onClick={retry}>
        <BaseIcon name="refresh" />
        Retry
      </Button>
      {isAdmin && (
        <BaseLink
          link={staticEndpoints.xBallotDiscord}
          className="mt-3 block"
          hideExternalIcon
        >
          <Button tabIndex={-1} className="w-full">
            Get help
          </Button>
        </BaseLink>
      )}
    </>
  );
};
