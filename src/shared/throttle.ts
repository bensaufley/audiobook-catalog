export default function throttle<T extends (this: any, ...args: any[]) => any>(
  fn: T,
  ms?: number,
  beforeUnload?: true,
): T;
export default function throttle<T extends (this: any, ...args: any[]) => any>(
  fn: T,
  ms: number,
  beforeUnload: false,
): T & { execute: () => void };
export default function throttle(fn: (...args: any[]) => any, ms = 50, beforeUnload = true) {
  const data: { timeout: number | null; callback: (() => void) | null } = {
    timeout: null,
    callback: null,
  };

  function throttled(this: any, ...args: any[]) {
    if (data.timeout) return;

    const execute = () => {
      fn.apply(this, args);

      clearTimeout(data.timeout!);
      data.timeout = null;
      data.callback = null;
    };
    data.callback = execute;
    data.timeout = window.setTimeout(execute, ms);
  }

  if (beforeUnload) {
    window.addEventListener('beforeunload', () => {
      data.callback?.();
    });
  } else {
    throttled.execute = () => {
      data.callback?.();
    };
  }

  return throttled;
}
