import React, { Fragment, cloneElement, useEffect, useMemo, useState } from 'react';

import {
  useFloating,
  useInteractions,
  useClick,
  useRole,
  useDismiss,
  useId,
  FloatingPortal,
  FloatingOverlay,
  FloatingFocusManager,
} from '@floating-ui/react-dom-interactions';
import { mergeRefs } from 'react-merge-refs';

interface Props {
  forceStayOpen?: boolean;
  open?: boolean;
  closeModalFunction: () => void;
  render: (props: {
    close: () => void;
    initialValue: number;
    title: string;
    descriptionId: string;
  }) => React.ReactNode;
  children: JSX.Element;
}

export const Dialog = ({
  render,
  forceStayOpen = false,
  open: passedOpen = false,
  closeModalFunction,
  children,
}: Props) => {
  const [open, setOpen] = useState(passedOpen);
  const { reference, floating, context } = useFloating({
    open,
    onOpenChange: setOpen,
  });

  const id = useId();
  const initialValue = 0;
  const title = `${id}-title`;
  const descriptionId = `${id}-description`;

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useRole(context),
    useDismiss(context),
  ]);

  useEffect(() => {
    if (open === false && closeModalFunction) {
      closeModalFunction();
    }
  }, [open]);

  // Preserve the consumer's ref
  const ref = useMemo(() => mergeRefs([reference, (children as any)?.ref]), [reference, children]);

  return (
    <>
      {children && cloneElement(children, getReferenceProps({ ref, ...children.props }))}
      <FloatingPortal>
        {(open || forceStayOpen) && (
          <FloatingOverlay
            lockScroll
            style={{
              display: 'grid',
              placeItems: 'center',
              background: 'var(--modal-backdrop)',
              zIndex: 50,
            }}
          >

            <FloatingFocusManager context={context}>
              <div className="modal z-50 mx-auto w-screen" id="headlessui-dialog-:rv:" role="dialog" aria-modal="true" data-headlessui-state="open">
                <div  className="backdrop" />
                  <div
                    className="shell relative overflow-hidden rounded-none md:rounded-3xl"
                    aria-labelledby={title}
                    aria-describedby={descriptionId}
                    {...getFloatingProps()}
                  >
                    {render({
                      close: () => setOpen(false),
                      title,
                      descriptionId,
                      initialValue,
                    })}
                  </div>
                </div>
            </FloatingFocusManager>

          </FloatingOverlay>
        )}
      </FloatingPortal>
    </>
  );
};
