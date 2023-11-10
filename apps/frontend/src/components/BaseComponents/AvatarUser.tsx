import clsx from "clsx";
export const AvatarUser = ({
  src,
  size,
  space,
  className = "",
  user,
  symbolIndex,
  address,
  style,
}: {
  src: string;
  size?: string;
  className?: string;
  user?: any;
  space?: any;
  symbolIndex?: any;
  address?: any;
  style?: any;
}) => {
  return (
    <span
      className={clsx("flex shrink-0 items-center justify-center", className)}
    >
      <img
        style={style}
        className={clsx("rounded-full bg-skin-border object-cover")}
        src={src || address}
        alt="avatar"
        width={Number(size) + 'px'}
        height={Number(size) + 'px'}
      />
    </span>
  );
};
