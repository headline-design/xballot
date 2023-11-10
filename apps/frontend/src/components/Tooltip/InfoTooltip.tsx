import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import './styles.css';
import { InfoIcon } from 'icons/InfoIcon';

const InfoTooltip = ({ label }) => {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger className="text-xs hover:text-skin-link ml-1 text-sm text-skin-text">
          <InfoIcon />
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="tippy-box"
            data-state="visible"
            tabIndex={-1}
            data-animation="fade"
            role="tooltip"
            data-placement="top"
            data-escaped=""
            style={{
              maxWidth: 350,
              transitionDuration: '300ms',
              zIndex: 10000,
            }}
            side={'top'}
            align={'center'}
            sideOffset={5}
          >
            <div
              className="tippy-content"
              data-state="visible"
              style={{ transitionDuration: '300ms' }}
            >
              {label}
            </div>
            <Tooltip.Arrow className="tippy-arrow" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default InfoTooltip;
