import type { JSX } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import TouchSweep, { TouchSwipeEventType } from 'touchsweep';

import useEvent from './useEvent';

interface TouchSweepDetail {
  coords: {
    endX: number;
    endY: number;
    moveX: number;
    moveY: number;
    startX: number;
    startY: number;
  };
}

type TouchSweepEvent<El extends HTMLElement = HTMLElement> = JSX.TargetedMouseEvent<El> & { detail: TouchSweepDetail };
type TouchSweepEventHandler<El extends HTMLElement = HTMLElement> = (this: El, event: TouchSweepEvent<El>) => void;

declare global {
  interface HTMLElement
    extends Element,
      ElementCSSInlineStyle,
      ElementContentEditable,
      GlobalEventHandlers,
      HTMLOrSVGElement {
    addEventListener<E extends HTMLElement = HTMLElement>(
      event: TouchSwipeEventType,
      listener: TouchSweepEventHandler<E>,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<E extends HTMLElement = HTMLElement>(
      event: TouchSwipeEventType,
      listener: TouchSweepEventHandler<E>,
      options?: boolean | EventListenerOptions,
    ): void;
  }
}

const useQuickNav = <E extends HTMLElement>(enabled: boolean, move: (n: number) => void) => {
  const ref = useRef<E>(null);
  const touchSweep = useRef<TouchSweep>();

  const swipeMemo = useEvent(
    (n: number): TouchSweepEventHandler<E> =>
      (event) => {
        const deltaY = Math.abs(event.detail.coords.startY - event.detail.coords.endY);
        if (deltaY > Math.max(window.outerHeight / 10, 50)) return;
        event.preventDefault();
        move(n);
      },
  );

  const keyMemo = useEvent((event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') move(-1);
    else if (event.key === 'ArrowRight') move(1);
    else return;
    event.preventDefault();
  });

  useEffect(() => {
    if (!enabled) return undefined;

    const el = ref.current;
    if (!el) return undefined;

    touchSweep.current = new TouchSweep(el);

    const handleSwipeLeft = swipeMemo(1);
    const handleSwipeRight = swipeMemo(-1);

    el.addEventListener(TouchSwipeEventType.left, handleSwipeLeft);
    el.addEventListener(TouchSwipeEventType.right, handleSwipeRight);
    document.body.addEventListener('keydown', keyMemo);

    return () => {
      el.removeEventListener(TouchSwipeEventType.left, handleSwipeLeft);
      el.removeEventListener(TouchSwipeEventType.right, handleSwipeRight);
      document.body.removeEventListener('keydown', keyMemo);
      touchSweep.current?.unbind();
    };
  }, [enabled]);

  useEffect(() => {
    if (enabled) touchSweep.current?.bind();
    else touchSweep.current?.unbind();
  }, [enabled]);

  return ref;
};

export default useQuickNav;
