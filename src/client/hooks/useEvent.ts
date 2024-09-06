import { useCallback, useEffect, useMemo, useRef } from 'preact/hooks';

import debounce from '~shared/debounce';
import throttle from '~shared/throttle';

const useEvent = <Fn extends (this: any, ...args: any[]) => any>(cb: Fn): Fn => {
  const cbRef = useRef(cb);

  useEffect(() => {
    cbRef.current = cb;
  });

  return useCallback<Fn>(
    function event(...args) {
      return cbRef.current.apply(this, args);
    } as Fn,
    [],
  );
};

export default useEvent;

export const useDebouncedEvent = <Fn extends (this: any, ...args: any[]) => any>(cb: Fn, delay = 50): Fn => {
  const cbRef = useRef(cb);
  useEffect(() => {
    cbRef.current = cb;
  });

  const teardown = useRef<() => void>(() => {});

  useEffect(
    () => () => {
      teardown.current();
    },
    [],
  );

  return useMemo<Fn>(() => {
    const fn = debounce(
      function debounced(...args) {
        return cbRef.current.apply(this, args);
      } as Fn,
      delay,
      false,
    );
    teardown.current = fn.execute;
    return fn;
  }, []);
};

export const useThrottledEvent = <Fn extends (this: any, ...args: any[]) => any>(cb: Fn, delay = 50): Fn => {
  const cbRef = useRef(cb);
  useEffect(() => {
    cbRef.current = cb;
  });

  const teardown = useRef<() => void>(() => {});

  useEffect(
    () => () => {
      teardown.current();
    },
    [],
  );

  return useMemo<Fn>(() => {
    const fn = throttle(
      function throttled(...args) {
        return cbRef.current.apply(this, args);
      } as Fn,
      delay,
      false,
    );
    teardown.current = fn.execute;
    return fn;
  }, []);
};
