interface DebouncedFn<T extends (...args: never[]) => void> {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
}

export const debounce = <T extends (...args: never[]) => void>(
  func: T,
  delay: number,
): DebouncedFn<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: unknown[] | null = null;

  const debounced = (...args: Parameters<T>) => {
    lastArgs = args;
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      timeoutId = null;
      lastArgs = null;
      func(...args as Parameters<T>);
    }, delay);
  };

  debounced.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
      lastArgs = null;
    }
  };

  debounced.flush = () => {
    if (timeoutId !== null && lastArgs !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
      const args = lastArgs as Parameters<T>;
      lastArgs = null;
      func(...args);
    }
  };

  return debounced;
};
