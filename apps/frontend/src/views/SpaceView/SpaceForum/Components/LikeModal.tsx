import { Fragment, useRef, useState } from 'react';
import { shorten, shortenAddress } from 'helpers/utils';
import { Button } from 'components/BaseComponents/Button';
import { useFormik } from 'formik';
import { toast } from 'react-hot-toast';
import { getBalances } from 'utils/functions';
import Pipeline from "@pipeline-ui-2/pipeline/index";
import algosdk from 'algosdk';
import { useNavigate } from 'react-router';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { HeartFilledIcon } from 'icons/HeartFilled';
import { HeartOutlineIcon } from 'icons/HeartOutline';
import { Modal } from 'components/BaseComponents/Modal';
import { NoticeIcon } from 'icons/NoticeIcon';

export default function LikeModal({
  space,
  appId,
  likeCount,
  postKey,
  threadKey,
  isLiked,
  userLikeCount,
}) {
  const likeRef = useRef(null);
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function saveLikeStatus(txId, status) {
    localStorage.setItem(`likeStatus-${txId}`, JSON.stringify(status));
  }

  function getLikeStatus(txId) {
    const storedStatus = localStorage.getItem(`likeStatus-${txId}`);
    return storedStatus ? JSON.parse(storedStatus) : null;
  }

  //console.log(likeRef);

  const navigate = useNavigate();
  const [showLoader, setShowLoader] = useState(false);
  const [txId, setTxId] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLocalLiked, setIsLiked] = useState(() => getLikeStatus(txId) || false);
  const [likes, setLikes] = useState(0);
  const dispatch = useAppDispatch();
  const { registrationLoading } = useAppSelector((state) => state.loaders);

  function handleClose() {
    setShowLoader(false);
    window.location.reload();
  }

  const handleClick = (event) => {
    event.preventDefault();
    openModal();
  };

  const [likeData, setLikeData] = useState({
    appId: appId,
    postId: postKey,
    commentId: threadKey,
    type: 'like',
  });

  const formik = useFormik({
    validationSchema: Yup.object({
      type: Yup.string()
        .min(4, 'Like should be at least 5 characters')
        .max(240, 'Like should not exceed 240 characters')
        .required('Please enter a valid like.'),
    }),
    initialValues: likeData,
    onSubmit: async (values, { setFieldValue }) => {
      setDisabled(true);
      const likeData = values;
      if (formik.isValid) {
        const handleLike = async (values) => {
          const { likeRef } = values;
          setLoading(true);
          setDisabled(true);
          let token = parseInt(space?.forum?.token) || 0;
          let tokenAmount = parseInt(space?.forum?.tokenAmount) || 1000000000000000;
          let balances = await getBalances(Pipeline.address, [token], false);
          //console.log('balances', balances);
          if ((token && balances.assets[token] >= tokenAmount) || !Pipeline.main) {
            let address = algosdk.getApplicationAddress(parseInt(appId));
            let txid = await Pipeline.send(
              address,
              0,
              JSON.stringify(formik.values),
              undefined,
              undefined,
              0,
            );
            toast.success('Transaction confirmed');
            console.log('txid', txid);
            setLoading(false);
            setIsOpen(false);
            setLikes(likes + (isLiked ? -1 : 1));
            setIsLiked(!isLiked);
            saveLikeStatus(txId, !isLiked);
          } else {
            toast('You are too poor to like!');
            setLoading(false);
          }
        };
        await handleLike(likeData);
        const { forceStayOpen, open } = registrationLoading;
      } else {
        setShowLoader(true);
      }
    },
  });

  const LikeNotice = () => (
    <div className="mb-3 rounded-xl border border-y border-skin-border bg-skin-block-bg text-base text-skin-text md:rounded-xl md:border">
      <div className="p-4 leading-5 sm:leading-6">
        <div>
          <NoticeIcon />
          <div className="leading-5">
            Please sign transaction with your Algorand wallet to like Forum post.{' '}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={handleClick}
        className="tablet:px-4 group flex flex items-center items-center gap-1 rounded-full p-[6px] text-md text-skin-text transition-colors duration-200 hover:text-skin-link"
      >
        <div className="w-9 h-9 hover-transition group-hover:bg-red-100 cursor-pointer rounded-full p-2">
          <span className={`group-hover:${isLiked || isLocalLiked ? '!bg-red' : ' text-gray-400'}`}>
            {isLiked || isLocalLiked ? <HeartFilledIcon /> : <HeartOutlineIcon />}
          </span>
        </div>
        <p
          style={{
            transform: 'translate3d(0px, 0px, 0px)',
            transitionProperty: 'transform',
            transitionDuration: '0.3s',
          }}
          className={`text-xs group-hover:text-rose-500 ${
            isLiked || isLocalLiked ? 'color-rose-500 text-rose-500' : ' text-gray-400'
          }`}
        >
          {likeCount}
        </p>
      </button>

      <Modal onClose={closeModal} open={isOpen} title={'Like'}>
        <div className="modal-body">
          <div className="min-h-[150px] space-y-3">
            <div className="leading-5 sm:leading-6">
              <div>
                <div className="m-4 space-y-1 text-skin-text">
                  <LikeNotice />
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={closeModal}
          type="button"
          className="absolute right-3 top-[20px] flex items-center rounded-full p-[6px] text-md text-skin-text transition-colors duration-200 hover:text-skin-link"
        >
          <svg viewBox="0 0 24 24" width="1.2em" height="1.2em">
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

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
            <form
              onSubmit={(event) => {
                event.preventDefault();
                formik.handleSubmit();
              }}
            >
              <Button
                loading={loading}
                disabled={loading ? true : false}
                className="button button--primary w-full px-[22px] hover:brightness-95"
                data-v-4a6956ba=""
                type="submit"
              >
                Like
              </Button>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
}
