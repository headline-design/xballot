import { Fragment, useRef, useCallback, useMemo, useState } from 'react';
import { Button } from 'components/BaseComponents/Button';
import { useFormik, FormikValues } from 'formik';
import { toast } from 'react-hot-toast';
import { getBalances } from 'utils/functions';
import Pipeline from '@pipeline-ui-2/pipeline/index';
import algosdk from 'algosdk';
import * as Yup from 'yup';
import { HeartFilledIcon } from 'icons/HeartFilled';
import { HeartOutlineIcon } from 'icons/HeartOutline';
import { Modal } from 'components/BaseComponents/Modal';
import { NoticeIcon } from 'icons/NoticeIcon';
import FormikTextArea from './FormikTextArea';
import { CommentIcon } from 'icons/Comment';
import { getEndpoints } from 'utils/endPoints';
import BaseLink from 'components/BaseComponents/BaseLink';
import { ReBlastIcon } from 'icons/ReBlast';

export const INTERACTION_TYPES = {
  COMMENT: 'comment',
  LIKE: 'like',
  REBLAST: 'reBlast',
};

export default function ActionModal({
  space,
  appId,
  interactionCount,
  userInteractionCount,
  postKey,
  threadKey,
  isInteracted,
  interactionType,
}) {
  const endPoints = getEndpoints();
  const algodClient = new algosdk.Algodv2('', endPoints.node, '');
  const interactionRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    resetTransactionState();
  }, []);

  const resetTransactionState = useCallback(() => {
    setIsTransactionPending(false);
    setIsTransactionSuccess(false);
    setIsTransactionError(false);
    setTransactionErrorMessage('');
    setLoading(false);
    setDisabled(false);
    setIsTransactionActive(false);
  }, []);

  const getInteractionStatus = useCallback((txId) => {
    // Fetch the status from localStorage
    const status = localStorage.getItem(`interactionStatus-${txId}`);
    return status === 'true';
  }, []);

  const saveInteractionStatus = useCallback((txId, status) => {
    // Save the status to localStorage
    localStorage.setItem(`interactionStatus-${txId}`, status);
  }, []);

  const [isTransactionActive, setIsTransactionActive] = useState(false);
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [isTransactionSuccess, setIsTransactionSuccess] = useState(false);
  const [isTransactionError, setIsTransactionError] = useState(false);
  const [transactionErrorMessage, setTransactionErrorMessage] = useState('');
  const [txId, setTxId] = useState();
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLocalInteracted, setIsInteracted] = useState(() => getInteractionStatus(txId) || false);
  const [interactions, setInteractions] = useState(0);

  const handleClick = useCallback(
    (event) => {
      event.preventDefault();
      openModal();
    },
    [openModal],
  );

  const [interactionData, setInteractionData] = useState({
    appId: appId,
    postId: postKey,
    commentId: threadKey,
    type: interactionType,
    ...(interactionType === 'comment' ? { content: '' } : null),
  });

  const getValidationSchema = useCallback((interactionType) => {
    switch (interactionType) {
      case 'comment':
        return Yup.object({
          type: Yup.string()
            .min(4, 'Interaction should be at least 4 characters')
            .max(240, 'Interaction should not exceed 240 characters')
            .required('Please enter a valid interaction.'),
        });
      default:
        return Yup.object({
          type: Yup.string(),
        });
    }
  }, []);

  const formik = useFormik({
    validationSchema: useMemo(
      () => getValidationSchema(interactionType),
      [getValidationSchema, interactionType],
    ),
    initialValues: interactionData,
    onSubmit: async (values, { setFieldValue }) => {
      setDisabled(true);
      const interactionData = values;
      if (formik.isValid) {
        setLoading(true);
        setDisabled(true);
        setIsTransactionActive(true);
        let token = parseInt(space?.forum?.token) || 0;
        let tokenAmount = parseInt(space?.forum?.tokenAmount) || 1000000000000000;
        let balances = await getBalances(Pipeline.address, [token], false);
        let address = algosdk.getApplicationAddress(parseInt(appId));
        if ((token && balances.assets[token] >= tokenAmount) || !Pipeline.main) {
          try {
            setIsTransactionPending(true);
            let txId = await Pipeline.send(
              address,
              0,
              JSON.stringify(formik.values),
              undefined,
              undefined,
              0,
            );
            if (txId) {
              setTxId(txId);
              let response = await algosdk.waitForConfirmation(algodClient, txId, 1000);
              console.log(JSON.stringify(response));
              setTxId(txId);
              console.log(txId);
              setIsTransactionPending(false);
              setIsTransactionSuccess(true);
              toast.success('Transaction confirmed');
              setLoading(false);
              setInteractions(interactions + (isInteracted ? -1 : 1));
              setIsInteracted(!isInteracted);
              saveInteractionStatus(txId, !isInteracted);
            } else if (txId === undefined) {
              toast.error('Error occured');
              resetTransactionState();
              formik.resetForm();
            }
          } catch (error) {
            toast.error('Error occured');
            console.log(error);
            resetTransactionState();
          }
        }
      }
    },
  });

  let interactionHoverStyle = '';
  if (interactionType === 'comment') {
    interactionHoverStyle = 'group-hover:text-sky-500';
  } else if (interactionType === 'like') {
    interactionHoverStyle = 'group-hover:text-rose-500';
  } else if (interactionType === 'reBlast') {
    interactionHoverStyle = 'group-hover:text-green-500';
  }

  let interactionSpacingStyle = '';
  if (interactionType === 'comment') {
    interactionSpacingStyle = 'pl-0';
  }

  const ActionNotice = useCallback(() => {
    let message;

    switch (true) {
      case isTransactionPending:
        message = 'Submitting transaction... Please wait for round confirmation';
        break;
      case isTransactionError:
        message = `Error executing interaction: ${transactionErrorMessage}`;
        break;
      case isTransactionSuccess:
        message = `Your ${interactionType} is live! View your interaction on the Algorand blockchain:`;
        break;
      default:
        switch (interactionType) {
          case 'comment':
            message = 'Please sign transaction with your Algorand wallet to comment on this post.';
            break;
          case 'like':
            message = 'Please sign transaction with your Algorand wallet to like this post.';
            break;
          case 'reBlast':
            message = 'Please sign transaction with your Algorand wallet to rebroadcast this post.';
            break;
          default:
            message =
              'Please sign transaction with your Algorand wallet to interact with this post.';
            break;
        }
    }

    return (
      <div className="m-4 space-y-1 text-skin-text">
        <div className="mb-3 rounded-xl border border-y border-skin-border bg-skin-block-bg text-base text-skin-text md:rounded-xl md:border">
          <div className="p-4 leading-5 sm:leading-6">
            <div>
              <NoticeIcon />
              <div className="leading-5">
                {message}{' '}
                {isTransactionSuccess && (
                  <BaseLink hideExternalIcon={false} link={endPoints.explorer + 'tx/' + txId}>
                    TxId link
                  </BaseLink>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [
    isTransactionSuccess,
    endPoints.explorer,
    txId,
    isTransactionPending,
    isTransactionError,
    transactionErrorMessage,
    interactionType,
  ]);

  return (
    <Fragment>
      <button
        onClick={handleClick}
        className="tablet:pr-4 group flex items-center rounded-full pl-0 text-md text-skin-text transition-colors duration-200 hover:text-skin-link"
      >
        <div
          className={`w-9 h-9 hover-transition cursor-pointer rounded-full p-2 ${interactionSpacingStyle}`}
        >
          {interactionType === INTERACTION_TYPES.LIKE &&
            (isInteracted ? <HeartFilledIcon /> : <HeartOutlineIcon />)}
          {interactionType === INTERACTION_TYPES.COMMENT && <CommentIcon />}
          {interactionType === INTERACTION_TYPES.REBLAST && <ReBlastIcon />}
        </div>
        <p className={`text-xs ${interactionHoverStyle}`}>{interactionCount}</p>
      </button>
      <Modal
        onClose={closeModal}
        open={isOpen}
        title={
          interactionType === 'comment'
            ? 'Comment'
            : interactionType === 'like'
            ? 'Like'
            : 'Reblast'
        }
      >
        <div className="modal-body">
          <div className="min-h-[150px] space-y-3">
            <div className="leading-5 sm:leading-6">
              <div>
                <ActionNotice />
                <div className="m-4 space-y-1">
                  {interactionType === INTERACTION_TYPES.COMMENT && (
                    <form ref={interactionRef} onSubmit={formik.handleSubmit}>
                      <FormikTextArea
                        value={formik.values.content}
                        name={'content'}
                        formik={formik as FormikValues}
                        count={true}
                        maxLength={240}
                        title={undefined}
                        id={'content'}
                        errorTag={formik.touched.content && formik.errors.content}
                        errorField={formik.errors.content}
                      />
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t p-4 text-center">
          <div className="float-left w-2/4 pr-2">
            <Button
              type="button"
              className="button button--secondary w-full px-[22px] hover:brightness-95"
              data-v-4a6956ba=""
              onClick={closeModal}
            >
              Cancel
            </Button>
          </div>{' '}
          <div className="float-left w-2/4 pl-2">
            <Button
              loading={loading}
              disabled={
                interactionType === 'comment'
                  ? !(formik.dirty && formik.isValid)
                    ? true
                    : loading
                    ? true
                    : false
                  : loading
                  ? true
                  : false
              }
              className="button button--primary w-full px-[22px] hover:brightness-95"
              data-v-4a6956ba=""
              onClick={formik.handleSubmit}
            >
              {interactionType === 'comment'
                ? 'Comment'
                : interactionType === 'like'
                ? 'Like'
                : 'Reblast'}
            </Button>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
}
