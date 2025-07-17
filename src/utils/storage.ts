import AsyncStorage from "@react-native-async-storage/async-storage";

import { storageLogger } from "@/utils/logger";

export interface StorageOptions {
  readonly enableCache?: boolean;
  readonly cacheSize?: number;
  readonly enableCompression?: boolean;
  readonly enableDebugLogs?: boolean;
}

export interface StorageResult<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
}

export interface StorageStats {
  readonly totalKeys: number;
  readonly cacheSize: number;
  readonly cacheHits: number;
  readonly cacheMisses: number;
  readonly hitRate: number;
}

const storageCache = new Map<string, unknown>();
const MAX_CACHE_SIZE = 100;
let cacheHits = 0;
let cacheMisses = 0;
const defaultOptions: Required<StorageOptions> = {
  enableCache: true,
  cacheSize: MAX_CACHE_SIZE,
  enableCompression: false,
  enableDebugLogs: __DEV__,
} as const;
let options = defaultOptions;

const validateKey = (key: string): { isValid: boolean; error?: string } => {
  if (!key || typeof key !== "string") {
    return { isValid: false, error: "Key must be a non-empty string" };
  }
  if (key.trim().length === 0) {
    return { isValid: false, error: "Key cannot be empty" };
  }
  if (key.length > 100) {
    return { isValid: false, error: "Key is too long (max 100 characters)" };
  }
  return { isValid: true };
};

const manageCacheSize = (): void => {
  if (storageCache.size >= options.cacheSize) {
    const firstKey = storageCache.keys().next().value;
    if (firstKey !== undefined) {
      storageCache.delete(firstKey);
    }
  }
};

export const setLanguage = async (language: string): Promise<StorageResult<void>> => {
  try {
    const keyValidation = validateKey("language");
    if (!keyValidation.isValid) {
      return { success: false, error: keyValidation.error };
    }
    if (!language || typeof language !== "string") {
      return { success: false, error: "Language must be a non-empty string" };
    }
    await AsyncStorage.setItem("language", language);
    if (options.enableCache) {
      manageCacheSize();
      storageCache.set("language", language);
    }
    if (options.enableDebugLogs) {
      storageLogger.info("Language set:", language);
    }
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown storage error";
    storageLogger.error("Failed to set language:", errorMessage);
    return { success: false, error: errorMessage };
  }
};

export const getLanguage = async (): Promise<StorageResult<string>> => {
  try {
    if (options.enableCache && storageCache.has("language")) {
      cacheHits++;
      const cachedValue = storageCache.get("language");
      if (options.enableDebugLogs) {
        storageLogger.info("Language retrieved from cache:", cachedValue);
      }
      return { success: true, data: cachedValue as string };
    }
    cacheMisses++;
    const language = await AsyncStorage.getItem("language");
    const result = language ?? "en";
    if (options.enableCache) {
      manageCacheSize();
      storageCache.set("language", result);
    }
    if (options.enableDebugLogs) {
      storageLogger.info("Language retrieved from storage:", result);
    }
    return { success: true, data: result };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown storage error";
    storageLogger.error("Failed to get language:", errorMessage);
    return { success: false, error: errorMessage };
  }
};

// Theme functions removed - now handled by database via ThemeProvider

// Theme migration functions removed - not needed for first implementation

const setFirstLaunch = async (isFirstLaunch: boolean): Promise<StorageResult<void>> => {
  try {
    const keyValidation = validateKey("isFirstLaunch");
    if (!keyValidation.isValid) {
      return { success: false, error: keyValidation.error };
    }
    if (typeof isFirstLaunch !== "boolean") {
      return { success: false, error: "isFirstLaunch must be a boolean" };
    }
    await AsyncStorage.setItem("isFirstLaunch", String(isFirstLaunch));
    if (options.enableCache) {
      manageCacheSize();
      storageCache.set("isFirstLaunch", isFirstLaunch);
    }
    if (options.enableDebugLogs) {
      storageLogger.info("First launch set:", isFirstLaunch);
    }
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown storage error";
    storageLogger.error("Failed to set first launch:", errorMessage);
    return { success: false, error: errorMessage };
  }
};

const getFirstLaunch = async (): Promise<StorageResult<boolean>> => {
  try {
    if (options.enableCache && storageCache.has("isFirstLaunch")) {
      cacheHits++;
      const cachedValue = storageCache.get("isFirstLaunch");
      if (options.enableDebugLogs) {
        storageLogger.info("First launch retrieved from cache:", cachedValue);
      }
      return { success: true, data: cachedValue as boolean };
    }
    cacheMisses++;
    const isFirstLaunch = await AsyncStorage.getItem("isFirstLaunch");
    const result = isFirstLaunch === "true";
    if (options.enableCache) {
      manageCacheSize();
      storageCache.set("isFirstLaunch", result);
    }
    if (options.enableDebugLogs) {
      storageLogger.info("First launch retrieved from storage:", result);
    }
    return { success: true, data: result };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown storage error";
    storageLogger.error("Failed to get first launch:", errorMessage);
    return { success: false, error: errorMessage };
  }
};

const setNotificationsEnabled = async (enabled: boolean): Promise<StorageResult<void>> => {
  try {
    const keyValidation = validateKey("notificationsEnabled");
    if (!keyValidation.isValid) {
      return { success: false, error: keyValidation.error };
    }
    if (typeof enabled !== "boolean") {
      return { success: false, error: "enabled must be a boolean" };
    }
    await AsyncStorage.setItem("notificationsEnabled", String(enabled));
    if (options.enableCache) {
      manageCacheSize();
      storageCache.set("notificationsEnabled", enabled);
    }
    if (options.enableDebugLogs) {
      storageLogger.info("Notifications enabled set:", enabled);
    }
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown storage error";
    storageLogger.error("Failed to set notifications enabled:", errorMessage);
    return { success: false, error: errorMessage };
  }
};

const getNotificationsEnabled = async (): Promise<StorageResult<boolean>> => {
  try {
    if (options.enableCache && storageCache.has("notificationsEnabled")) {
      cacheHits++;
      const cachedValue = storageCache.get("notificationsEnabled");
      if (options.enableDebugLogs) {
        storageLogger.info("Notifications enabled retrieved from cache:", cachedValue);
      }
      return { success: true, data: cachedValue as boolean };
    }
    cacheMisses++;
    const enabled = await AsyncStorage.getItem("notificationsEnabled");
    const result = enabled === "true";
    if (options.enableCache) {
      manageCacheSize();
      storageCache.set("notificationsEnabled", result);
    }
    if (options.enableDebugLogs) {
      storageLogger.info("Notifications enabled retrieved from storage:", result);
    }
    return { success: true, data: result };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown storage error";
    storageLogger.error("Failed to get notifications enabled:", errorMessage);
    return { success: false, error: errorMessage };
  }
};

const setBiometricEnabled = async (enabled: boolean): Promise<StorageResult<void>> => {
  try {
    const keyValidation = validateKey("biometricEnabled");
    if (!keyValidation.isValid) {
      return { success: false, error: keyValidation.error };
    }
    if (typeof enabled !== "boolean") {
      return { success: false, error: "enabled must be a boolean" };
    }
    await AsyncStorage.setItem("biometricEnabled", String(enabled));
    if (options.enableCache) {
      manageCacheSize();
      storageCache.set("biometricEnabled", enabled);
    }
    if (options.enableDebugLogs) {
      storageLogger.info("Biometric enabled set:", enabled);
    }
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown storage error";
    storageLogger.error("Failed to set biometric enabled:", errorMessage);
    return { success: false, error: errorMessage };
  }
};

const getBiometricEnabled = async (): Promise<StorageResult<boolean>> => {
  try {
    if (options.enableCache && storageCache.has("biometricEnabled")) {
      cacheHits++;
      const cachedValue = storageCache.get("biometricEnabled");
      if (options.enableDebugLogs) {
        storageLogger.info("Biometric enabled retrieved from cache:", cachedValue);
      }
      return { success: true, data: cachedValue as boolean };
    }
    cacheMisses++;
    const enabled = await AsyncStorage.getItem("biometricEnabled");
    const result = enabled === "true";
    if (options.enableCache) {
      manageCacheSize();
      storageCache.set("biometricEnabled", result);
    }
    if (options.enableDebugLogs) {
      storageLogger.info("Biometric enabled retrieved from storage:", result);
    }
    return { success: true, data: result };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown storage error";
    storageLogger.error("Failed to get biometric enabled:", errorMessage);
    return { success: false, error: errorMessage };
  }
};

const clearAll = async (): Promise<StorageResult<void>> => {
  try {
    await AsyncStorage.clear();
    if (options.enableCache) {
      storageCache.clear();
    }
    if (options.enableDebugLogs) {
      storageLogger.info("All storage cleared");
    }
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown storage error";
    storageLogger.error("Failed to clear storage:", errorMessage);
    return { success: false, error: errorMessage };
  }
};

export const storage = {
  setLanguage,
  getLanguage,
  // setTheme, getTheme - removed, now handled by database via ThemeProvider
  setFirstLaunch,
  getFirstLaunch,
  setNotificationsEnabled,
  getNotificationsEnabled,
  setBiometricEnabled,
  getBiometricEnabled,
  clearAll,
} as const;

export const StorageKeys = {
  LANGUAGE: "language",
  THEME: "theme",
  FIRST_LAUNCH: "isFirstLaunch",
  NOTIFICATIONS_ENABLED: "notificationsEnabled",
  BIOMETRIC_ENABLED: "biometricEnabled",
} as const;

export const getItem = async <T>(key: string): Promise<StorageResult<T>> => {
  try {
    const keyValidation = validateKey(key);
    if (!keyValidation.isValid) {
      return { success: false, error: keyValidation.error };
    }
    if (options.enableCache && storageCache.has(key)) {
      cacheHits++;
      const cachedValue = storageCache.get(key);
      if (options.enableDebugLogs) {
        storageLogger.info(`Item retrieved from cache [${key}]:`, cachedValue);
      }
      return { success: true, data: cachedValue as T };
    }
    cacheMisses++;
    const value = await AsyncStorage.getItem(key);
    const result = value ? JSON.parse(value) : null;
    if (options.enableCache && result !== null) {
      manageCacheSize();
      storageCache.set(key, result);
    }
    if (options.enableDebugLogs) {
      storageLogger.info(`Item retrieved from storage [${key}]:`, result);
    }
    return { success: true, data: result as T };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown storage error";
    storageLogger.error(`Failed to get item [${key}]:`, errorMessage);
    return { success: false, error: errorMessage };
  }
};

export const setItem = async <T>(key: string, value: T): Promise<StorageResult<void>> => {
  try {
    const keyValidation = validateKey(key);
    if (!keyValidation.isValid) {
      return { success: false, error: keyValidation.error };
    }
    if (value === undefined) {
      return { success: false, error: "Value cannot be undefined" };
    }
    const serializedValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, serializedValue);
    if (options.enableCache) {
      manageCacheSize();
      storageCache.set(key, value);
    }
    if (options.enableDebugLogs) {
      storageLogger.info(`Item set [${key}]:`, value);
    }
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown storage error";
    storageLogger.error(`Failed to set item [${key}]:`, errorMessage);
    return { success: false, error: errorMessage };
  }
};

export const removeItem = async (key: string): Promise<StorageResult<void>> => {
  try {
    const keyValidation = validateKey(key);
    if (!keyValidation.isValid) {
      return { success: false, error: keyValidation.error };
    }
    await AsyncStorage.removeItem(key);
    if (options.enableCache) {
      storageCache.delete(key);
    }
    if (options.enableDebugLogs) {
      storageLogger.info(`Item removed [${key}]`);
    }
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown storage error";
    storageLogger.error(`Failed to remove item [${key}]:`, errorMessage);
    return { success: false, error: errorMessage };
  }
};

export const getAllKeys = async (): Promise<StorageResult<readonly string[]>> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    if (options.enableDebugLogs) {
      storageLogger.info("All keys retrieved:", keys);
    }
    return { success: true, data: keys };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown storage error";
    storageLogger.error("Failed to get all keys:", errorMessage);
    return { success: false, error: errorMessage };
  }
};

export const configureStorage = (newOptions: Partial<StorageOptions>): void => {
  options = { ...defaultOptions, ...newOptions };
  if (!newOptions.enableCache) {
    clearStorageCache();
  }
  if (options.enableDebugLogs) {
    storageLogger.info("Storage configuration updated:", options);
  }
};
export const clearStorageCache = (): void => {
  storageCache.clear();
  cacheHits = 0;
  cacheMisses = 0;
  if (options.enableDebugLogs) {
    storageLogger.info("Storage cache cleared");
  }
};

export const getStorageStats = async (): Promise<StorageResult<StorageStats>> => {
  try {
    const keysResult = await getAllKeys();
    if (!keysResult.success) {
      return { success: false, error: keysResult.error };
    }
    const totalRequests = cacheHits + cacheMisses;
    const hitRate = totalRequests > 0 ? (cacheHits / totalRequests) * 100 : 0;
    const stats: StorageStats = {
      totalKeys: keysResult.data?.length || 0,
      cacheSize: storageCache.size,
      cacheHits,
      cacheMisses,
      hitRate: Math.round(hitRate * 100) / 100,
    };
    return { success: true, data: stats };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown storage error";
    storageLogger.error("Failed to get storage stats:", errorMessage);
    return { success: false, error: errorMessage };
  }
};

export const createStorageManager = <T>(keyPrefix: string) => {
  return {
    get: async (key: string): Promise<StorageResult<T>> => {
      return await getItem<T>(`${keyPrefix}_${key}`);
    },
    set: async (key: string, value: T): Promise<StorageResult<void>> => {
      return await setItem(`${keyPrefix}_${key}`, value);
    },
    remove: async (key: string): Promise<StorageResult<void>> => {
      return await removeItem(`${keyPrefix}_${key}`);
    },
    clear: async (): Promise<StorageResult<void>> => {
      try {
        const keysResult = await getAllKeys();
        if (!keysResult.success) {
          return { success: false, error: keysResult.error };
        }
        const prefixedKeys = keysResult.data?.filter((key) => key.startsWith(`${keyPrefix}_`)) || [];
        for (const key of prefixedKeys) {
          removeItem(key);
        }
        return { success: true };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown storage error";
        return { success: false, error: errorMessage };
      }
    },
  };
};
