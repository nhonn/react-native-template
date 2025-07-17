import { useCallback, useEffect, useRef, useState } from "react";

interface UseDebounceOptions {
  delay: number;
  leading?: boolean;
  trailing?: boolean;
}

/**
 * Hook to debounce a value
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounceValue<T>(value: T, delay: number): T {
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
 * Hook to debounce a callback function
 * @param callback The function to debounce
 * @param delay The delay in milliseconds
 * @param options Additional options for debouncing behavior
 * @returns The debounced function
 */
export function useDebounceCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number,
  options: UseDebounceOptions = { delay, leading: false, trailing: true },
): T {
  const { leading = false, trailing = true } = options;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCallTimeRef = useRef<number>(0);
  const lastCallArgsRef = useRef<Parameters<T> | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallTimeRef.current;

      // Store the latest arguments
      lastCallArgsRef.current = args;

      // If leading is true and this is the first call or enough time has passed
      if (leading && (timeoutRef.current === null || timeSinceLastCall >= delay)) {
        lastCallTimeRef.current = now;
        callback(...args);
      }

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout for trailing call
      if (trailing) {
        timeoutRef.current = setTimeout(() => {
          if (lastCallArgsRef.current) {
            lastCallTimeRef.current = Date.now();
            callback(...lastCallArgsRef.current);
            lastCallArgsRef.current = null;
          }
          timeoutRef.current = null;
        }, delay);
      }
    },
    [callback, delay, leading, trailing],
  ) as T;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

/**
 * Hook to debounce both a value and a callback
 * @param value The value to debounce
 * @param callback The callback to debounce
 * @param delay The delay in milliseconds
 * @param options Additional options for debouncing behavior
 * @returns Object containing debounced value and callback
 */
export function useDebounce<T, F extends (...args: unknown[]) => unknown>(
  value: T,
  callback: F,
  delay: number,
  options: UseDebounceOptions = { delay, leading: false, trailing: true },
) {
  const debouncedValue = useDebounceValue(value, delay);
  const debouncedCallback = useDebounceCallback(callback, delay, options);

  return {
    value: debouncedValue,
    callback: debouncedCallback,
  };
}
