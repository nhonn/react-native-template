import { MMKV } from "react-native-mmkv";
import { createJSONStorage, type StateStorage } from "zustand/middleware";

// MMKV instance
const mmkvStorage = new MMKV();

// Create a StateStorage adapter for MMKV
const mmkvStateStorage: StateStorage = {
  getItem: (name: string) => {
    try {
      return mmkvStorage.getString(name) ?? null;
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string) => {
    try {
      mmkvStorage.set(name, value);
    } catch {
      // Silent fail for storage operations
    }
  },
  removeItem: (name: string) => {
    try {
      mmkvStorage.delete(name);
    } catch {
      // Silent fail for storage operations
    }
  },
};

// Create JSON storage using the MMKV adapter
export const createMMKVJSONStorage = () => createJSONStorage(() => mmkvStateStorage);

// Storage interface for backward compatibility
type StorageInterface = {
  getItem: (key: string) => string | undefined;
  setItem: (key: string, value: string) => void;
  getString: (key: string) => string | undefined;
  setString: (key: string, value: string) => void;
  getBoolean: (key: string) => boolean | undefined;
  set: (key: string, value: string | number | boolean) => void;
  remove: (key: string) => void;
  removeItem: (key: string) => void;
  getAllKeys: () => string[];
  clear: () => void;
};

// Export storage object for backward compatibility
export const storage: StorageInterface = {
  getItem: (key: string) => {
    try {
      return mmkvStorage.getString(key);
    } catch {
      return;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      mmkvStorage.set(key, value);
    } catch {
      // Silent fail for storage operations
    }
  },
  getString: (key: string) => {
    try {
      return mmkvStorage.getString(key);
    } catch {
      return;
    }
  },
  setString: (key: string, value: string) => {
    try {
      mmkvStorage.set(key, value);
    } catch {
      // Silent fail for storage operations
    }
  },
  getBoolean: (key: string) => {
    try {
      return mmkvStorage.getBoolean(key);
    } catch {
      return;
    }
  },
  set: (key: string, value: string | number | boolean) => {
    try {
      mmkvStorage.set(key, value);
    } catch {
      // Silent fail for storage operations
    }
  },
  remove: (key: string) => {
    try {
      mmkvStorage.delete(key);
    } catch {
      // Silent fail for storage operations
    }
  },
  removeItem: (key: string) => {
    try {
      mmkvStorage.delete(key);
    } catch {
      // Silent fail for storage operations
    }
  },
  getAllKeys: () => {
    try {
      return mmkvStorage.getAllKeys();
    } catch {
      return [];
    }
  },
  clear: () => {
    try {
      mmkvStorage.clearAll();
    } catch {
      // Silent fail for storage operations
    }
  },
};

// Generic function to create JSON storage with any storage provider
export const createJSONStorageAdapter = <T extends StateStorage>(storageProvider: T) => {
  return createJSONStorage(() => storageProvider);
};

/**
 * A utility function to get a JSON value from storage.
 * @param key The key to retrieve.
 * @returns The parsed JSON value or null if not found or on error.
 */
export function getJSON<T>(key: string): T | null {
  const value = storage.getString(key);
  if (!value) {
    return null;
  }
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

/**
 * A utility function to set a JSON value in storage.
 * @param key The key to set.
 * @param value The value to store.
 */
export function setJSON<T>(key: string, value: T): void {
  storage.set(key, JSON.stringify(value));
}

/**
 * Storage keys constants for type safety.
 */
export const StorageKeys = {
  // App state
  LANGUAGE: "language",
  THEME: "theme",
  FIRST_LAUNCH: "isFirstLaunch",

  // User preferences
  NOTIFICATIONS_ENABLED: "notificationsEnabled",
  BIOMETRIC_ENABLED: "biometricEnabled",

  // Zustand persistence keys
  QR_WALLET_HISTORY: "qr-wallet-history",
  QR_WALLET_SETTINGS: "qr-wallet-settings",
  QR_WALLET_PREFERENCES: "qr-wallet-preferences",
  QR_WALLET_SEARCH: "qr-wallet-search",
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];
