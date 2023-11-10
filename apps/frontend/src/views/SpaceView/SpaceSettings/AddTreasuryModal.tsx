import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { useFormikContext } from 'formik';
import { Button } from 'components/BaseComponents/Button';
import FormikTreasuryInput from './FormikTreasuryInput';
import FormikComboBox from 'components/Input/FormikComboBox';
import { SettingsAvatar } from './SettingsAvatar';
import toast from 'react-hot-toast';
import { create } from 'ipfs-http-client';
import { getEndpoints } from 'utils/endPoints';

const AddTreasuryModal = ({
  name,
  networkName,
  items,
  treasuriesSetter,
  formik,
  initialValues,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { values: formikValues, setFieldValue, errors, touched, setTouched } = useFormikContext();
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState(items[0].id);
  const [selectedName, setSelectedName] = useState(initialValues.treasuries?.name);
  const [selectedAvatar, setSelectedAvatar] = useState(initialValues.treasuries?.avatar);
  const [selectedAddress, setSelectedAddress] = useState(initialValues.treasuries?.address);
  const endPoints = getEndpoints();
  const [displayAvatar, setDisplayAvatar] = useState();
  const infuraProjectId = '2DBKADXQkjmd1KDSg7kq4ext7D3';
  const infuraProjectSecret = '08c9d9923e313326c20a3d163193ab60';
  const [hash, setHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [ipfsImageLink, setIpfsImageLink] = useState('url');

  //console.log(domainData);
  const updateAvatar = {
    onSuccess(data) {},
    onError: (err) => {
      toast(JSON.stringify(err['message']));
    },
  };

  const addArray = () => {
    const newTreasuries = [
      ...selectedItems,
      {
        id: selectedItems.length + 1,
        address: selectedAddress,
        name: selectedName,
        network: selectedNetwork,
        avatar: selectedAvatar,
      },
    ];
    setSelectedItems(newTreasuries);
    setFieldValue('treasuries', newTreasuries);
    treasuriesSetter(newTreasuries);
    closeModal();
  };

  const closeModal = () => setIsOpen(false);
  const openModal = () => {
    setIsOpen(true);
    formik.validateForm(); // Trigger validation for all fields
  };

  return (
    <>
      <div className="flex flex-grow justify-end lg:mt-3 lg:flex-auto lg:justify-center">
        <Button type="button" onClick={openModal} className="button mb-2 block w-full px-[22px]">
          Add treasury
        </Button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="modal z-50 mx-auto w-screen" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="backdrop fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="shell relative overflow-hidden rounded-none md:rounded-3xl">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="--bg-color shadow-xl shell relative overflow-hidden rounded-none md:rounded-3xl">
                <div className="border-b p-4 text-center">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Add treasury
                  </Dialog.Title>
                </div>
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
                                    spaceData={undefined}
                                    handleCoverFileChange={undefined}
                                    setFieldValue={setFieldValue}
                                    name={'treasuries.avatar'}
                                  />
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-full">
                        <FormikComboBox
                          networkName={networkName}
                          title={'Network'}
                          name={name}
                          items={items}
                          stateSetter={setSelectedNetwork}
                        />
                      </div>

                      <div className="w-full">
                        <FormikTreasuryInput
                          name={'treasuries.name'}
                          type="text"
                          maxLength="32"
                          title="Name"
                          placeholder="e.g. Algorand DAO 1"
                          count={true}
                          value={selectedName}
                          errorTag={
                            formik.touched.treasuries?.name && formik.errors.treasuries?.name
                          }
                          errorField={formik.errors.treasuries?.name}
                          onChange={undefined}
                          charCount={undefined}
                        />
                      </div>
                      <div className="w-full">
                        <FormikTreasuryInput
                          name={'treasuries.address'}
                          type="text"
                          maxLength="58"
                          title="Contract address"
                          placeholder="e.g. e.g. 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"
                          count={false}
                          value={selectedAddress}
                          errorTag={
                            formik.touched.treasuries?.address && formik.errors.treasuries?.address
                          }
                          errorField={formik.errors.treasuries?.address}
                          onChange={undefined}
                          charCount={undefined}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default AddTreasuryModal;
