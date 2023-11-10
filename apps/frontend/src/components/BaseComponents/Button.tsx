import clsx from "clsx";
import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  forwardRef,
  ReactNode,
} from "react";
import { LoadingSpinner } from "components/Loaders/LoadingSpinner";

interface Props
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  primary?: boolean;
  loading?: boolean;
  children?: ReactNode;
  className?: string;
  type?: any;
  dataId?: string;
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  {
    className = "",
    type = "button",
    primary = false,
    loading,
    children,
    dataId = "data-v-1b931a55",
    ...rest
  },
  ref
) {
  return (
    <button
      ref={ref}
      {...{ [dataId]: "" }}
      className={clsx(
        "button px-[22px] border border-skin-border  bg-transparent text-skin-link h-[46px] text-[18px] rounded-[23px]",
        "hover:border-skin-text",
        {
          "text-white bg-primary border border-primary hover:brightness-95":
            primary,
        },
        className
      )}
      disabled={rest.disabled || loading}
      type={type}
      {...rest}
    >
      {loading ? <LoadingSpinner /> : children}
    </button>
  );
});
