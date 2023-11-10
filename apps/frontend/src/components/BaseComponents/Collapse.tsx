import React from 'react'
import PropTypes from 'prop-types'
import  ReactCollapse from 'react-collapse'
import reducedMotionEnabled from 'utils/accessibility';

const Collapse = ({ isActive, children }) => {
  if (reducedMotionEnabled()) {
    return (
      <div style={{display: isActive ? "block" : "none"}}>
        {children}
      </div>
    )
  } else {
    return (
      <ReactCollapse isOpened={isActive}>
        {children}
      </ReactCollapse>
    )
  }
}

Collapse.propTypes = {
  isActive: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired
}

Collapse.defaultProps = {
  isActive: true
}

export default Collapse