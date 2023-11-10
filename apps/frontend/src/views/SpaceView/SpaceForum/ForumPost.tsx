import { ButtonShare } from 'components/BaseComponents/ButtonShare';
import { Markdown } from 'components/BaseComponents/Markdown';
import { ButtonMore } from 'components/BaseComponents/ButtonMore';
import { BackButton } from 'components/BaseComponents/BackButton';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Block } from 'components/BaseComponents/Block';
import Pipeline from '@pipeline-ui-2/pipeline/index';
import PageLoader from 'components/Loaders/LoadingPage';
import { Button } from 'components/BaseComponents/Button';
import { DiscussionBlock } from '../SpaceProposal/Components/DiscussionBlock';
import ForumTypeBadge from 'components/BaseComponents/ForumTypeBadge';
import ActionBar from 'components/BaseComponents/ActionBar';
import moment from 'moment';
import CommentBlock from './Components/CommentBlock';
import { ForumPopover } from 'components/ProfilePopover/ForumPopover';
import { CommentItem } from './Components/Comment';
import { useParams } from 'react-router-dom';
import ReportModal from 'components/BaseComponents/ReportModal';
import { getEndpoints } from 'utils/endPoints';

const reportData = { appId: 0, txid: '' };

interface Comment {
  sender: string;
  id: string;
  data: {
    content: string;
    title: string;
  };
  timeStamp: number;
  subThread: any;
}

interface Space {
  name: string;
}

export interface Post {
  thread: any;
  content?: string;
  data?: {
    content: string;
    title: string;
  };
  timeStamp: number;
  subThreadCount?: {
    subThreadCommentCount: number;
    subThreadLikeCount: number;
    subThreadReBlastCount: number;
  };
  discussion?: string;
  sender?: string;
  id?: string;
}

interface Profile {
  // Define your profile interface here
}

interface Props {
  space: Space;
  posts: any;
  appId: any;
  profiles: Profile[];
  creator: string;
  myAddress: string;
}

export const ForumPost: React.FC<Props> = ({
  space,
  posts,
  appId,
  profiles,
  creator,
  myAddress,
}) => {
  const [loading, setLoading] = useState(true);
  const { spaceKey, postKey, threadKey } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [showFullMarkdownBody, setShowFullMarkdownBody] = useState(false);
  const markdownBody = useRef<HTMLDivElement>(null);
  const [commentCount, setCommentCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [reBlastCount, setReBlastCount] = useState(0);
  const [subThreadCommentCount, setSubThreadCommentCount] = useState(0);
  const [subThreadLikeCount, setSubThreadLikeCount] = useState(0);
  const [subThreadReBlastCount, setSubThreadReBlastCount] = useState(0);
  const [userReBlastCount, setUserReBlastCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isCommented, setIsCommented] = useState(false);
  const [userLikeCount, setUserLikeCount] = useState(0);
  const [userCommentCount, setUserCommentCount] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [userCommented, setUserCommented] = useState(false);
  const [isModalReportOpen, setIsModalReportOpen] = useState(false);
  const endPoints = getEndpoints();
  const [reported, setReported] = useState([]);

  async function getReported() {
    let data = await fetch(endPoints.worker + 'v1/reports');
    let dataJSON = await data.json();

    let reportedTxids = [];

    Object.keys(dataJSON).forEach((txid) => {
      reportedTxids.push(dataJSON[txid]?.properties?.txid);
    });

    setReported([...reportedTxids]);
  }

  useEffect(() => {
    getReported();
  }, []);

  useEffect(() => {
    reportData.appId = parseInt(appId);
  }, [appId]);

  const handleReport = async (id = '') => {
    reportData.txid = id;
    setIsModalReportOpen(true);
  };

  const countSubThreadEntries = useCallback((subThread: any) => {
    let subThreadLikeCount = 0;
    let subThreadReBlastCount = 0;
    let subThreadCommentCount = 0;

    if (typeof subThread === 'object') {
      Object.values(subThread).forEach((entry: any) => {
        const post = entry.data;

        if (post.type === 'like') {
          subThreadLikeCount++;
        } else if (post.type === 'comment') {
          subThreadCommentCount++;
        } else if (post.type === 'reBlast') {
          subThreadReBlastCount++;
        }
      });
    }

    return {
      subThreadLikeCount,
      subThreadCommentCount,
      subThreadReBlastCount,
    };
  }, []);

  const getComments = useCallback((thread: any) => {
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
        setLoading(false);
      }
    }
  }, [posts, postKey]);

  const [threadCounts, setThreadCounts] = useState({
    commentCount: 0,
    likeCount: 0,
    reBlastCount: 0,
    userReBlastCount: 0,
    isLiked: false,
    isCommented: false,
    userLikeCount: 0,
    userCommentCount: 0,
    userLiked: false,
    userCommented: false,
  });

  const countThreadEntries = useCallback((thread: any, loggedInUserAddress: string) => {
    let counts = {
      commentCount: 0,
      likeCount: 0,
      reBlastCount: 0,
      userCommentCount: 0,
      userLikeCount: 0,
      userReBlastCount: 0,
    };

    if (typeof thread === 'object') {
      Object.values(thread).forEach((entry: any) => {
        const post = entry.data;

        if (post.type === 'like') {
          counts.likeCount++;
          if (entry.sender && entry.sender === loggedInUserAddress) {
            counts.userLikeCount++;
          }
        } else if (post.type === 'comment') {
          counts.commentCount++;
          if (entry.sender && entry.sender === loggedInUserAddress) {
            counts.userCommentCount++;
          }
        } else if (post.type === 'reBlast') {
          counts.reBlastCount++;
          if (entry.sender && entry.sender === loggedInUserAddress) {
            counts.userReBlastCount++;
          }
        }
      });
    }

    return counts;
  }, []);

  useEffect(() => {
    if (typeof posts === 'object') {
      const selectedPost = posts[postKey];
      if (selectedPost) {
        setPost(selectedPost);
        setLoading(false);
      }
    }
  }, [posts, postKey]);

  useEffect(() => {
    if (post) {
      const counts = countThreadEntries(post.thread, Pipeline.address);
      setThreadCounts((prevCounts) => ({ ...prevCounts, ...counts }));
      setSubThreadCommentCount(post?.subThreadCount?.subThreadCommentCount || 0);
      setSubThreadLikeCount(post?.subThreadCount?.subThreadLikeCount || 0);
      setSubThreadReBlastCount(post?.subThreadCount?.subThreadReBlastCount || 0);
    }
  }, [post, countThreadEntries]);

  useEffect(() => {
    console.log('Updated Posts:', posts);
  }, [posts]);

  useEffect(() => {
    if (!showFullMarkdownBody) window.scrollTo(0, 0);
  }, [showFullMarkdownBody]);

  const truncateMarkdownBody = useMemo(
    () => markdownBody.current && markdownBody.current.clientHeight > 400,
    [markdownBody],
  );

  let time = post?.timeStamp;
  const memoizedComments = useMemo(() => getComments(post?.thread || []), [post, getComments]);

  //console.log('comment', memoizedComments);

  //console.log(post);
  //console.log(postKey);

  return (
    <>
      <div id="content-right" className="relative float-right w-full pl-0 lg:w-3/4 lg:pl-5">
        <div className="mb-3 px-3 md:px-0">
          <BackButton />
        </div>
        <div className="px-4 md:px-0">
          <h1 className="mb-4">Forum post</h1>
        </div>
        {!post || loading ? (
          <PageLoader />
        ) : (
          <>
            <Block>
              <div className="mb-4 flex flex-col sm:flex-row sm:space-x-1">
                <div className="flex grow items-center space-x-1">
                  <ForumPopover
                    creator={post?.sender}
                    profiles={profiles}
                    hideAvatar={undefined}
                    profile={undefined}
                  />
                  <div className="flex items-center sm:mb-0">
                    <ForumTypeBadge content={post} space={space} type={'post'} />
                  </div>
                  <div className="  !ml-auto inline-block pl-3 text-left">
                    <ButtonMore
                      postId={post?.id}
                      username={post?.sender}
                      className={undefined}
                      width={'1.5em'}
                      height={'1.5em'}
                      report={() => handleReport(post.id)}
                      share={undefined}
                    />
                  </div>
                </div>
              </div>
              {post?.data?.title && (
                <h1 className="mb-3 break-words text-xl leading-8 sm:text-2xl">
                  {post?.data?.title}
                </h1>
              )}
              <div className={`relative ${post?.content?.length ? '' : 'd-none'}`}>
                {!showFullMarkdownBody && truncateMarkdownBody && (
                  <div className="absolute bottom-0 h-[80px] w-full bg-gradient-to-t from-skin-bg" />
                )}
                {truncateMarkdownBody && (
                  <div
                    className={`absolute flex w-full justify-center ${
                      showFullMarkdownBody ? '-bottom-[64px]' : '-bottom-[14px]'
                    }`}
                  >
                    <Button
                      className="z-10 !bg-skin-bg"
                      onClick={() => setShowFullMarkdownBody(!showFullMarkdownBody)}
                    >
                      {showFullMarkdownBody ? 'Show less' : 'Show more'}
                    </Button>
                  </div>
                )}
                <div
                  className={`overflow-hidden ${
                    !showFullMarkdownBody && truncateMarkdownBody
                      ? ''
                      : showFullMarkdownBody
                      ? ''
                      : ''
                  }`}
                >
                  <div ref={markdownBody}>
                    <Markdown source={post?.data?.content || 'HEllo '} />
                  </div>
                </div>
              </div>
              <div className="ml-[53px]">
                <div className="lt-text-gray-500 my-3 text-sm">
                  <span title={moment.unix(time).format('MMM D, YYYY, h:mm:ss A')}>
                    {moment.unix(time).format('h:mm A · MMM D, YYYY')}
                  </span>
                  <span> · Posted via {space?.name} Forum</span>
                </div>
                <div className="mb-1 mt-1 border-t" />
                <div className="lt-text-gray-500 sm:gap-8 flex flex-wrap items-center gap-6 py-3 text-sm">
                  <span>
                    <b className="text-skin-link">{threadCounts.commentCount}</b> Comments
                  </span>
                  <button type="button">
                    <b className="ml-3 text-skin-link">{threadCounts.reBlastCount}</b> ReBlasts
                  </button>
                  <button type="button">
                    <b className="ml-3 text-skin-link">{threadCounts.likeCount}</b> Likes
                  </button>
                </div>
                <div className="mb-1 mt-1 border-t" />
                <ActionBar
                  space={space}
                  appId={appId}
                  threadId={post?.id}
                  commentCount={threadCounts.commentCount}
                  likeCount={threadCounts.likeCount}
                  isLiked={isLiked}
                  isCommented={isCommented}
                  userLikeCount={userLikeCount}
                  userCommentCount={userCommentCount}
                  shareButton={<ButtonShare space={space} shareText={undefined} />}
                  reBlastCount={threadCounts.reBlastCount}
                  isReBlasted={userReBlastCount > 0}
                  userReBlastCount={userReBlastCount}
                  threadKey={threadKey ? threadKey : undefined}
                  postKey={postKey ? postKey : undefined}
                />
                <div className="mb-1 mt-1 border-t" />
                <CommentBlock
                  myAddress={myAddress}
                  profiles={profiles}
                  post={post}
                  space={space}
                  appId={appId}
                  commentCount={threadCounts.commentCount}
                  threadId={post?.id}
                  isCommented={isCommented}
                  userCommentCount={userCommentCount}
                  postKey={postKey}
                />
                <div></div>
              </div>
              {post?.discussion ? (
                <div className="space-y-4">
                  <div className="px-3 md:px-0">
                    <h3>Discussion</h3>
                    <DiscussionBlock description={post?.discussion} link={post?.discussion} />
                  </div>
                </div>
              ) : null}
            </Block>
            {post.thread && (
              <div className="my-4 space-y-4">
                {memoizedComments.map((comment: Comment, i) =>
                  !reported.includes(comment?.id) ? (
                    <div key={`CommentCardItem_${i}`}>
                      <button
                        onClick={() => {
                          handleReport(comment.id);
                        }}
                      >
                        Report
                      </button>
                      <CommentItem
                        creator={comment?.sender}
                        threadKey={comment?.id}
                        postKey={postKey}
                        profiles={profiles}
                        content={comment?.data?.content}
                        title={comment?.data?.title}
                        createdAt={moment.unix(comment?.timeStamp).format('h:mm A · MMM D, YYYY')}
                        commentCount={
                          countSubThreadEntries(comment?.subThread).subThreadCommentCount
                        }
                        likeCount={countSubThreadEntries(comment?.subThread).subThreadLikeCount}
                        reBlastCount={
                          countSubThreadEntries(comment?.subThread).subThreadReBlastCount
                        }
                        voted={undefined}
                        latestRound={undefined}
                        hot={undefined}
                        post={comment}
                        space={space}
                        appId={appId}
                        creatorName={undefined}
                        creatorImage={undefined}
                        isCommented={undefined}
                        isLiked={undefined}
                        userCommentCount={undefined}
                        userLikeCount={undefined}
                        txId={undefined}
                      />
                    </div>
                  ) : (
                    <h1>Comment Reported. Show Anyway?</h1>
                  ),
                )}
              </div>
            )}
          </>
        )}
      </div>
      {isModalReportOpen ? (
        <ReportModal
          targetArray={reportData}
          targetType={'comment'}
          appId={reportData.appId}
          onClose={() => setIsModalReportOpen(false)}
          isOpen={isModalReportOpen}
          setIsOpen={setIsModalReportOpen}
        />
      ) : null}
    </>
  );
};
