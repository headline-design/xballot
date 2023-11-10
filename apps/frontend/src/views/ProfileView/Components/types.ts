import { HTMLAttributes } from 'react';
import { LabelValue } from 'types/select';

export interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  loading: any;
  items: LabelValue<any>[];
  value?: any;
  className?: any;
  isActive?: boolean | string | any;
  onChange?: (value: any) => void;
  verifiedProfile?: any;
  imageLink?: any;
  prime?: any;
  profileKey?: any;
  address?: any;
  domain?: any;
  domainData?: any;
  appId?: any;
  actionButton?: any;
  creator?: any;
  creatorName?: any;
  creatorAvatar?: any;
}
