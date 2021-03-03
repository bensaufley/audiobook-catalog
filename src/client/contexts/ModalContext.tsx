import { createContext, FunctionComponent, h, VNode } from 'preact';
import { useCallback, useContext, useMemo, useState } from 'preact/hooks';

import styles from '~client/contexts/modal.modules.css';

interface Modal {
  setContent: (content: VNode) => void;
  clearContent: () => void;
}

const ModalContext = createContext<Modal>({
  setContent: () => {
    /* noop */
  },
  clearContent: () => {
    /* noop */
  },
});

export default ModalContext;

export const useModal = () => useContext(ModalContext);

export const ModalProvider: FunctionComponent = ({ children }) => {
  const [content, updateContent] = useState<VNode | null>(null);
  const setContent = useCallback(
    (c: VNode) => {
      updateContent(c);
    },
    [updateContent],
  );
  const clearContent = useCallback(() => {
    updateContent(null);
  }, [updateContent]);

  const contextValue = useMemo<Modal>(
    () => ({
      clearContent,
      setContent,
    }),
    [setContent, clearContent],
  );

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      {content && (
        <div class={styles.overlay}>
          <div class={styles.modal}>{content}</div>
        </div>
      )}
    </ModalContext.Provider>
  );
};
