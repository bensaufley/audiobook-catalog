import { useEffect } from 'preact/hooks';

const useDidMount = (cb: () => void | (() => void)) => useEffect(cb, []); // eslint-disable-line react-hooks/exhaustive-deps

export default useDidMount;
