import ActionModal from 'views/SpaceView/SpaceForum/Components/ActionModal';

function ActionBar({
  space,
  appId,
  threadId,
  commentCount,
  reBlastCount,
  likeCount,
  isLiked,
  isCommented,
  isReBlasted,
  userCommentCount,
  userReBlastCount,
  userLikeCount,
  shareButton,
  postKey,
  threadKey,
}) {
  return (
    <div
      className="space-around flex max-w-md cursor-pointer justify-between"
      onClick={(e) => e.stopPropagation()}
    >
      <ActionModal
        space={space}
        appId={appId}
        interactionCount={commentCount}
        userInteractionCount={userCommentCount}
        postKey={postKey}
        threadKey={threadKey}
        isInteracted={false}
        interactionType="comment"
      />
      <ActionModal
        space={space}
        appId={appId}
        interactionCount={likeCount}
        userInteractionCount={userLikeCount}
        postKey={postKey}
        threadKey={threadKey}
        isInteracted={isLiked}
        interactionType="like"
      />
      <ActionModal
        space={space}
        appId={appId}
        interactionCount={reBlastCount}
        userInteractionCount={userReBlastCount}
        postKey={postKey}
        threadKey={threadKey}
        isInteracted={isReBlasted}
        interactionType="reBlast"
      />
      {shareButton}
    </div>
  );
}

export default ActionBar;
