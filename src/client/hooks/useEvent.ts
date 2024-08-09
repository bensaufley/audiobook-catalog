import { useCallback, useEffect, useRef } from 'preact/hooks';

const useEvent = <A extends unknown[], R = void, This = unknown>(
  cb: (this: This, ...args: A) => R,
): ((this: This, ...args: A) => R) => {
  const cbRef = useRef(cb);

  useEffect(() => {
    cbRef.current = cb;
  });

  return useCallback(function event(this: This, ...args: A) {
    return cbRef.current.apply(this, args);
  }, []);
};

export default useEvent;
