import clsx from "clsx";
import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  forwardRef,
  ReactNode,
} from "react";

interface Props
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const ButtonRounded = forwardRef<HTMLButtonElement, Props>(
  function Button({ className = "", onClick, children, ...rest }, ref) {
    return (
      <button
      onClick={onClick}
        ref={ref}
        className={clsx(
          "flex h-[44px] w-[44px] cursor-pointer select-none items-center justify-center rounded-full border border-skin-border hover:border-skin-text",
          className
        )}
        {...rest}
      >
        <div>{children}</div>
      </button>
    );
  }
);
