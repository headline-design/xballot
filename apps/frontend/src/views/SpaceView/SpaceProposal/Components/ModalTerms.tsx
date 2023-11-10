import React from 'react';
import { getUrl } from 'helpers/utils';
import { Modal } from 'components/BaseComponents/Modal';
import BaseMessageBlock from './BaseMessageBlock';
import BaseLink from 'components/BaseComponents/BaseLink';
import TextAutolinker from 'components/TextAutoLinker';
import { Button } from 'components/BaseComponents/Button';

const TermsModal = ({ open, space, action, onAccept, onClose }) => {
  const getIpfsUrl = getUrl(space.terms || '');

  const accept = () => {
    if (onAccept) {
      onAccept();
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="header">
        <h3>Terms</h3>
      </div>
      <div className="py-4 text-center md:p-4">
        <BaseMessageBlock isResponsive level="info" >
          {`You must agree to the terms before ${action} in ${space.name || 'spaces'}.`}
        </BaseMessageBlock>

        <BaseLink link={space.terms}>
          <TextAutolinker text={getIpfsUrl} truncate={35} />
        </BaseLink>
      </div>
      <div className="footer">
        <div className="float-left w-2/4 pr-2">
          <Button type="button" className="w-full" onClick={onClose}>
          Cancel
          </Button>
        </div>
        <div className="float-left w-2/4 pl-2">
          <Button type="submit" className="w-full" primary onClick={accept}>
           Agree
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TermsModal;
