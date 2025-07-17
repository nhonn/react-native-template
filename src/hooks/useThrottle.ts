import { useCallback, useEffect, useRef, useState } from "react";

interface UseThrottleOptions {
  delay: number;
  leading?: boolean;
  trailing?: boolean;
}

/**
 * Hook to throttle a value
 * @param value The value to throttle
 * @param delay The delay in milliseconds
 * @returns The throttled value
 */
export function useThrottleValue<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdateRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateRef.current;

    if (timeSinceLastUpdate >= delay) {
      setThrottledValue(value);
      lastUpdateRef.current = now;
    } else {
      // Schedule update for remaining time
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setThrottledValue(value);
        lastUpdateRef.current = Date.now();
        timeoutRef.current = null;
      }, delay - timeSinceLastUpdate);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return throttledValue;
}

/**
 * Hook to throttle a callback function
 * @param callback The function to throttle
 * @param delay The delay in milliseconds
 * @param options Additional options for throttling behavior
 * @returns The throttled function
 */
export function useThrottleCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number,
  options: UseThrottleOptions = { delay, leading: true, trailing: true },
): T {
  const { leading = true, trailing = true } = options;
  const lastCallTimeRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCallArgsRef = useRef<Parameters<T> | null>(null);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallTimeRef.current;

      // Store the latest arguments for trailing call
      lastCallArgsRef.current = args;

      // If leading is true and enough time has passed, call immediately
      if (leading && timeSinceLastCall >= delay) {
        lastCallTimeRef.current = now;
        callback(...args);
      } else if (trailing && timeoutRef.current === null) {
        // Schedule trailing call
        const remainingTime = delay - timeSinceLastCall;
        timeoutRef.current = setTimeout(() => {
          if (lastCallArgsRef.current) {
            lastCallTimeRef.current = Date.now();
            callback(...lastCallArgsRef.current);
            lastCallArgsRef.current = null;
          }
          timeoutRef.current = null;
        }, remainingTime);
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

  return throttledCallback;
}

/**
 * Hook to throttle both a value and a callback
 * @param value The value to throttle
 * @param callback The callback to throttle
 * @param delay The delay in milliseconds
 * @param options Additional options for throttling behavior
 * @returns Object containing throttled value and callback
 */
export function useThrottle<T, F extends (...args: unknown[]) => unknown>(
  value: T,
  callback: F,
  delay: number,
  options: UseThrottleOptions = { delay, leading: true, trailing: true },
) {
  const throttledValue = useThrottleValue(value, delay);
  const throttledCallback = useThrottleCallback(callback, delay, options);

  return {
    value: throttledValue,
    callback: throttledCallback,
  };
}
