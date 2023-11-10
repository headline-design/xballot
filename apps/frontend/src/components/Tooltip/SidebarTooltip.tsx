import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import './styles.css';

const SidebarTooltip = ({ content, label }) => {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{content}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="tippy-box"
            data-state="visible"
            tabIndex={-1}
            data-animation="fade"
            role="tooltip"
            data-placement="right"
            data-escaped=""
            style={{
              maxWidth: 350,
              transitionDuration: '300ms',
              zIndex: 10000,
            }}
            side={'right'}
            sideOffset={0}
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

export default SidebarTooltip;
