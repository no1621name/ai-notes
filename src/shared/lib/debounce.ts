interface DebouncedFn<T extends (...args: Parameters<T>) => void> {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
}

export const debounce = <T extends (...args: Parameters<T>) => void>(
  func: T,
  delay: number,
): DebouncedFn<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;

  const debounced = (...args: Parameters<T>) => {
    lastArgs = args;
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      timeoutId = null;
      lastArgs = null;
      func(...args);
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
      const args = lastArgs;
      lastArgs = null;
      func(...args);
    }
  };

  return debounced;
};
