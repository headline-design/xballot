import { Modal } from 'components/BaseComponents/Modal';
import { Button } from 'components/BaseComponents/Button';
import { CheckCircleLg } from 'icons/CheckCircleLg';
import { useEffect, useState } from 'react';
import { LoadingSpinnerLg } from 'components/Loaders/LoadingSpinnerLg';
import BaseLink from 'components/BaseComponents/BaseLink';
import algosdk from 'algosdk';
import { getEndpoints } from 'utils/endPoints';

const PostCreateProposalModal = ({ open, onClose, viewProposal, txId }) => {
  const endPoints = getEndpoints();
  let algodClient = new algosdk.Algodv2('', endPoints.node, '');

  const [generatingProposal, setGeneratingProposal] = useState(false);
  const [proposalGenerated, setProposalGenerated] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const wait4txn = async () => {
    try {
      setGeneratingProposal(true);
      console.log('running wait code');
      let response = await algosdk.waitForConfirmation(algodClient, txId, 1000);
      if (response['confirmed-round']) {
        console.log('TXN WAIT RESPONSE ' + response['confirmed-round']);
        console.log(txId);
      }

      // Proposal record fetch successful, stop loading spinner and show proposal generated
      setGeneratingProposal(false);
      setProposalGenerated(true);
    } catch (error) {
      console.error('There has been a problem with your fetch operation: ', error);
      setFetchError(error);
      setGeneratingProposal(false);
    }
  };

  useEffect(() => {
    wait4txn();
  }, []);

  return (
    <Modal hideHeader={true} open={open} maxHeight="550px" onClose={onClose}>
      <div className="modal-body">
        <div className="flex flex-col justify-between p-4 md:h-auto">
          <div>
            {generatingProposal && (
              <>
                <div className="mb-[2px] mt-4 flex flex-auto justify-center text-xs">
                  <LoadingSpinnerLg />
                </div>
                <div className="mt-3 text-center">
                  <h3>Submitting transaction...</h3>
                  <p className="italic">Please wait for round confirmation</p>
                </div>
              </>
            )}

            {proposalGenerated && (
              <>
                <div className="mb-[2px] mt-4  flex flex-auto justify-center text-xs">
                  <CheckCircleLg />
                </div>
                <div className="mt-3 text-center">
                  <h3>Your proposal is live!</h3>
                  <p className="italic">
                    View your proposal on the Algorand blockchain:{' '}
                    <BaseLink hideExternalIcon={false} link={endPoints.explorer + 'tx/' + txId}>
                      Proposal Transaction
                    </BaseLink>
                  </p>
                </div>
              </>
            )}

            {fetchError && (
              <div className="text-red-500 mt-3 text-center">
                <h3>Error fetching proposal</h3>
                <p>{fetchError.message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="border-t p-4 text-center">
        <div className="float-left w-2/4 pr-2">
          <Button
            className="button button--secondary w-full px-[22px] hover:brightness-95"
            data-v-4a6956ba=""
            onClick={onClose}
          >
            Close
          </Button>
        </div>
        <div className="float-left w-2/4 pl-2">
          <Button
            className="button button--primary w-full px-[22px] hover:brightness-95"
            data-v-4a6956ba=""
            disabled={!proposalGenerated}
            onClick={viewProposal}
          >
            View proposal
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PostCreateProposalModal;
