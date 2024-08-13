import clsx from 'clsx';
import type { FunctionComponent, Ref } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

import useEvent from '~client/hooks/useEvent';
import { mergeRefs } from '~shared/utilities';

const Modal: FunctionComponent<{ innerRef?: Ref<HTMLDivElement>; onHide?: () => void; show?: boolean }> = ({
  innerRef,
  show,
  children,
  onHide,
}) => {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!show) return undefined;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onHide?.();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [show]);

  const handleHide = useEvent((e: Event) => {
    if (e.target !== backgroundRef.current) return;
    onHide?.();
  });

  return (
    <>
      <div
        class={clsx('modal', 'fade', show && 'show')}
        aria-hidden
        tabindex={-1}
        style={show ? { display: 'block' } : {}}
        aria-modal
        role="dialog"
        onClick={handleHide}
        ref={mergeRefs(innerRef, backgroundRef)}
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">{children}</div>
        </div>
      </div>
      <div
        class={clsx('modal-backdrop', 'fade', show && 'show')}
        aria-hidden
        style={show ? {} : { pointerEvents: 'none' }}
      />
    </>
  );
};

export const Header: FunctionComponent<{ onHide?: () => void }> = ({ children, onHide }) => {
  const handleHide = useEvent((e?: Event) => {
    e?.preventDefault();
    onHide?.();
  });

  return (
    <div class="modal-header align-items-start">
      {children}
      {onHide && <button type="button" class="btn-close" aria-label="Close" onClick={handleHide} />}
    </div>
  );
};

export const Title: FunctionComponent = ({ children }) => <div class="modal-title flex-grow-1">{children}</div>;

export const Body: FunctionComponent = ({ children }) => <div class="modal-body">{children}</div>;

export const Footer: FunctionComponent = ({ children }) => <div class="modal-footer">{children}</div>;

export default Modal;
