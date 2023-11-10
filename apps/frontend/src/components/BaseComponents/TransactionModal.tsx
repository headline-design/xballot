import { Modal } from 'components/BaseComponents/Modal';
import { Button } from 'components/BaseComponents/Button';
import { CheckCircleLg } from 'icons/CheckCircleLg';
import { useContext, useEffect, useState } from 'react';
import { LoadingSpinnerLg } from 'components/Loaders/LoadingSpinnerLg';
import BaseLink from 'components/BaseComponents/BaseLink';
import algosdk from 'algosdk';
import { getEndpoints } from 'utils/endPoints';
import { TransactionModalContext, useTransactionModal } from 'contexts/TransactionModalContext';
import { useNavigate } from 'react-router-dom';

const TransactionModalBody = ({ onClose, onSuccess }) => {
  const navigate = useNavigate();
  const { txId, navigationLink } = useContext(TransactionModalContext);
  const endPoints = getEndpoints();
  let algodClient = new algosdk.Algodv2('', endPoints.node, '');
  const { openTransactionModal, openTransactionBody, isTransactionModal, resetTransactionState } =
    useTransactionModal();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState(null);

  const wait4txn = async () => {
    try {
      setIsProcessing(true);
      console.log('Running transaction wait code');
      console.log(isTransactionModal);
      if (txId) {
        if (isTransactionModal === true) {
          openTransactionModal(txId, onSuccess, navigationLink);
        }
        if (isTransactionModal === false) {
          openTransactionBody(txId, onSuccess, navigationLink);
        }
        console.log('-----txId', txId);
        let response = await algosdk.waitForConfirmation(algodClient, txId, 1000);
        if (response['confirmed-round']) {
          console.log('TXN WAIT RESPONSE ' + response['confirmed-round']);
          console.log(txId);
        }
        // Transaction confirmation received, stop loading spinner and show success message
        setIsProcessing(false);
        setIsCompleted(true);
      } else {
        console.log('Error occurred');
      }
    } catch (error) {
      console.error('There has been a problem with your transaction: ', error);
      setError(error);
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    wait4txn();
  }, []);

  const handleClick = () => {
    onClose();
    navigate(navigationLink);
    resetTransactionState();
  };

  const handleClose = () => {
    onClose();
    resetTransactionState();
  };

  return (
    <>
      <div className="modal-body">
        <div className="flex flex-col justify-between p-4 md:h-auto">
          <div>
            {isProcessing && (
              <>
                <div className="mb-[2px] mt-4 flex flex-auto justify-center text-xs">
                  <LoadingSpinnerLg />
                </div>
                <div className="mt-3 text-center">
                  <h3>Processing transaction...</h3>
                  <p className="italic">Please wait for confirmation</p>
                </div>
              </>
            )}

            {isCompleted && (
              <>
                <div className="mb-[2px] mt-4  flex flex-auto justify-center text-xs">
                  <CheckCircleLg />
                </div>
                <div className="mt-3 text-center">
                  <h3>Transaction successful!</h3>
                  <p className="italic">
                    View your transaction details:{' '}
                    <BaseLink link={endPoints.explorer + 'tx/' + txId}>
                      Transaction Details
                    </BaseLink>
                  </p>
                </div>
              </>
            )}

            {error && (
              <div className="text-red-500 mt-3 text-center">
                <h3>Error processing transaction</h3>
                <p>{error.message}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {navigationLink && (
        <div className="border-t p-4 text-center">
          <div className="float-left w-2/4 pr-2">
            <Button
              className="button button--secondary w-full px-[22px] hover:brightness-95"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
          <div className="float-left w-2/4 pl-2">
            <Button
              className="button button--primary w-full px-[22px] hover:brightness-95"
              disabled={!isCompleted}
              onClick={handleClick}
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {!navigationLink && (
        <div className="border-t p-4 text-center">
          <div className="float-left w-full">
            <Button
              className="button button--primary w-full px-[22px] hover:brightness-95"
              disabled={!isCompleted}
              onClick={handleClose}
            >
              Continue
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

const TransactionModal = ({ open, onClose, onSuccess }) => {
  return (
    <Modal hideHeader={true} open={open} maxHeight="550px" onClose={onClose}>
      <TransactionModalBody onClose={onClose} onSuccess={onSuccess} />
    </Modal>
  );
};

export { TransactionModal, TransactionModalBody };
