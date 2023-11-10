import React, { useState } from 'react';
import { shorten, explorerUrl } from 'helpers/utils';
import { Proposal, SpaceStrategy } from 'helpers/interfaces';
import { Modal } from 'components/BaseComponents/Modal';
import { Block } from 'components/BaseComponents/Block';
import BaseLink from 'components/BaseComponents/BaseLink';
import { getEndpoints } from 'utils/endPoints';

interface Props {
  open: boolean;
  isAddress: string;
  signature: any;
  vote: any;
  onClose: () => void;
}

const ModalSignature: React.FC<Props> = ({ open, signature, vote, onClose }) => {
  const endPoints = getEndpoints();
  return (
    <Modal title={'Signature'} open={open} onClose={onClose}>
      <div className="m-4">
        <Block slim className="mb-3 p-4 text-skin-link">
          <div className="flex items-center justify-between">
            <h3>{vote?.domain || shorten(vote?.address)}</h3>
          </div>

          <div>
            <div className="flex justify-between">
              <span className="mr-1 flex-auto text-skin-text"> network </span>
              <span>Algorand</span>
            </div>

            <div className="flex">
              <span className="mr-1 flex-auto text-skin-text">symbol</span>

              <BaseLink link={endPoints.explorer} className="block">
                <span>ALGO</span>
              </BaseLink>

              <span className="ml-2 truncate">{shorten('')}</span>
            </div>
          </div>
        </Block>
      </div>
    </Modal>
  );
};

export default ModalSignature;
