import { CommentIcon } from "icons/Comment";
import { ButtonIcon } from "./ButtonIcon";

export const ButtonComment = ({ comments = 0 }: { comments?: number }) => {
  return (
    <ButtonIcon
      icon={<CommentIcon />}
    >
      <span className="text-sm">{comments}</span>
    </ButtonIcon>
  );
};
