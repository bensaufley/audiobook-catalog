/* eslint-disable prefer-arrow-functions/prefer-arrow-functions */
import { Signal } from '@preact/signals';
import type { RefObject } from 'preact';
import { useEffect } from 'preact/hooks';

import useEvent from './useEvent';

export default function useEscape(signal: Signal<boolean>, ref?: RefObject<HTMLElement>): void;
export default function useEscape(enabled: boolean, onEscape: () => void, ref?: RefObject<HTMLElement>): void;
export default function useEscape(
  argOne: boolean | Signal<boolean>,
  argTwo: (() => void) | RefObject<HTMLElement> | undefined,
  argThree?: RefObject<HTMLElement>,
): void {
  let enabled: boolean;
  let onEscape: () => void;
  let ref: RefObject<HTMLElement> | undefined;
  if (argOne instanceof Signal) {
    const signal = argOne;
    enabled = signal.value;
    onEscape = () => {
      signal.value = false;
    };
    ref = argTwo as RefObject<HTMLElement>;
  } else {
    enabled = argOne;
    onEscape = argTwo as () => void;
    ref = argThree;
  }
  const esc = useEvent(() => onEscape?.());

  useEffect(() => {
    if (!enabled) return undefined;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopImmediatePropagation();
        esc();
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (!ref!.current?.contains(e.target as Node)) esc();
    };

    window.addEventListener('keydown', handleEscape, { capture: true });
    if (ref) {
      document.body.addEventListener('click', handleClick);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape, { capture: true });
      document.body.removeEventListener('click', handleClick);
    };
  }, [enabled, ref]);
}
