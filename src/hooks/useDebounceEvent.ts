import {useRef} from 'react';

export default function useDebounceEvent(delay: number) {
  const timerId = useRef<any>();
  const lastInvokedTime = useRef(-1);
  const emit =
    <A extends any[], R>(
      callback: (...args: A) => R,
    ): ((...args: Parameters<typeof callback>) => void) =>
    (...args: Parameters<typeof callback>) => {
      const now = Date.now();
      clearTimeout(timerId.current);
      if (lastInvokedTime.current < now - delay) {
        callback(...args);
        lastInvokedTime.current = now;
      } else {
        timerId.current = setTimeout(() => callback(...args), delay);
      }
    };

  return emit;
}
