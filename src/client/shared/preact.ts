import type { Ref } from 'preact';

// eslint-disable-next-line import/prefer-default-export
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
