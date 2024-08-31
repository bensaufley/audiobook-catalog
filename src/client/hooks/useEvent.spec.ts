import { renderHook } from '@testing-library/preact';

import { useDebouncedEvent } from './useEvent';

describe('~client/hooks/useEvent', () => {
  describe('useDebouncedEvent', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('returns a debounced function', () => {
      const fn = vi.fn();
      const { result } = renderHook(() => useDebouncedEvent(fn, 50));

      result.current();
      result.current();
      result.current();
      result.current();
      result.current();

      vi.advanceTimersByTime(51);

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('executes early if unmounted', () => {
      const fn = vi.fn();
      const { result, unmount } = renderHook(() => useDebouncedEvent(fn, 50));

      result.current();

      vi.advanceTimersByTime(25);

      expect(fn).not.toHaveBeenCalled();

      unmount();

      expect(fn).toHaveBeenCalledTimes(1);
    });
  });
});
