import { createContext, FunctionComponent, h } from 'preact';
import { useCallback, useContext, useEffect, useMemo, useState } from 'preact/hooks';
import { uid } from 'uid';

import styles from '~client/contexts/loading.modules.css';
import useDidMount from '~client/hooks/useDidMount';
import noop from '~lib/noop';

interface Loading {
  loading: boolean;
  startLoading: () => () => void;
}

const LoadingContext = createContext<Loading>({
  loading: false,
  startLoading: () => noop,
});

export default LoadingContext;

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider: FunctionComponent = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [loadingStates, setLoadingState] = useState<{ [k: string]: boolean | undefined }>({});

  const checkLoading = useCallback(() => {
    const isLoading = Object.entries(loadingStates).some(([, v]) => !!v);
    if (isLoading !== loading) setLoading(isLoading);
  }, [loading, loadingStates]);

  const startLoading = useCallback(() => {
    const id = uid(16);
    setLoadingState((ls) => ({ ...ls, [id]: true }));
    return () => {
      setLoadingState(({ [id]: _, ...ls }) => ({ ...ls }));
    };
  }, [setLoadingState]);

  useEffect(() => checkLoading, [checkLoading]);

  const contextValue = useMemo<Loading>(
    () => ({
      loading,
      startLoading,
    }),
    [loading, startLoading],
  );

  // Default to "loading: true" at start, but make sure that if post-initial-render we
  // don't have any changes to loading state, we set loading to false.
  useDidMount(() => {
    setTimeout(checkLoading, 500);
  });

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
      {loading && <div class={styles.overlay} />}
    </LoadingContext.Provider>
  );
};
