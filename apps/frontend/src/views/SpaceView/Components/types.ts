import { AnyTxtRecord } from "dns";
import { HTMLAttributes } from "react";
import { CSSProperties } from "styled-components";
import { LabelValue, LabelValueIcon } from "types/select";


export interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
    disabled?: boolean;
    items: LabelValue<any>[];
    loading?: any;
    link: any;
    activeBackground?: string;
    defaultBackground?: string;
    activeTextColor?: string;
    defaultTextColor?: string;
    joined?: any;
    membersLength?: any;
    value?: any;
    buttonStyle?: CSSProperties;
    activeButtonStyle?: CSSProperties;
    className?: any; 
    isActive?:  boolean | string | any;
    spaceName?: any;
    verifiedSpace: any;
    imageLink: any;
    spaceKey: any;
    space: any;
    appId: any;
    isOptButton: any,
    isPostButton: any,
    isSubMenu: any,
  }