import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import moment from 'moment';

import { BackButton } from 'components/BaseComponents/BackButton';
import { ButtonShare } from 'components/BaseComponents/ButtonShare';
import { Markdown } from 'components/BaseComponents/Markdown';
import { ForumPopover } from 'components/ProfilePopover/ForumPopover';
import ActionBar from 'components/BaseComponents/ActionBar';
import PageLoader from 'components/Loaders/LoadingPage';
import CommentBlock from './Components/CommentBlock';
import Pipeline from '@pipeline-ui-2/pipeline/index';
import { Block } from 'components/BaseComponents/Block';
import { CommentThreadItem, CommentThreadItemProps } from './Components/CommentThreadItem';

export const SubThreadPost = ({ posts, space, profiles, myAddress }) => {
  const { postKey, threadKey, subThreadKey, spaceKey } = useParams();
  const [comment, setComment] = useState(null);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyCount, setReplyCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isReplied, setIsReplied] = useState(false);
  const [userLikeCount, setUserLikeCount] = useState(0);
  const [userReplyCount, setUserReplyCount] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [userReplied, setUserReplied] = useState(false);

  const countThreadEntries = useCallback((thread, loggedInUserAddress) => {
    let likeCount = 0;
    let replyCount = 0;
    let userReplyCount = 0;
    let userLikeCount = 0;

    if (typeof thread === 'object') {
      Object.values(thread).forEach((entry: any) => {
        if (entry.type === 'like') {
          likeCount++;
          if (entry.sender && entry.sender === loggedInUserAddress) {
            userLikeCount++;
          }
        } else if (entry.type === 'reply') {
          replyCount++;
          if (entry.sender && entry.sender === loggedInUserAddress) {
            userReplyCount++;
          }
        }
      });
    }

    return {
      likeCount,
      replyCount,
      userReplyCount,
      userLikeCount,
    };
  }, []);

  const getReplies = useCallback((thread: any) => {
    if (typeof thread === 'object') {
      return Object.values(thread).filter((entry: any) => entry?.data?.type === 'comment');
    }
    return []; // return an empty array if 'thread' is not an array
  }, []);

  useEffect(() => {
    if (typeof posts === 'object') {
      const selectedPost = posts[postKey];
      if (selectedPost) {
        setPost(selectedPost);
        const selectedComment = selectedPost.thread?.[threadKey]?.subThread?.[subThreadKey];
        if (selectedComment) {
          setComment(selectedComment);
          setLoading(false);
        }
      }
    }
  }, [postKey, posts, subThreadKey, threadKey]);

  console.log('post', post);

  useEffect(() => {
    if (comment) {
      const { likeCount, replyCount, userReplyCount, userLikeCount } = countThreadEntries(
        comment.thread,
        Pipeline.address,
      );
      setReplyCount(replyCount);
      setLikeCount(likeCount);
      setIsLiked(userLikeCount > 0);
      setIsReplied(userReplyCount > 0);
      setUserLikeCount(userLikeCount);
      setUserReplyCount(userReplyCount);
    }
  }, [comment, countThreadEntries]);

  const time = comment?.timeStamp;
  const memoizedReplies = useMemo(
    () => getReplies(comment?.subThread || []),
    [comment, getReplies],
  );

  return (
    <>
      <div id="content-right" className="relative float-right w-full pl-0 lg:w-3/4 lg:pl-5">
        <div className="mb-3 px-3 md:px-0">
          <BackButton link={`/${spaceKey}/forum/post/${postKey}`} />
        </div>
        <div className="px-4 md:px-0">
          <h1 className="mb-4">Thread comment</h1>
        </div>
        {!comment || loading ? (
          <PageLoader />
        ) : (
          <>
            <Block>
              <div className="mb-4 flex flex-col sm:flex-row sm:space-x-1">
                <div className="flex grow items-center space-x-1">
                  <ForumPopover
                    creator={comment?.sender}
                    profiles={profiles}
                    hideAvatar={undefined}
                    profile={undefined}
                  />
                  <div className="State mr-2 bg-violet-600 text-white" data-v-f27e3bae="">
                    OP
                  </div>
                </div>
              </div>
              <div className="mb-3 break-words text-xl leading-8 sm:text-2xl">
                <Markdown source={comment?.data?.content || 'No content available'} />
              </div>
              <div className="ml-[53px]">
                <div className="lt-text-gray-500 my-3 text-sm">
                  <span title="Mar 17, 2023, 12:24:30 PM">
                    {moment.unix(time).format('h:mm A · MMM D, YYYY')}
                  </span>
                  <span> · Posted via {space?.name} Forum</span>
                </div>
                <div className="lt-text-gray-500 sm:gap-8 flex flex-wrap items-center gap-6 py-3 text-sm">
                  <span>
                    <b className="text-skin-link">{replyCount}</b> Replies
                  </span>
                  <button type="button">
                    <b className="ml-3 text-skin-link">{likeCount}</b> Likes
                  </button>
                </div>
              </div>
              <div className="mb-1 mt-1 border-t" />
              <ActionBar
                appId={space?.appId}
                threadId={comment?.id}
                isLiked={isLiked}
                isCommented={isReplied}
                userLikeCount={userLikeCount}
                userCommentCount={userReplyCount}
                space={space}
                shareButton={<ButtonShare space={space} shareText={undefined} />}
                commentCount={undefined}
                reBlastCount={undefined}
                likeCount={undefined}
                isReBlasted={undefined}
                userReBlastCount={undefined}
                postKey={postKey ? postKey : undefined}
                threadKey={subThreadKey ? subThreadKey : undefined}
              />
              <CommentBlock
                myAddress={myAddress}
                profiles={profiles}
                post={comment}
                commentCount={replyCount}
                threadId={comment?.id}
                isCommented={isReplied}
                userCommentCount={userReplyCount}
                space={undefined}
                appId={undefined}
                postKey={undefined}
              />
            </Block>

            {comment.subThread && (
              <div className="my-4 space-y-4">
                {memoizedReplies.map((reply: CommentThreadItemProps, i) => (
                  <div key={`ReplyItem_${i}`}>
                    <CommentThreadItem
                      txId={undefined}
                      creator={comment?.sender}
                      profiles={profiles}
                      content={reply?.data?.content}
                      title={undefined}
                      createdAt={moment.unix(reply?.timeStamp).format('h:mm A · MMM D, YYYY')}
                      post={reply}
                      voted={undefined}
                      latestRound={undefined}
                      hot={undefined}
                      space={undefined}
                      appId={undefined}
                      creatorName={undefined}
                      creatorImage={undefined}
                      commentCount={undefined}
                      likeCount={undefined}
                      isCommented={undefined}
                      isLiked={undefined}
                      userCommentCount={undefined}
                      userLikeCount={undefined}
                      commentId={subThreadKey ? subThreadKey : undefined}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};
