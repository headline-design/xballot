import { ExclamationCircle } from 'icons/ExclamationCircle';
import { InformationCircle } from 'icons/InformationCircle';
import PropTypes from 'prop-types';

function BaseMessage({ level, children }) {

  return (
    <div>
      {level === 'info' && (
        <InformationCircle />
      )}
      {level !== 'info' && (
        <ExclamationCircle className='float-left mr-1 text-sm text-red' />
      )}
      <div className={`leading-5 ${level === 'warning-red' ? 'text-red' : ''}`}>
        {children}
      </div>
    </div>
  );
}

BaseMessage.propTypes = {
  level: PropTypes.oneOf(['info', 'warning', 'warning-red']).isRequired,
  children: PropTypes.node.isRequired,
};

export default BaseMessage;