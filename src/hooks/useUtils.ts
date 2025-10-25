import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook for debouncing a value
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for managing localStorage with SSR safety
 * @param key - The localStorage key
 * @param initialValue - The initial value
 * @returns [storedValue, setValue] tuple
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

/**
 * Hook for managing loading states
 * @param initialLoading - Initial loading state
 * @returns [isLoading, startLoading, stopLoading, setLoading] tuple
 */
export function useLoading(
  initialLoading = false
): [boolean, () => void, () => void, (loading: boolean) => void] {
  const [isLoading, setIsLoading] = useState(initialLoading);

  const startLoading = useCallback(() => setIsLoading(true), []);
  const stopLoading = useCallback(() => setIsLoading(false), []);
  const setLoading = useCallback((loading: boolean) => setIsLoading(loading), []);

  return [isLoading, startLoading, stopLoading, setLoading];
}

/**
 * Hook for managing async operations with loading states
 * @param asyncFn - The async function to execute
 * @param deps - Dependencies array
 * @returns [execute, isLoading, error] tuple
 */
export function useAsync<T extends unknown[], R>(
  asyncFn: (...args: T) => Promise<R>,
  deps: React.DependencyList = []
): [(...args: T) => Promise<R | undefined>, boolean, Error | null] {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...args: T): Promise<R | undefined> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await asyncFn(...args);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('An unknown error occurred');
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...deps, asyncFn]
  );

  return [execute, isLoading, error];
}

/**
 * Hook for managing previous value
 * @param value - The current value
 * @returns The previous value
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
} /**
 * Hook for managing mounted state (useful for avoiding state updates on unmounted components)
 * @returns Whether the component is mounted
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted;
}

/**
 * Hook for managing timeouts
 * @param callback - The callback function
 * @param delay - The delay in milliseconds
 * @returns [start, clear, isActive] tuple
 */
export function useTimeout(
  callback: () => void,
  delay: number | null
): [() => void, () => void, boolean] {
  const [isActive, setIsActive] = useState(false);
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const start = useCallback(() => {
    if (delay !== null && delay > 0) {
      setIsActive(true);
      timeoutRef.current = setTimeout(() => {
        callbackRef.current();
        setIsActive(false);
      }, delay);
    }
  }, [delay]);

  const clear = useCallback(() => {
    setIsActive(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [start, clear, isActive];
}
