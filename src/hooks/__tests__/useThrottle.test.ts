jest.useFakeTimers();

import { act, renderHook } from "@testing-library/react-native";
import { useThrottle, useThrottleCallback, useThrottleValue } from "../useThrottle";

describe("useThrottleValue", () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  test("returns initial value immediately", () => {
    const { result } = renderHook(() => useThrottleValue("initial", 500));
    expect(result.current).toBe("initial");
  });

  test("updates value immediately when enough time has passed", () => {
    const { result, rerender } = renderHook(({ value }: { value: any }) => useThrottleValue(value, 500), {
      initialProps: { value: "initial" },
    });

    act(() => {
      jest.advanceTimersByTime(600);
    });

    rerender({ value: "updated" });
    expect(result.current).toBe("updated");
  });

  test("handles rapid value changes with throttling", () => {
    const { result, rerender } = renderHook(({ value }: { value: any }) => useThrottleValue(value, 500), {
      initialProps: { value: "initial" },
    });

    rerender({ value: "first" });
    rerender({ value: "second" });

    expect(result.current).toBe("initial");

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe("second");
  });

  test("handles different value types", () => {
    const { result: numberResult } = renderHook(() => useThrottleValue(42, 500));
    expect(numberResult.current).toBe(42);

    const { result: objectResult } = renderHook(() => useThrottleValue({ key: "value" }, 500));
    expect(objectResult.current).toEqual({ key: "value" });
  });
});

describe("useThrottleCallback", () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  test("calls callback immediately when enough time has passed (leading)", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useThrottleCallback(callback, 500, { leading: true, delay: 500 }));

    act(() => {
      result.current("first call");
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("first call");
  });

  test("does not call callback when called too quickly", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useThrottleCallback(callback, 500, { leading: true, delay: 500 }));

    act(() => {
      result.current("first");
    });
    act(() => {
      jest.advanceTimersByTime(100);
    });
    act(() => {
      result.current("second");
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("trailing callback fires after delay", () => {
    const callback = jest.fn();
    const { result } = renderHook(() =>
      useThrottleCallback(callback, 500, { leading: true, trailing: true, delay: 500 }),
    );

    act(() => {
      result.current("first");
    });
    act(() => {
      jest.advanceTimersByTime(100);
    });
    act(() => {
      result.current("second");
    });

    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(400);
    });

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith("second");
  });

  test("only trailing when leading is false", () => {
    const callback = jest.fn();
    const { result } = renderHook(() =>
      useThrottleCallback(callback, 500, { leading: false, trailing: true, delay: 500 }),
    );

    act(() => {
      result.current("first");
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("first");
  });

  test("passes correct arguments to callback", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useThrottleCallback(callback, 500, { leading: true, delay: 500 }));

    const args = { key: "value" };
    act(() => {
      result.current("string", 123, true, args);
    });

    expect(callback).toHaveBeenCalledWith("string", 123, true, args);
  });
});

describe("useThrottle combined hook", () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  test("returns both throttled value and callback", () => {
    const { result } = renderHook(() => useThrottle("initial", jest.fn(), 500));

    expect(result.current.value).toBe("initial");
    expect(result.current.callback).toBeDefined();
    expect(typeof result.current.callback).toBe("function");
  });

  test("throttled value updates immediately when enough time passed", () => {
    const { result, rerender } = renderHook(
      ({ value, callback }: { value: any; callback: any }) => useThrottle(value, callback, 500),
      {
        initialProps: { value: "initial", callback: jest.fn() },
      },
    );

    act(() => {
      jest.advanceTimersByTime(600);
    });

    rerender({ value: "updated", callback: jest.fn() });
    expect(result.current.value).toBe("updated");
  });

  test("callback is properly throttled", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useThrottle("value", callback, 500));

    act(() => {
      result.current.callback("arg1");
    });

    expect(callback).toHaveBeenCalledWith("arg1");

    act(() => {
      result.current.callback("arg2");
    });

    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith("arg2");
  });
});
