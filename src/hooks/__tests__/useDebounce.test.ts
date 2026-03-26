jest.useFakeTimers();

import { act, renderHook } from "@testing-library/react-native";
import { useDebounce, useDebounceCallback, useDebounceValue } from "../useDebounce";

describe("useDebounceValue", () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  test("returns initial value immediately", () => {
    const { result } = renderHook(({ value }: { value: any }) => useDebounceValue(value, 500), {
      initialProps: { value: "initial" },
    });
    expect(result.current).toBe("initial");
  });

  test("returns debounced value after delay", () => {
    const { result, rerender } = renderHook(({ value }: { value: any }) => useDebounceValue(value, 500), {
      initialProps: { value: "initial" },
    });

    rerender({ value: "updated" });
    expect(result.current).toBe("initial");

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe("updated");
  });

  test("only returns value after all rapid updates settle", () => {
    const { result, rerender } = renderHook(({ value }: { value: any }) => useDebounceValue(value, 500), {
      initialProps: { value: "first" },
    });

    rerender({ value: "second" });
    rerender({ value: "third" });
    expect(result.current).toBe("first");

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe("third");
  });

  test("handles different value types", () => {
    const { result: numberResult } = renderHook(({ value }: { value: number }) => useDebounceValue(value, 500), {
      initialProps: { value: 42 },
    });
    expect(numberResult.current).toBe(42);

    const { result: objectResult } = renderHook(
      ({ value }: { value: Record<string, any> }) => useDebounceValue(value, 500),
      {
        initialProps: { value: { key: "value" } },
      },
    );
    expect(objectResult.current).toEqual({ key: "value" });
  });
});

describe("useDebounceCallback", () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  test("calls callback after delay (trailing)", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebounceCallback(callback, 500, { trailing: true, delay: 500 }), {
      initialProps: { value: "initial" },
    });

    act(() => {
      result.current("arg1", "arg2");
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledWith("arg1", "arg2");
  });

  test("calls callback immediately when leading is true", () => {
    const callback = jest.fn();
    const { result } = renderHook(
      ({ leading }: { leading: boolean }) =>
        useDebounceCallback(callback, 500, { leading, trailing: false, delay: 500 }),
      {
        initialProps: { leading: true },
      },
    );

    act(() => {
      result.current("leading call");
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("leading call");
  });

  test("calls both leading and trailing when both true", () => {
    const callback = jest.fn();
    const { result } = renderHook(
      () => useDebounceCallback(callback, 500, { leading: true, trailing: true, delay: 500 }),
      {
        initialProps: { value: "dual call" },
      },
    );

    act(() => {
      result.current("dual call");
    });

    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledTimes(2);
  });

  test("subsequent calls reset the timer", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebounceCallback(callback, 500, { trailing: true, delay: 500 }), {
      initialProps: { value: "initial" },
    });

    act(() => {
      result.current("first");
    });
    act(() => {
      jest.advanceTimersByTime(200);
    });
    act(() => {
      result.current("second");
    });
    act(() => {
      jest.advanceTimersByTime(200);
    });
    act(() => {
      result.current("third");
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("third");
  });

  test("passes correct arguments to callback", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebounceCallback(callback, 500, { trailing: true, delay: 500 }), {
      initialProps: { value: "initial" },
    });

    const args = { key: "value" };
    act(() => {
      result.current("string", 123, true, args);
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledWith("string", 123, true, args);
  });
});

describe("useDebounce combined hook", () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  test("returns both debounced value and callback", () => {
    const { result } = renderHook(() => useDebounce("initial", jest.fn(), 500));

    expect(result.current.value).toBe("initial");
    expect(result.current.callback).toBeDefined();
    expect(typeof result.current.callback).toBe("function");
  });

  test("debounced value updates after delay", () => {
    const { result, rerender } = renderHook(
      ({ value, callback }: { value: any; callback: any }) => useDebounce(value, callback, 500),
      {
        initialProps: { value: "initial", callback: jest.fn() },
      },
    );

    rerender({ value: "updated", callback: jest.fn() });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current.value).toBe("updated");
  });

  test("callback is properly debounced", () => {
    const callback = jest.fn();
    const { result } = renderHook(({ value }: { value: any }) => useDebounce(value, callback, 500), {
      initialProps: { value: "value" },
    });

    act(() => {
      result.current.callback("arg1");
    });
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledWith("arg1");
  });
});
