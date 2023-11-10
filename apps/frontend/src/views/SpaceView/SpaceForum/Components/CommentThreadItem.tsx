import { Link } from 'react-router-dom';
import { Block } from 'components/BaseComponents/Block';
import { ProfilePopover } from 'components/ProfilePopover/ProfilePopover';
import { useHasMounted } from 'composables/useHasMounted';
import moment from 'moment';
import { ButtonMore } from 'components/BaseComponents/ButtonMore';
import { PostIcon } from 'icons/PostIcon';
import { BoltOutline } from 'icons/BoltOutline';
import removeMd from 'remove-markdown';
import ActionBar from 'components/BaseComponents/ActionBar';
import ReportModal from 'components/BaseComponents/ReportModal';
import { useState } from 'react';

export interface CommentThreadItemProps {
  txId?: string;
  data?: any;
  timeStamp?: any;
  creator?: string;
  creatorName?: any;
  creatorImage?: any;
  title?: any;
  voted?: any;
  createdAt?: any;
  content?: any;
  latestRound?: any;
  hot?: any;
  post?: any;
  profiles?: any;
  space?: any;
  appId?: any;
  commentCount?: any;
  likeCount?: any;
  isCommented?: any;
  isLiked?: any;
  userCommentCount?: any;
  userLikeCount?: any;
  commentId?: any;
  threadKey?: any;
  postKey?: any;
  reBlastCount?: any;
}

export const CommentThreadItem: React.FC<CommentThreadItemProps> = ({
  txId,
  creator,
  creatorName,
  creatorImage,
  title,
  voted,
  createdAt,
  content,
  latestRound,
  hot,
  post,
  profiles,
  space,
  appId,
  commentCount,
  likeCount,
  isCommented,
  isLiked,
  userCommentCount,
  userLikeCount,
  commentId,
  threadKey,
  postKey,
  reBlastCount,
}) => {
  const hasMounted = useHasMounted();
  const timeFromNow = moment().startOf('hour').fromNow();
  const postContent = removeMd(content);
  const [isModalReportOpen, setIsModalReportOpen] = useState(false);
  console.log('postContent', post);
  const handleReport = async () => {
    setIsModalReportOpen(true);
  };

  return (
    <Link className="block text-skin-text" to={`${'sub/' + post?.id}`}>
      <Block className="hover:border-skin-text">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div>
              {hasMounted && (
                <div className="align-center flex items-center space-x-1">
                  <ProfilePopover
                    creator={creator}
                    profiles={profiles}
                    hideAvatar={undefined}
                    profile={undefined}
                  />

                  {post?.type === 'blast' && (
                    <BoltOutline
                      width={'1.2em'}
                      height={'1em'}
                      color={undefined}
                      className={undefined}
                    />
                  )}
                  {post?.type === 'post' && (
                    <PostIcon
                      width={'1.2em'}
                      height={'1em'}
                      color={undefined}
                      className={undefined}
                    />
                  )}
                </div>
              )}
            </div>

            <ButtonMore
              className={undefined}
              postId={txId}
              width={undefined}
              height={undefined}
              share={undefined}
              report={handleReport}
            />

            {hot &&
              (createdAt + 82000 > latestRound ? (
                <span className="State bg-green text-white" data-v-59df45fa="">
                  Active
                </span>
              ) : (
                <span className="State bg-violet-600 text-white" data-v-59df45fa="">
                  Closed
                </span>
              ))}
          </div>
          <div className="relative mb-1 break-words pr-[80px] leading-7">
            {title && <h3 className="inline pr-2">{title}</h3>}
            {content && <p className="mb-2 line-clamp-2 break-words text-md">{postContent} </p>}
          </div>
        </div>
        <div className="space-around align-center flex max-w-md cursor-pointer justify-between">
          <ActionBar
            space={space}
            appId={appId}
            threadId={txId}
            commentCount={commentCount}
            likeCount={likeCount}
            isLiked={isLiked}
            isCommented={isCommented}
            userLikeCount={userLikeCount}
            userCommentCount={userCommentCount}
            shareButton={undefined}
            reBlastCount={reBlastCount}
            isReBlasted={undefined}
            userReBlastCount={undefined}
            threadKey={threadKey ? threadKey : undefined}
            postKey={postKey ? postKey : undefined}
          />
          <div> {createdAt} </div>
        </div>
        <ReportModal
          targetArray={[parseInt(space?.appId), postKey, threadKey]}
          targetType={'thread'}
          appId={space?.appId}
          onClose={() => setIsModalReportOpen(false)}
          isOpen={isModalReportOpen}
          setIsOpen={setIsModalReportOpen}
        />
      </Block>
    </Link>
  );
};
