
function AvatarSpace({ space, size, stamp }) {

  console.log(space)
  return (
    <>
      <img
        className="rounded-full bg-skin-border object-cover"
        alt="avatar"
        style={{ width: size || 28, height: size || 28, minWidth:  size ||28, display: 'none' }}
      />
      <img
        src={space?.avatar || `${stamp + 'avatar/' + space?.domain || space?.appId}?s=56`}
        className="rounded-full bg-skin-border object-cover"
        alt="avatar"
        style={{ width: size || 28, height: size || 28, minWidth:  size ||28, }}
      />
    </>
  );
}

export default AvatarSpace;
