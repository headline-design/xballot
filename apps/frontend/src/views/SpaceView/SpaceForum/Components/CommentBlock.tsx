import React, { useRef, useState } from 'react';
import { shorten } from 'helpers/utils';
import { Button } from 'components/BaseComponents/Button';
import { useFormik } from 'formik';
import { toast } from 'react-hot-toast';
import { getBalances } from 'utils/functions';
import Pipeline from "@pipeline-ui-2/pipeline/index";
import algosdk from 'algosdk';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import FormikTextArea from './FormikTextArea';
import { ImageIcon } from 'icons/ImageIcon';
import { useProfileInfo } from 'hooks/useProfileInfo';
import { staticEndpoints } from 'utils/endPoints';

export default function CommentBlock({
  space,
  appId,
  commentCount,
  userCommentCount,
  threadId,
  postKey,
  myAddress,
  profiles,
  isCommented,
  post,
}) {
  let [isOpen, setIsOpen] = useState(false);

  const [showLoader, setShowLoader] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isLocalCommented, setIsCommented] = useState(false);
  const [comments, setComments] = useState(0);
  const dispatch = useAppDispatch();
  const { registrationLoading } = useAppSelector((state) => state.loaders);
  const { creatorName, creatorAvatar } = useProfileInfo(profiles, myAddress);

  const [commentData, setCommentData] = useState({
    content: '',
    appId: appId,
    postId: postKey,
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
      <form onSubmit={formik.handleSubmit}>
        <div>
          <div>
            <div className="min-h-[150px] space-y-3">
              <div className="leading-5 sm:leading-6">
                <div>
                  <section className=" flex flex-auto grow flex-row items-center gap-3 space-x-1">
                    <span className="flex-48 flex ">
                      <span className="flex shrink-0 items-center justify-center">
                        <img
                          className="rounded-full bg-skin-border object-cover"
                          alt="avatar"
                          style={{ width: 48, height: 48, minWidth: 48, display: 'none' }}
                        />
                        <img
                          src={myAddress ? creatorAvatar || `${staticEndpoints.stamp}space/${myAddress}` :  `${staticEndpoints.stamp}space/${postKey}`}
                          className="rounded-full bg-skin-border object-cover"
                          alt="avatar"
                          style={{ width: 48, height: 48, minWidth: 48 }}
                        />
                        {/**/}
                      </span>
                    </span>
                    <div className="space-y-10 w-full">
                      <div className="lt-text-gray-500 my-3 text-sm">
                        <span>Replying to </span>
                        <span> @{shorten(post?.sender)}</span>
                      </div>
                      <div className="h-56 flex-1">
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
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className="flex flex-auto items-center ">
                          <div className="w-9 h-9 hover-transition cursor-pointer rounded-full p-2 group-hover:bg-rose-100">
                            <ImageIcon />
                          </div>
                          <div className="w-9 h-9 hover-transition cursor-pointer rounded-full p-2 group-hover:bg-rose-100"></div>
                        </span>
                        <Button
                          loading={loading}
                          disabled={
                            !(formik.dirty && formik.isValid) ? true : loading ? true : false
                          }
                          className="button button--primary mb-0 w-auto px-[22px] hover:brightness-95 "
                          data-v-4a6956ba=""
                          type="submit"
                        >
                          Comment
                        </Button>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
