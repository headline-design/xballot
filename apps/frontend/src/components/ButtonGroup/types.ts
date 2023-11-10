import { HTMLAttributes } from "react";
import { CSSProperties } from "styled-components";
import { ForumLabelValue, LabelValue, LabelValueIcon, MenuLabelValue } from "types/select";

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  items: LabelValue<any>[];
  activeBackground?: string;
  defaultBackground?: string;
  value?: any;
  buttonStyle?: CSSProperties;
}

export interface TabsButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  items: LabelValue<any>[];
  link: any;
  activeBackground?: string;
  defaultBackground?: string;
  activeTextColor?: string;
  defaultTextColor?: string;
  value?: any;
  buttonStyle?: CSSProperties;
  activeButtonStyle?: CSSProperties;
  className?: any;
  end?:  boolean | string | any;
  active?: boolean;
  space: any;
}

export interface ForumTabsButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  items: ForumLabelValue<any>[];
  link: any;
  activeBackground?: string;
  defaultBackground?: string;
  activeTextColor?: string;
  defaultTextColor?: string;
  value?: any;
  buttonStyle?: CSSProperties;
  activeButtonStyle?: CSSProperties;
  className?: any;
  end?:  boolean | string | any;
  active?: boolean;
  homeButton: any;
}
export interface MobileTabsButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  items: LabelValueIcon<any>[];
  activeBackground?: string;
  defaultBackground?: string;
  activeTextColor?: string;
  defaultTextColor?: string;
  value?: any;
  buttonStyle?: CSSProperties;
  activeButtonStyle?: CSSProperties;
  className?: string;
}

export interface ModSelectProps extends HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  items: LabelValue<any>[];
  activeBackground?: string;
  defaultBackground?: string;
  activeTextColor?: string;
  defaultTextColor?: string;
  value?: any;
  buttonStyle?: CSSProperties;
  activeButtonStyle?: CSSProperties;
  onChange: (value: any) => void;
}

export interface BaseMenuProps extends HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  items: MenuLabelValue<any>[];
  item: any;
  link: any;
  activeBackground?: string;
  defaultBackground?: string;
  activeTextColor?: string;
  defaultTextColor?: string;
upStream?: any;
  value?: any;
  buttonStyle?: CSSProperties;
  activeButtonStyle?: CSSProperties;
  className?: any;
  isActive?:  boolean | string | any;
  active?: boolean;
  onChange: (value: any) => void;
  placement: any;
  buttonContainer: any;
  name: any;
}

export interface BaseMenuProps extends HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  items: MenuLabelValue<any>[];
  item: any;
  link: any;
  activeBackground?: string;
  defaultBackground?: string;
  activeTextColor?: string;
  defaultTextColor?: string;
  value?: any;
  buttonStyle?: CSSProperties;
  activeButtonStyle?: CSSProperties;
  className?: any;
  isActive?:  boolean | string | any;
  active?: boolean;
  onChange: (value: any) => void;
  placement: any;
  buttonContainer: any;
  name: any;
}