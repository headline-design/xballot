import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ExtendedSpace, TypeSafeProposal } from 'helpers/interfaces';
import Pipeline from "@pipeline-ui-2/pipeline/index";
import { useIntl } from 'helpers/useIntl';
import { Modal } from 'components/BaseComponents/Modal';
import { useFormik } from 'formik';
import { getPower } from 'utils/functions';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { Button } from 'components/BaseComponents/Button';
import { isOpted } from 'orderFunctions';
import { getRound } from 'orderFunctions';
import { getEndpoints } from 'utils/endPoints';
import VoteOptInButton from './VoteOptInButton';
import DelegatesContext from 'contexts/DelegatesContext';
import { VoteDetails } from './ModalVoteDetails';
import { ModalVoteCommentForm } from './ModalVoteCommentForm';

interface VoteModalProps {
  open: boolean;
  space: ExtendedSpace;
  proposal: TypeSafeProposal;
  pipeState: any;
  selectedChoices: any | number | number[] | Record<string, any> | null;
  strategies: {
    name: string;
    network: string;
    params: Record<string, any>;
  }[];
  onReload: () => void;
  onClose: () => void;
  onOpenPostVoteModal: () => void;
  currentRound: any;
  decimals: any;
  upStream: any;
  upStreamComment: any;
  appId: any;
  isUserOpted: any;
  setIsUserOpted: any;
  spaceKey: any;
  votes: any;
}

const VoteModal: React.FC<VoteModalProps> = ({
  open,
  space,
  proposal,
  selectedChoices,
  onReload,
  onClose,
  onOpenPostVoteModal,
  pipeState,
  currentRound,
  upStream,
  upStreamComment,
  decimals,
  appId,
  isUserOpted,
  setIsUserOpted,
  spaceKey,
  votes,
}) => {
  const endPoints = getEndpoints();
  const web3Account = pipeState?.myAddress;
  const [votingPower, setVotingPower] = useState(0);
  const [votingPowerByStrategy, setVotingPowerByStrategy] = useState([]);
  const [isValidVoter, setIsValidVoter] = useState(false);
  const [reason, setReason] = useState('');
  const { formatCompactNumber } = useIntl();
  const [isLoadingShutter, setIsLoadingShutter] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [votedProposalId, setVotedProposalId] = useState('');
  const [voteLoading, setVoteLoading] = useState(false);
  const [voteTxnId, setVoteTxnId] = useState(null);
  const [isValidationAndPowerLoading, setIsValidationAndPowerLoading] = useState(true);
  const [isValidationAndPowerLoaded, setIsValidationAndPowerLoaded] = useState(false);
  const [hasVotingPowerFailed, setHasVotingPowerFailed] = useState(false);
  const [isMaxRoundFuture, setIsMaxRoundFuture] = useState(false);
  const [hasVotingValidationFailed, setHasVotingValidationFailed] = useState(false);
  const [currentRoundNumber, setCurrentRoundNumber] = useState(0);
  const [error, setError] = useState(null);
  const [filteredDelegates, setFilteredDelegates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [totalVotingPower, setTotalVotingPower] = useState(0);
  const MemoizedVoteDetails = React.memo(VoteDetails);
  const delegateContext = React.useContext(DelegatesContext);

  //console.log('votes', votes);

  const [commentData, setCommentData] = useState({
    content: '',
    appId: proposal?.appId,
    txId: proposal?.id,
    timeStamp: Date.now(),
    type: 'voteComment',
    sender: pipeState.myAddress,
  });

  const checkIfUserHasVoted = useCallback(() => {
    if (votes && web3Account) {
      const userHasVoted = Object.keys(votes).includes(web3Account);
      setHasVoted(userHasVoted);
    } else {
      console.error("Either votes or web3Account is undefined or null");
    }
  }, [votes, web3Account]);

  const formik = useFormik({
    validationSchema: Yup.object({
      content: Yup.string()
        .min(5, 'Comment should be at least 5 characters')
        .max(240, 'Comment should not exceed 240 characters')
        .required('Please enter a valid comment.'),
    }),
    initialValues: commentData,
    onSubmit: async (values, { setFieldValue }) => {
      const commentData = values;
      if (formik.isValid) {
        const handleComment = async (values) => {
          setLoading(true);
          let txid = await Pipeline.send(
            Pipeline.address,
            0,
            JSON.stringify(formik.values),
            undefined,
            undefined,
            0,
          );
          if (txid) {
            setFieldValue('content', '');
            toast.success('Transaction confirmed');
            upStreamComment(txid);
            setLoading(false);
          } else {
            toast.error('Failed to send comment, please try again.');
            setLoading(false);
          }
        };
        handleComment(commentData);
      }
    },
  });

  const fetchVotingPower = useCallback(async () => {
    setIsLoadingShutter(true);
    let localCurrent = await getRound();
    setCurrentRoundNumber(localCurrent);

    if (localCurrent > proposal?.maxRound) {
      setIsMaxRoundFuture(true);
    } else {
      setIsMaxRoundFuture(false);
    }

    let totalVotingPower = 0;
    let hasDelegatedPower = false;

    try {
      const { vp, reason } = await getPower(space, web3Account, proposal);

      setVotingPower(vp);
      totalVotingPower += vp; // adding the voting power of the current account to the total
      setVotingPowerByStrategy(proposal?.strategyType);
      setIsValidVoter(vp > 0 ? true : false);
      setReason(reason);

      let tempFilteredDelegates = [];

      for (let key in delegateContext) {
        if (delegateContext.hasOwnProperty(key)) {
          for (let appId in delegateContext[key]) {
            let delegations = delegateContext[key][appId].delegations;

            if (delegations) {
              for (let i = 0; i < delegations.length; i++) {
                if (delegations[i].delegate === web3Account && delegations[i].space === spaceKey) {
                  tempFilteredDelegates.push(delegateContext[key][appId].address);
                  break;
                }
              }
            } else {
              console.log('No delegations found for key:', key);
            }
          }
        }
      }

      // fetch the voting power for each delegate
      for (let i = 0; i < tempFilteredDelegates.length; i++) {
        const delegateVotingPower = await getPower(space, tempFilteredDelegates[i], proposal);
        totalVotingPower += delegateVotingPower.vp; // add the delegate's voting power to the total
      }

      setFilteredDelegates(tempFilteredDelegates);

      // Check if the user has delegated their voting power for the space
      for (let key in delegateContext) {
        if (delegateContext.hasOwnProperty(key) && key === web3Account) {
          const delegations = delegateContext[key];
          for (let appId in delegations) {
            const userDelegations = delegations[appId].delegations;
            if (userDelegations) {
              for (let i = 0; i < userDelegations.length; i++) {
                if (
                  userDelegations[i].space === '' ||
                  (userDelegations[i].space === spaceKey &&
                    userDelegations[i].delegate !== web3Account)
                ) {
                  hasDelegatedPower = true;
                  break;
                }
              }
            }
            if (hasDelegatedPower) break;
          }
        }
        if (hasDelegatedPower) break;
      }

      if (hasDelegatedPower) {
        totalVotingPower = 0; // Reset the total voting power to 0 if the user has delegated their voting power
      }
    } catch (error) {
      toast.error('Failed to fetch voting power:', error);
      setError('Failed to fetch voting power. Please try again.');
    } finally {
      setIsLoadingShutter(false);
    }

    // set the total voting power after all async operations have completed
    setTotalVotingPower(totalVotingPower);
  }, [proposal, space, web3Account, delegateContext]);

  const votingPowerFormatted = useMemo(() => {
    return totalVotingPower / Math.pow(10, decimals);
  }, [totalVotingPower, decimals]);

  const handleVote = async () => {
    setIsSending(true);
    try {
      let result = {
        id: voteTxnId,
        choice: selectedChoices,
      };
      setVoteLoading(true);
      let token = parseInt(proposal?.tokenData?.assetId);
      let opted = await isOpted(Pipeline.address, Number(appId));
      if (opted) {
        let txId = await Pipeline.appCall(Number(appId), ['vote', selectedChoices], undefined, [
          token,
        ]);
        if (txId === undefined) {
          toast.error('Error occured');
        } else {
          setVoteLoading(false);
          console.log(txId);
          setVoteTxnId(txId);
          upStream(txId);
          onOpenPostVoteModal();
          onReload();
          setVotedProposalId(proposal.id);
          setIsSending(false);
          onClose();
        }
      } else {
        toast.error('You are not opted in to voting app');
        setVoteLoading(false);
      }
      console.log('Result', result);
    } catch (error) {
      toast.error('vote failed', error);
    } finally {
      setIsSending(false);
      onReload();
    }
  };

  useEffect(() => {
    if (open) {
      fetchVotingPower();
      checkIfUserHasVoted();
    }
  }, [open, fetchVotingPower, checkIfUserHasVoted]);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setIsValidationAndPowerLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} title="Cast your vote">
      <div className="modal-body">
        <div className="flex flex-auto flex-col">
          <div className="m-4 space-y-4 text-skin-link">
            <MemoizedVoteDetails
              hasVotingPowerFailed={hasVotingPowerFailed}
              hasVotingValidationFailed={hasVotingValidationFailed}
              votingPower={votingPower}
              decimals={decimals}
              fetchVotingPower={fetchVotingPower}
              isValidationAndPowerLoaded={isValidationAndPowerLoaded}
              isValidationAndPowerLoading={isValidationAndPowerLoading}
              totalVotingPower={totalVotingPower}
              votingPowerByStrategy={votingPowerByStrategy}
              symbols={undefined}
              hasVoted={hasVoted}
              proposal={proposal}
              currentRoundNumber={currentRoundNumber}
              selectedChoices={selectedChoices}
              isUserOpted={isUserOpted}
              isMaxRoundFuture={isMaxRoundFuture}
              isValidVoter={isValidVoter}
              votingPowerFormatted={votingPowerFormatted}
              space={space}
              pipeState={pipeState}
              currentRound={currentRound}
              error={error}
              endPoints={endPoints}
              formatCompactNumber={formatCompactNumber}
            />
            <ModalVoteCommentForm proposal={proposal} formik={formik} />
          </div>
        </div>
      </div>
      <div className="border-t p-4 text-center">
        <div className="float-left w-2/4 pr-2">
          <Button
            data-v-1b931a55=""
            type="button"
            className="button relative block w-full px-[22px] hover:border-skin-text"
            onClick={() => onClose()}
          >
            Cancel
          </Button>
        </div>
        <div className="float-left w-2/4 pl-2">
          {isUserOpted ? (
            <Button
              data-v-4a6956ba=""
              className="button button--primary block w-full w-full px-[22px] hover:brightness-95"
              loading={isSending}
              primary
              data-testid="confirm-vote-button"
              disabled={
                isMaxRoundFuture ||
                hasVoted ||
                isValidationAndPowerLoading ||
                totalVotingPower === 0 ||
                votingPower === 0 ||
                !isValidVoter ||
                isLoadingShutter ||
                isSending ||
                formik.isSubmitting
              }
              onClick={handleVote}
            >
              Confirm
            </Button>
          ) : (
            <VoteOptInButton
              setIsUserOpted={setIsUserOpted}
              spaceKey={space?.domain}
              space={space}
              applicationId={appId}
              bg={''}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default VoteModal;
