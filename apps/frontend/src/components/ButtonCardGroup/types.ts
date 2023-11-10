import { HTMLAttributes } from "react";
import { CSSProperties } from "styled-components";
import { LabelCardValue } from "types/select";

export interface ButtonCardProps extends HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  items: LabelCardValue<any>[];
  activeBackground?: string;
  defaultBackground?: string;
  value?: any;
  buttonStyle?: CSSProperties;
  onChange: (value: any) => void;
}
