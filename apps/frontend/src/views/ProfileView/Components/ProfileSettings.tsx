import * as yup from 'yup';
import { Formik } from 'formik';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { setLocalStorage } from 'localStorage/localStorage';
import { useNavigate } from 'react-router-dom';
import FormikInput from 'components/Input/FormikInput';
import FormikTextArea from 'components/Input/FormikTextArea';
import { DisplayFormikState } from 'components/DisplayFormik';
import SaveSettingsBtn from 'components/BaseComponents/SaveButton';
import { Modal } from 'components/BaseComponents/Modal';
import { Locker } from 'components/UpdateProfileModal/Locker';
import { SettingsAvatar } from 'views/SpaceView/SpaceSettings/SettingsAvatar';
import handleFileUpload from 'utils/handleFileUpload';
import { TransactionModalBody } from 'components/BaseComponents/TransactionModal';
import { useTransactionModal } from 'contexts/TransactionModalContext';
import { staticEndpoints } from 'utils/endPoints';

const updateUserSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, 'Name must contains minimum of 3 characters')
    .max(50, 'Name must contains maximum of 50 characters')
    .required('Name is required'),
  description: yup
    .string()
    .min(10, 'Description must contains minimum of 10 characters')
    .max(100, 'Description must contains maximum of 100 characters')
    .required('Description is required'),
  avatar: yup.mixed().optional(),
});

function ProfileSettings({
  address,
  domainData,
  handleDisabled,
  isOpen,
  closeModal,
  domains,
  pipeState,
  rawSettings = false,
  profileKey,
  ...props
}) {
  const initialValues = {
    name: domainData?.name || '',
    about: domainData?.about || '',
    avatar: domainData?.avatar || '',
    appId: domainData?.appId || '',
    asset: domainData?.asset || '',
    domain: domainData?.domain || '',
    delegations: domainData?.delegations || [],
  };
  const { isTransactionBodyOpen } = useTransactionModal();
  const [selectedAvatar, setSelectedAvatar] = useState();
  const [displayAvatar, setDisplayAvatar] = useState();
  const [hash, setHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [ipfsImageLink, setIpfsImageLink] = useState('url');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  function updateDomainInfo(data) {
    setLocalStorage('userAccount', data.name);
    navigate('/items');
  }
  //console.log(domainData);
  const updateAvatar = {
    onSuccess(data) {},
    onError: (err) => {
      toast(JSON.stringify(err['message']));
    },
  };

  const handleCoverFileChange = async (e, setFieldValue) => {
    await handleFileUpload(
      e,
      setFieldValue,
      setDisplayAvatar,
      setHash,
      setIpfsImageLink,
      setSelectedAvatar,
      'avatar',
      '',
    );
  };

  const handleSuccess = (txId) => {
    console.log('success', txId);
  };

  return (
    <>
      <Modal onClose={closeModal} open={isOpen} title={'Edit profile'}>
        {isTransactionBodyOpen ? (
          <TransactionModalBody onClose={closeModal} onSuccess={handleSuccess} />
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={updateUserSchema}
            onSubmit={(values, { setSubmitting }) => {
              setLoading(true);
              console.log('VALUES', values);
              updateAvatar.onSuccess(values.avatar);
              updateDomainInfo(values);
              setSubmitting(false);
              setLoading(false);
            }}
          >
            {(formik) => {
              const { setFieldValue } = formik;
              return (
                <>
                  <>
                    {domains && domains.length >= 1 ? (
                      <>
                        <div className="modal-body">
                          <div className="min-h-[150px] space-y-3">
                            <div className="leading-5 sm:leading-6">
                              <div className="space-y-2 p-4">
                                <div className="flex justify-center">
                                  <div>
                                    <div className="flex justify-center">
                                      <div>
                                        <div className="relative">
                                          <span className="flex shrink-0 items-center justify-center">
                                            <SettingsAvatar
                                              displayAvatar={displayAvatar}
                                              spaceData={
                                                domainData &&
                                                (domainData?.avatar ||
                                                  staticEndpoints.stamp + 'avatar/' + pipeState.myAddress)
                                              }
                                              handleCoverFileChange={handleCoverFileChange}
                                              setFieldValue={setFieldValue}
                                              name={undefined}
                                            />
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <FormikInput
                                  type="text"
                                  name="name"
                                  value={initialValues.name}
                                  id="name"
                                  maxLength={30}
                                  title={'Name'}
                                  placeholder={'Name'}
                                  count={true}
                                  ref={undefined}
                                  errorTag={undefined}
                                  errorField={undefined}
                                />
                                <FormikTextArea
                                  name="about"
                                  maxLength={750}
                                  title={'About'}
                                  placeholder={'About'}
                                  value={initialValues.about}
                                  id={undefined}
                                  count={true}
                                  errorTag={undefined}
                                  errorField={undefined}
                                  style={undefined}
                                />
                              </div>
                              {rawSettings && <DisplayFormikState {...formik} />}
                            </div>
                          </div>
                        </div>

                        <div className="border-t p-4 text-center">
                          <SaveSettingsBtn
                            data={formik.values}
                            disabled={handleDisabled}
                            type="describe"
                            send={true}
                            appId={domainData?.appId}
                            title={'Save'}
                            onSubmitting={(txId) => {
                              setSubmitting(true);
                              console.log('Transaction submitted:', txId);
                            }}
                            onError={(error) => {
                              console.error('Error:', error);
                              toast.error('An error occurred while processing the transaction');
                            }}
                            onSuccess={(txId) => {
                              console.log('Transaction successful:', txId);
                            }}
                            loading={loading}
                            navLink={`/account/${profileKey}/about`}
                            openBody={true}
                          />
                        </div>
                      </>
                    ) : (
                      <Locker pipeState={pipeState} closeModal={closeModal} />
                    )}
                  </>
                </>
              );
            }}
          </Formik>
        )}
      </Modal>
    </>
  );
}

export default ProfileSettings;
