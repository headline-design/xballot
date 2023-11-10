import { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { sanitizeUrl } from '@braintree/sanitize-url';
import { ExternalLinkIcon } from 'icons/ExternalLink';
interface Props {
  hideExternalIcon?: boolean | any;
  disabled?: boolean;
  children?: any;
  link?: any;
  navigate?: any;
  className?: any;
  target?: any;
  rel?: any;
  onClick?: any;
}

const BaseLink: FunctionComponent<Props> = ({
  target,
  rel,
  className,
  hideExternalIcon,
  children,
  disabled,
  link,
  onClick,
}) => {
  if (typeof link === 'string') {
    return (
      <a
        onClick={onClick}
        href={sanitizeUrl(link)}
        target={target || '_blank'}
        rel={rel || 'noopener noreferrer'}
        className={className || `whitespace-nowrap ${disabled ? 'pointer-events-none' : ''}`}
      >
        {children}
        {!hideExternalIcon && <ExternalLinkIcon className="ml-1 mb-[2px] inline-block text-xs" />}
      </a>
    );
  } else {
    return (
      <Link
        to={link || '#'}
        className={className || `whitespace-nowrap ${disabled ? 'pointer-events-none' : ''}`}
      >
        {children}
      </Link>
    );
  }
};

export default BaseLink;
