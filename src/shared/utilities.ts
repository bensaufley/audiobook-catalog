export const wait = (n: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, n);
  });

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

export const clamp = (min: number, n: number, max: number) => Math.min(max, Math.max(min, n));

type SortableKey<K, Nullable = false> = {
  [k in keyof K]: K[k] extends number | string | (Nullable extends true ? null | undefined : never) ? k : never;
}[keyof K];

export function sortBy<T, K extends SortableKey<T, true>>(
  key: K,
  nulls: 'first' | 'last',
  reverse?: boolean,
): (a: T, b: T) => number;
export function sortBy<T, K extends SortableKey<T, false>>(key: K, reverse?: boolean): (a: T, b: T) => number;
export function sortBy<T, K extends SortableKey<T, boolean>>(
  key: K,
  arg2?: 'first' | 'last' | boolean,
  arg3?: boolean,
) {
  let reverse = false;
  let nulls: 'first' | 'last' | undefined;
  if (typeof arg2 === 'string') {
    nulls = arg2;
  } else if (typeof arg2 === 'boolean') {
    reverse = arg2;
  }
  if (typeof arg3 === 'boolean') {
    reverse = arg3;
  }
  const reverseModifier = reverse ? -1 : 1;

  return (a: T, b: T) => {
    const aKey = a[key];
    const bKey = b[key];
    if ((aKey ?? null) === (bKey ?? null)) return 0;
    if (nulls) {
      if (aKey == null) return (nulls === 'first' ? -1 : 1) * reverseModifier;
      if (bKey == null) return (nulls === 'first' ? 1 : -1) * reverseModifier;
    }
    if (typeof aKey !== typeof bKey) {
      // eslint-disable-next-line no-console
      console.error(`Cannot compare ${typeof aKey} to ${typeof bKey}`);
      return 0;
    }
    switch (typeof aKey) {
      case 'string':
        return aKey.localeCompare(bKey as string, undefined, { caseFirst: 'false' }) * reverseModifier;
      case 'number':
        if (aKey < (bKey as number)) return -1 * reverseModifier;
        if (aKey > (bKey as number)) return 1 * reverseModifier;
        return 0;
      default:
        return 0;
    }
  };
}
