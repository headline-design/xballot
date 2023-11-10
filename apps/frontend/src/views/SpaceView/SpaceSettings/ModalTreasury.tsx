import React, { useState, useEffect } from 'react';
import { Modal } from 'components/BaseComponents/Modal';
import { Button } from 'components/BaseComponents/Button';
import FormikCombobox from 'components/Input/FormikComboBox';
import FormikTreasuryInput from './FormikTreasuryInput';
import { SettingsAvatar } from './SettingsAvatar';
import handleFileUpload from 'utils/handleFileUpload';
import { staticEndpoints } from 'utils/endPoints';

const ModalTreasury = ({ open, treasury, onClose, onAdd, formik, items }) => {
  const [charCount, setCharCount] = useState(0);
  const [displayAvatar, setDisplayAvatar] = useState();
  const [selectedAvatar, setSelectedAvatar] = useState();
  const [hash, setHash] = useState('');
  const [ipfsImageLink, setIpfsImageLink] = useState();
  const [treasuries, setTreasuries] = useState({
    name: treasury?.name || '',
    address: treasury?.address || '',
    network: treasury?.network || 1,
    avatar: treasury?.avatar || '',
  });

  useEffect(() => {
    if (treasury) {
      setTreasuries(treasury);
    } else {
      setTreasuries({
        name: '',
        address: '',
        network: 1,
        avatar: '',
      });
    }
  }, [treasury]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleTreasuriesChange({ name, value });
    setCharCount(e.target.value.length);
  };

  const handleSelectNetwork = (value) => {
    setTreasuries((prevTreasuries) => ({
      ...prevTreasuries,
      network: value,
    }));
  };

  const handleTreasuriesChange = ({ name, value }) => {
    setTreasuries((prevTreasuries) => ({
      ...prevTreasuries,
      [name]: value,
    }));
  };

  const handleTreasuriesAvatarUpdate = (avatar) => {
    setTreasuries((prevTreasuries) => ({
      ...prevTreasuries,
      avatar: avatar,
    }));
  };

  const handleSelectAvatar = async () => {
    if (ipfsImageLink) {
      console.log('Before:', ipfsImageLink);
      console.log('Before:', treasuries);

      const updatedTreasuries = {
        ...treasuries,
        avatar: ipfsImageLink,
      };

      setIpfsImageLink(treasuries.avatar);
      setTreasuries(updatedTreasuries);

      console.log('After:', ipfsImageLink);
      console.log('After:', treasuries);
    } else {
      console.log('boo hoo');
    }
  };

  console.log(ipfsImageLink);

  const handleCoverFileChange = async (e, setFieldValue) => {
    await handleFileUpload(
      e,
      setFieldValue,
      setDisplayAvatar,
      setHash,
      setIpfsImageLink,
      setSelectedAvatar,
      'treasuries.avatar',
      handleTreasuriesAvatarUpdate,
    );
  };

  const handleSubmit = () => {
    console.log('Submitting:', treasuries);
    onAdd(treasuries);
    onClose();
  };

  console.log(treasury);

  return (
    <Modal open={open} onClose={onClose} title={treasury ? 'Edit treasury' : 'Add treasury'}>
      <div className="modal-body">
        <div className="m-4">
          <div className="space-y-3">
            <div className="flex justify-center">
              <div>
                <div className="flex justify-center">
                  <div>
                    <div className="relative">
                      <span className="flex shrink-0 items-center justify-center">
                        <SettingsAvatar
                          displayAvatar={displayAvatar}
                          spaceData={
                            treasury &&
                            (treasury?.avatar ||
                              staticEndpoints.stamp + 'avatar/' + treasury?.address)
                          }
                          handleCoverFileChange={handleCoverFileChange}
                          setFieldValue={handleSelectAvatar}
                          name={'avatar'}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <FormikCombobox
                networkName="network"
                stateSetter={handleSelectNetwork}
                title={undefined}
                name="network"
                items={items}
                defaultItemId={treasuries.network}
              />
              <div className="w-full">
                <FormikTreasuryInput
                  type="text"
                  name="name"
                  value={treasuries.name}
                  onChange={handleInputChange}
                  maxLength="32"
                  title="Name"
                  placeholder="e.g. Algorand DAO 1"
                  count={true}
                  errorTag={formik.touched?.name && formik.errors?.name}
                  errorField={formik.errors?.name}
                  charCount={charCount}
                />
              </div>
              <div className="w-full">
                <FormikTreasuryInput
                  type="text"
                  name="address"
                  value={treasuries.address}
                  onChange={handleInputChange}
                  maxLength="58"
                  title="Contract address"
                  placeholder="e.g. e.g. 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"
                  count={false}
                  errorTag={formik.touched?.address && formik.errors?.address}
                  errorField={formik.errors?.address}
                  charCount={charCount}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t p-4 text-center">
        <Button
          disabled={!(!formik.errors?.name && !formik.errors?.address)}
          data-v-4a6956ba
          type="button"
          className="button button--primary w-full px-[22px] hover:brightness-95"
          onClick={handleSubmit}
        >
          Save
        </Button>
      </div>
    </Modal>
  );
};

export default ModalTreasury;
