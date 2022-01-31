import { createContext, FunctionComponent, Fragment, h, VNode } from 'preact';
import { useCallback, useContext, useMemo, useState } from 'preact/hooks';

import styles from '~client/contexts/Modal/styles.module.css';

import { noop } from '~shared/utilities';

export interface ModalValues {
  content: VNode | null;
}

export type Modal = ModalValues & {
  setContent: (content: VNode | null) => void;
};

const ModalContext = createContext<Modal>({
  content: null,
  setContent: noop,
});

export const useModal = () => useContext(ModalContext);

export const ModalProvider: FunctionComponent = ({ children }) => {
  const [content, setContent] = useState<VNode | null>(null);

  const handleHide: h.JSX.GenericEventHandler<HTMLElement> = useCallback(
    (e) => {
      e.preventDefault();
      setContent(null);
    },
    [setContent],
  );

  const value = useMemo(() => ({ content, setContent }), [content, setContent]);

  return (
    <ModalContext.Provider value={value}>
      {children}
      {content && (
        <>
          <div onClick={handleHide} class={styles.overlay} />
          <div class={styles.modal}>
            <button class={styles.closeButton} type="button" onClick={handleHide}>
              &times;
            </button>
            {content}
          </div>
        </>
      )}
    </ModalContext.Provider>
  );
};
