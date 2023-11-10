import { useRef, useState } from 'react';
import { Button } from 'components/BaseComponents/Button';
import { useFormik } from 'formik';
import { toast } from 'react-hot-toast';
import { getBalances } from 'utils/functions';
import Pipeline from "@pipeline-ui-2/pipeline/index";
import algosdk from 'algosdk';
import { useNavigate } from 'react-router';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import FormikTextArea from './FormikTextArea';
import { CommentIcon } from 'icons/Comment';
import { Modal } from 'components/BaseComponents/Modal';

export default function CommentModal({
  space,
  appId,
  commentCount,
  userCommentCount,
  postKey,
  threadKey,
}) {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  //console.log(threadKey)

  const navigate = useNavigate();
  const [showLoader, setShowLoader] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isLocalCommented, setIsCommented] = useState(false);
  const [comments, setComments] = useState(0);
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

  const [commentData, setCommentData] = useState({
      content: '',
      appId: appId,
      postId: postKey,
      commentId: threadKey,
      type: 'comment',
  });

  const formik = useFormik({
    validationSchema: Yup.object({
      content: Yup.string()
        .min(5, 'Comment should be at least 5 characters')
        .max(240, 'Comment should not exceed 240 characters')
        .required('Please enter a valid comment.'),
    }),
    initialValues: commentData,
    onSubmit: async (values, { setFieldValue }) => {
      setDisabled(true);
      const commentData = values;
      if (formik.isValid) {
        const handleComment = async (values) => {
          setLoading(true);
          setDisabled(true);
          let token = parseInt(space?.forum?.token) || 0;
          let tokenAmount = parseInt(space?.forum?.tokenAmount) || 1000000000000000;
          let balances = await getBalances(Pipeline.address, [token], false);
          //console.log('balances', balances);
          if ((token && balances?.assets[token] >= tokenAmount) || !Pipeline.main) {
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
            setComments(comments + (isLocalCommented ? -1 : 1));
            setIsCommented(!isLocalCommented);

            // Set userCommentCount and userLikeCount in local storage
            localStorage.setItem('userCommentCount', userCommentCount + 1);
          } else {
            toast('You are too poor to comment!');
            setLoading(false);
          }
        };
        await handleComment(commentData);
        const { forceStayOpen, open } = registrationLoading;
      } else {
        setShowLoader(true);
      }
    },
  });

  return (
    <>
      <button
        onClick={handleClick}
        className="tablet:pr-4 group flex items-center rounded-full pl-0 text-md text-skin-text transition-colors duration-200 hover:text-skin-link"
      >
        <div className="w-9 h-9 hover-transition cursor-pointer rounded-full p-2 pl-0 group-hover:bg-sky-100">
          <span className="group-hover:fill-sky-500">
            <CommentIcon />
          </span>
        </div>
        <p className="text-xs group-hover:text-sky-500"> {commentCount}</p>
      </button>

      <Modal onClose={closeModal} open={isOpen} title={'Comment'}>
        <div className="modal-body">
          <div className="m-4">
            <div className="min-h-[150px] space-y-3">
              <div className="leading-5 sm:leading-6">
                <div>
                  <form onSubmit={formik.handleSubmit}>
                    <FormikTextArea
                      value={formik.values.content}
                      name={'content'}
                      formik={formik}
                      count={true}
                      maxLength={240}
                      title={undefined}
                      id={'content'}
                      errorTag={formik.touched.content && formik.errors.content}
                      errorField={formik.errors.content}
                    />
                  </form>
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
            <Button
              loading={loading}
              disabled={!(formik.dirty && formik.isValid) ? true : loading ? true : false}
              className="button button--primary w-full px-[22px] hover:brightness-95"
              data-v-4a6956ba=""
              type="button"
              onClick={formik.submitForm}
            >
              Comment
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
