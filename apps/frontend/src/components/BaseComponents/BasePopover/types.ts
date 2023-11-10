
import { HTMLAttributes, CSSProperties } from "react";

export interface PopoverProps extends HTMLAttributes<HTMLDivElement> {
    placement?: string;
    disabled?: boolean;
    show?: boolean;
    activeBackground?: string;
    defaultBackground?: string;
    activeTextColor?: string;
    defaultTextColor?: string;
    value?: any;
    buttonStyle?: CSSProperties;
    activeButtonStyle?: CSSProperties;
    children: JSX.Element|JSX.Element[];
    className?: string;
    onChange: (value: any) => void;
  }

  