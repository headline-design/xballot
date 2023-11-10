import { MenuDots } from "icons/MenuDots";
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
  primary?: boolean;
  loading?: boolean;
  children?: ReactNode;
  className?: string;
  type?: any;
}

export const BlockButton = forwardRef<HTMLButtonElement, Props>(function Button(
  { className = "", type = "button", primary = false, loading, children, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={rest.disabled || loading}
      type={type}
      {...rest}
    >
        <MenuDots width="1.3em" height="1.3em"/>
    </button>
  );
});
