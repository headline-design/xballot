import { Link } from 'react-router-dom';
import { Block } from './Block';
import { ProfilePopover } from '../ProfilePopover/ProfilePopover';
import { useHasMounted } from '../../composables/useHasMounted';
import moment from 'moment';
import { ButtonMore } from './ButtonMore';
import { PostIcon } from 'icons/PostIcon';
import { BoltOutline } from 'icons/BoltOutline';
import removeMd from 'remove-markdown';
import ActionBar from './ActionBar';
import { useState } from 'react';
import ShareModal from 'components/ShareModal';
import ForumTypeBadge from './ForumTypeBadge';

export const PostItem = ({
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
  profiles,
  commentCount,
  reBlastCount,
  isCommented,
  isReBlasted,
  isLiked,
  likeCount,
  userCommentCount,
  userReBlastCount,
  userLikeCount,
  threadKey,
  postKey,
}: {
  content: any;
  txId: any;
  creator: any;
  profiles: any;
  title: any;
  voted: any;
  createdAt: any;
  latestRound: any;
  hot: any;
  post: any;
  space: any;
  appId: any;
  commentCount: any;
  likeCount: any;
  isCommented: any;
  isLiked: any;
  isReBlasted: any;
  reBlastCount: any;
  userCommentCount: any;
  userReBlastCount: any;
  userLikeCount: any;
  threadKey?: any;
  postKey?: any;
}) => {
  const hasMounted = useHasMounted();
  const postContent = removeMd(content);
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <Link className="block text-skin-text" to={`${'post/' + txId}`}>
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
                      profile={undefined}                    />
                    <ForumTypeBadge content={post} space={space} type={'feed'} />
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
                share={openModal}
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
              isReBlasted={isReBlasted}
              reBlastCount={reBlastCount}
              userReBlastCount={userReBlastCount}
              threadKey={threadKey ? threadKey : undefined}
              postKey={txId ? txId : undefined}
            />
            <div> {moment.unix(createdAt).fromNow()} </div>
          </div>
        </Block>
      </Link>
      <ShareModal space={space} appId={appId} isOpen={isOpen} closeModal={closeModal} />
    </>
  );
};
