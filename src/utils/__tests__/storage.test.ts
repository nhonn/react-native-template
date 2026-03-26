const mockStorage: Record<string, string> = {};

jest.mock("react-native-mmkv", () => {
  return {
    createMMKV: () => ({
      getString: (key: string) => mockStorage[key],
      set: (key: string, value: string | number | boolean) => {
        mockStorage[key] = String(value);
      },
      getBoolean: (key: string) => {
        const val = mockStorage[key];
        return val === "true" ? true : val === "false" ? false : undefined;
      },
      remove: (key: string) => {
        delete mockStorage[key];
      },
      getAllKeys: () => Object.keys(mockStorage),
      clearAll: () => {
        Object.keys(mockStorage).forEach((key) => {
          delete mockStorage[key];
        });
      },
    }),
  };
});

jest.mock("@/utils/logger", () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
    log: jest.fn(),
  },
}));

import { getJSON, StorageKeys, setJSON, storage } from "../storage";

describe("Storage Utils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.keys(mockStorage).forEach((key) => {
      delete mockStorage[key];
    });
  });

  describe("storage interface", () => {
    test("setItem and getItem work with strings", () => {
      storage.setItem("testKey", "testValue");
      expect(storage.getItem("testKey")).toBe("testValue");
    });

    test("setString and getString work", () => {
      storage.setString("stringKey", "stringValue");
      expect(storage.getString("stringKey")).toBe("stringValue");
    });

    test("set and get work with various types", () => {
      storage.set("numberKey", 42);
      expect(storage.getString("numberKey")).toBe("42");

      storage.set("booleanKey", true);
      expect(storage.getString("booleanKey")).toBe("true");
    });

    test("getBoolean returns correct values", () => {
      storage.set("boolTrue", true);
      storage.set("boolFalse", false);

      expect(storage.getBoolean("boolTrue")).toBe(true);
      expect(storage.getBoolean("boolFalse")).toBe(false);
    });

    test("remove removes item from storage", () => {
      storage.set("toRemove", "value");
      expect(storage.getString("toRemove")).toBe("value");

      storage.remove("toRemove");
      expect(storage.getString("toRemove")).toBeUndefined();
    });

    test("removeItem is alias for remove", () => {
      storage.set("toRemove", "value");
      storage.removeItem("toRemove");
      expect(storage.getString("toRemove")).toBeUndefined();
    });

    test("getAllKeys returns all keys", () => {
      storage.set("key1", "value1");
      storage.set("key2", "value2");

      const keys = storage.getAllKeys();
      expect(keys).toContain("key1");
      expect(keys).toContain("key2");
    });

    test("clear removes all items", () => {
      storage.set("key1", "value1");
      storage.set("key2", "value2");
      storage.clear();

      expect(storage.getAllKeys()).toHaveLength(0);
    });
  });

  describe("getJSON", () => {
    test("returns null for non-existent key", () => {
      const result = getJSON<{ name: string }>("nonExistent");
      expect(result).toBeNull();
    });

    test("parses and returns JSON value", () => {
      setJSON("user", { name: "John", age: 30 });
      const result = getJSON<{ name: string; age: number }>("user");

      expect(result).toEqual({ name: "John", age: 30 });
    });

    test("returns null for invalid JSON", () => {
      storage.set("badJson", "not valid json");
      const result = getJSON("badJson");

      expect(result).toBeNull();
    });

    test("handles empty string", () => {
      storage.set("empty", "");
      const result = getJSON("empty");

      expect(result).toBeNull();
    });
  });

  describe("setJSON", () => {
    test("stores JSON stringified value", () => {
      setJSON("data", { key: "value", nested: { a: 1 } });

      const stored = storage.getString("data");
      expect(stored).toBe(JSON.stringify({ key: "value", nested: { a: 1 } }));
    });

    test("overwrites existing value", () => {
      setJSON("overwrite", { first: true });
      setJSON("overwrite", { second: true });

      const result = getJSON<{ second: boolean }>("overwrite");
      expect(result).toEqual({ second: true });
    });
  });

  describe("StorageKeys", () => {
    test("has all expected keys", () => {
      expect(StorageKeys.LANGUAGE).toBe("language");
      expect(StorageKeys.THEME).toBe("theme");
      expect(StorageKeys.FIRST_LAUNCH).toBe("isFirstLaunch");
      expect(StorageKeys.NOTIFICATIONS_ENABLED).toBe("notificationsEnabled");
      expect(StorageKeys.BIOMETRIC_ENABLED).toBe("biometricEnabled");
      expect(StorageKeys.QR_WALLET_HISTORY).toBe("qr-wallet-history");
      expect(StorageKeys.QR_WALLET_SETTINGS).toBe("qr-wallet-settings");
      expect(StorageKeys.QR_WALLET_PREFERENCES).toBe("qr-wallet-preferences");
      expect(StorageKeys.QR_WALLET_SEARCH).toBe("qr-wallet-search");
    });

    test("StorageKeys values are unique", () => {
      const values = Object.values(StorageKeys);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });
  });
});
