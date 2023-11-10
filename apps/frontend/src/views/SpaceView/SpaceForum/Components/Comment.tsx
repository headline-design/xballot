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

export const CommentItem = ({
  commentCount,
  isCommented,
  isLiked,
  likeCount,
  userCommentCount,
  userLikeCount,
  content,
  txId,
  space,
  appId,
  title,
  createdAt,
  creator,
  latestRound,
  post,
  hot,
  postKey,
  threadKey,
  reBlastCount,
  profiles,
}: {
  creatorName: any;
  creator: any;
  creatorImage: any;
  title: any;
  txId: any;
  voted: any;
  createdAt: any;
  content: any;
  latestRound: any;
  hot: any;
  post: any;
  profiles: any;
  space: any;
  appId: any;
  commentCount: any;
  likeCount: any;
  isCommented: any;
  isLiked: any;
  userCommentCount: any;
  userLikeCount: any;
  commentId?: any;
  threadKey?: any;
  postKey?: any;
  reBlastCount?: any;
}) => {
  const hasMounted = useHasMounted();
  const timeFromNow = moment().startOf('hour').fromNow();
  const postContent = removeMd(content);

  //console.log('postContent', post);

  return (
    <Link className="block text-skin-text" to={`${'comment/' + post?.id}`}>
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
                    profile={undefined}                  />

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
            {content && <p className="mb-2 break-words text-md line-clamp-2">{postContent} </p>}
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
      </Block>
    </Link>
  );
};
