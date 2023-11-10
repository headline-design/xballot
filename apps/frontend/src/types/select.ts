export type LabelValue<T = string> = {
  end: boolean | string | any;
  link: string;
  value: T;
  label: string;
};

export type ForumLabelValue<T = string> = {
  end: boolean | string | any;
  link: string;
  value: T;
  label: string;
  homeButton: any;
};

export type LabelCardValue<T = string> = {
  end: boolean | string | any;
  link: string;
  value: T;
  title: string;
  description: string;
  label: string;
};

export type MenuLabelValue<T = string> = {
  isActive: boolean | string | any;
  link: string;
  value: T;
  label: string;
  name: string;
};

export type LabelValueIcon<T = string> = {
  value: T;
  label: string;
  icon: React.ReactNode;
};

export type LabelValueDropdown<T = string> = {
  value: T;
  label: string;
  component: JSX.Element;
};

export type LabelValueStepConfig<T = string> = {
  end: boolean | string | any;
  link: string;
  value: T;
  label: string;
};
