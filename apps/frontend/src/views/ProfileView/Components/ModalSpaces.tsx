import BaseModal from 'components/BaseComponents/BaseModal';
import ModalSpacesListItem from './ModalSpacesListItem';

function SpacesModal({ onClose, open, spaces, gridRef, domainType }) {
  console.log(spaces)
  return (
    <BaseModal isOpen={open} closeModal={onClose} title={'Spaces'} content={undefined} onClick={onClose}>
      <div ref={gridRef} className="space-y-3 py-4 md:px-4">
        {spaces?.map((space) => (
          <ModalSpacesListItem
            key={space?.id}
            space={space}
            spaceKey={space?.domain}
            appId={space?.appId}
            domainType={domainType}
          />
        ))}
      </div>
    </BaseModal>
  );
}

export default SpacesModal;
