import React, { useState, useEffect, useMemo } from 'react';
import { useSharing } from 'composables/useSharing';
import { Modal } from 'components/BaseComponents/Modal';
import { Button } from 'components/BaseComponents/Button';
import { TwitterIcon } from 'icons/Twitter';
import XBallotLogo from 'assets/logos/logoCircle.png';
import { QRCode } from 'react-qrcode-logo';
import { getEndpoints } from 'utils/endPoints';
import { shorten } from 'helpers/utils';

const QRModal = ({
  open,
  onClose,
 address,
}) => {
  const endPoints = getEndpoints();

  return (
    <Modal hideHeader={true} open={open} maxHeight="550px" onClose={onClose}>
      <div className="modal-body">
        <div className="flex flex-col justify-between p-4 md:h-auto">
          <div>
            <QRCode
              logoImage={XBallotLogo}
              ecLevel="Q"
              size={220}
              logoWidth={60}
              logoHeight={60}
              quietZone={12}
              qrStyle={'dots'}
              logoPadding={4}
              logoPaddingStyle='circle'
              removeQrCodeBehindLogo={false}
              eyeRadius={[
                {
                  outer: [4, 4, 4, 4],
                  inner: [0, 0, 0, 0],
                },
                {
                  outer: [4, 4, 4, 4],
                  inner: [0, 0, 0, 0],
                },
                {
                  outer: [4, 4, 4, 4],
                  inner: [0, 0, 0, 0],
                },
              ]}
              value={address}
            />
            <div className="mt-3 text-center">
              <h3>QR Generator</h3>
              <p className="text-xs">
              ADDRESS FOR WALLET 1

              </p>
              <p className="text-s p-4 wrap-text">
            {address}

              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t p-4 text-center">
        <div className="space-y-2">
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

export default QRModal;
