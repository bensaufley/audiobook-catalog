import { useCallback, useEffect, useRef } from 'preact/hooks';

const useEvent = <A extends unknown[], R = void>(cb: (...args: A) => R): ((...args: A) => R) => {
  const cbRef = useRef(cb);

  useEffect(() => {
    cbRef.current = cb;
  });

  return useCallback((...args: A) => cbRef.current(...args), []);
};

export default useEvent;
