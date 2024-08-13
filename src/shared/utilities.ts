import type { Ref } from 'preact';

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

export const mergeRefs = <T extends HTMLElement>(...refs: (Ref<T> | null | undefined)[]): Ref<T> | null => {
  const filteredRefs = refs.filter((ref) => !!ref);
  if (!filteredRefs.length) return null;
  if (filteredRefs.length === 1) return filteredRefs[0]!;

  return (el: T | null) => {
    filteredRefs.forEach((ref) => {
      if (typeof ref === 'function') ref(el);
      // eslint-disable-next-line no-param-reassign
      else ref.current = el;
    });
  };
};
