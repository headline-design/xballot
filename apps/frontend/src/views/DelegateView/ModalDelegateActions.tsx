import React, { useState } from 'react';
import { Modal } from 'components/BaseComponents/Modal';
import { Button } from 'components/BaseComponents/Button';
import toast from 'react-hot-toast';
import { NoticeIcon } from 'icons/NoticeIcon';
import { shorten } from 'helpers/utils';
import SaveSettingsBtn from 'components/BaseComponents/SaveButton';
import { Formik } from 'formik';
import { TransactionModalBody } from 'components/BaseComponents/TransactionModal';
import { useTransactionModal } from 'contexts/TransactionModalContext';

function ModalDelegation({
  open,
  closeModal,
  profile,
  delegate,
  space,
  onReload,
  userName,
  domainData,
  modalData,
  currentRound,
  currentAppId,
  onSuccess,
  onError,
}) {
  const removeDelegation = (delegations, delegate, space) => {
    return delegations.filter((item) => item.delegate !== delegate || item.space !== space);
  };

  const updatedDelegations = removeDelegation(domainData?.delegations || [], delegate, space);

  let filteredDelegations =
    (modalData?.action === 'add' && domainData?.delegations) ||
    (modalData?.action === 'delete' && updatedDelegations);

  const initialValues = {
    name: domainData?.name || '',
    about: domainData?.about || '',
    avatar: domainData?.avatar || '',
    appId: domainData?.appId || null,
    asset: domainData?.asset || null,
    domain: domainData?.domain || '',
    delegations: filteredDelegations,
  };

  let [isOpen, setIsOpen] = useState(false);

  const addDelegations = (values, delegate, space, action) => {
    let updatedDelegations;
    if (action === 'add' && space !== '') {
      updatedDelegations = [
        { delegate, space, round: currentRound, appId: currentAppId },
        ...values.delegations,
      ];
    } else if (action === 'add' && space === '') {
      updatedDelegations = [{ delegate, space, round: currentRound, appId: currentAppId }];
    } else if (action === 'delete') {
      updatedDelegations = values.delegations.filter(
        (item) => item.delegate !== delegate || item.space !== space,
      );
    }
    return { ...values, delegations: updatedDelegations };
  };

  const [loading, setLoading] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [disabled, setDisabled] = useState(false);

  const handleTransactionIdSubmit = async (id) => {
    setLoading(true);
    setDisabled(true);

    try {
      const receipt = await id.wait();
      setIsOpen(false);
      setTransactionId(id);
      console.log('Receipt', receipt);
      toast('Delegate removed');
      setLoading(false);
      onReload();
    } catch (e) {
      console.log(e);
    }

    setLoading(false);
    closeModal();
  };

  const { isTransactionBodyOpen } = useTransactionModal();

  const handleSuccess = (txId) => {
    console.log('success', txId);
  };

  return (
    <>
      <Modal title={modalData?.title} onClose={closeModal} open={open}>
        {isTransactionBodyOpen ? (
          <TransactionModalBody onClose={closeModal} onSuccess={handleSuccess} />
        ) : (
          <div className="flex flex-auto flex-col">
            <div className="m-4 space-y-1 text-skin-text">
              <div className="rounded-xl border border-y border-skin-border bg-skin-block-bg text-base text-skin-text md:rounded-xl md:border">
                <div className="p-4 leading-5 sm:leading-6">
                  <div>
                    <NoticeIcon />
                    <div className="leading-5">
                      {`Are you sure you want to ${modalData?.notice} to ${
                        profile ? userName : shorten(delegate)
                      } ${space ? 'for the space ' + space + '?' : '?'} `}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden border-t p-4 text-center">
              <div className="float-left w-2/4 pr-2">
                <Button type="button" className="w-full" onClick={closeModal}>
                  Cancel
                </Button>
              </div>
              <div className="float-left w-2/4 pl-2">
                <Formik initialValues={initialValues} onSubmit={(_) => {}}>
                  {(formik) => {
                    const updatedValues = addDelegations(
                      formik.values,
                      delegate,
                      space,
                      modalData?.action,
                    );
                    return (
                      <SaveSettingsBtn
                        loading={loading}
                        data={
                          (modalData?.action === 'add' && updatedValues) ||
                          (modalData?.action === 'delete' && formik.values)
                        }
                        disabled={disabled}
                        type={'describe'}
                        send={true}
                        appId={domainData?.appId}
                        onError={(error) => {
                          console.error('Error:', error);
                          toast.error('An error occurred while processing the transaction');
                          onError && onError(error); // call the callback function
                        }}
                        onSuccess={(txId) => {
                          closeModal();
                          console.log('Transaction successful:', txId);
                          toast.success('Transaction confirmed');
                          onSuccess && onSuccess(txId); // call the callback function
                        }}
                        title={'Confirm'}
                        onSubmitting={(txId) => {
                          console.log('Transaction submitting:', txId);
                        }}
                        navLink={undefined}
                        openBody={true}
                      />
                    );
                  }}
                </Formik>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

export default ModalDelegation;
