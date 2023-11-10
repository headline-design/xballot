import { FunctionComponent, ButtonHTMLAttributes } from 'react';
import LoadingSpinner from '../BaseLoading/LoadingSpinner'
import './button.scss'
import React from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  primary?: boolean;
  loading?: boolean;
  onChange?: (value: any) => void;
}

const Button: FunctionComponent<Props> = ({ primary, loading, children, ...props }) => (
  <button  onClick={() => {props.onChange(props.value)}}
    className={`button px-22 ${primary ? 'button--primary hover:brightness-95' : ''}`}
    disabled={loading || props.disabled}
    {...props}
  >
    {loading ? <LoadingSpinner fillWhite={undefined} small={undefined} big={undefined} /> : children}
  </button>
);

export default Button;
