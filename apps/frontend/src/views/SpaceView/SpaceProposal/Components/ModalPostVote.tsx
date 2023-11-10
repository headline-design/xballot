import React, { useState, useEffect, useMemo } from 'react';
import { useSharing } from 'composables/useSharing';
import { Modal } from 'components/BaseComponents/Modal';
import { Button } from 'components/BaseComponents/Button';
import { TwitterIcon } from 'icons/Twitter';
import { XBallotLogo } from 'icons/XGovLogo';
import { QRCode } from 'react-qrcode-logo';
import { getEndpoints } from 'utils/endPoints';

const PostVoteModal = ({
  open,
  space,
  proposal,
  selectedChoices,
  onClose,
  pipeState,
  txId, // Pass the Algorand transaction link as a prop
}) => {
  const { shareVote, shareProposalTwitter } = useSharing();
  const endPoints = getEndpoints();

  const share = (shareTo) => {
    shareVote(shareTo, {
      space,
      proposal,
      choices: selectedChoices,
    });
  };

  return (
    <Modal hideHeader={true} open={open} maxHeight="550px" onClose={onClose}>
      <div className="modal-body">
        <div className="flex flex-col justify-between p-4 md:h-auto">
          <div>
            <QRCode
              logoImage={XBallotLogo}
              ecLevel="M"
              size={200}
              logoWidth={68}
              logoHeight={68}
              quietZone={12}
              qrStyle={'dots'}
              removeQrCodeBehindLogo={true}
              eyeRadius={[
                {
                  outer: [4, 4, 4, 4],
                  inner: [1, 1, 1, 1],
                },
                {
                  outer: [4, 4, 4, 4],
                  inner: [1, 1, 1, 1],
                },
                {
                  outer: [4, 4, 4, 4],
                  inner: [1, 1, 1, 1],
                },
              ]}
              value={endPoints.explorer + 'tx/' + txId}
            />
            <div className="mt-3 text-center">
              <h3>Your vote is in!</h3>
              <p className="italic">
                View your vote on the Algorand blockchain:{' '}
                <a
                  href={endPoints.explorer + 'tx/' + txId}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Vote Transaction
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t p-4 text-center">
        <div className="space-y-2">

          <Button
            className="flex !h-[42px] w-full items-center justify-center gap-2"
            onClick={() => {
              shareProposalTwitter(space, proposal);
            }}
          >
            <TwitterIcon className="text-md text-[#1DA1F2]" />
            Share on Twitter
          </Button>
          <Button
            primary
            className="button button--primary block w-full px-[22px] hover:brightness-95"
            data-testid="post-vote-modal-close"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PostVoteModal;
