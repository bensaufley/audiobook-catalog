export const wait = (n: number) => new Promise((resolve) => setTimeout(resolve, n));

export const noop = () => {
  /* noop */
};

export const entries = Object.entries as <O extends Record<any, any>>(
  obj: O,
) => O extends Record<infer K, infer V> ? [K, V][] : never;
export const keys = Object.keys as <O extends Record<any, any>>(obj: O) => O extends Record<infer K, any> ? K[] : never;
export const values = Object.values as <O extends Record<any, any>>(
  obj: O,
) => O extends Record<any, infer V> ? V[] : never;
