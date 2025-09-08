import { MMKV } from "react-native-mmkv";

import { logger } from "./logger";

// Create MMKV instance with encryption for sensitive data
const storage = new MMKV({
  id: "app-storage",
  encryptionKey: "app-encryption-key-2024", // In production, use a secure key
});

// Create separate instance for cache data (no encryption for performance)
const cacheStorageInstance = new MMKV({
  id: "app-cache",
});

/**
 * Storage utility interface for type safety
 */
export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
  getAllKeys(): string[];
}

/**
 * MMKV storage adapter with error handling and logging
 */
class MMKVStorageAdapter implements StorageAdapter {
  private mmkv: MMKV;
  private name: string;

  constructor(mmkv: MMKV, name: string) {
    this.mmkv = mmkv;
    this.name = name;
  }

  getItem(key: string): string | null {
    try {
      const value = this.mmkv.getString(key);
      return value ?? null;
    } catch (error) {
      logger.error(`[${this.name}] Failed to get item '${key}':`, error);
      return null;
    }
  }

  setItem(key: string, value: string): void {
    try {
      this.mmkv.set(key, value);
    } catch (error) {
      logger.error(`[${this.name}] Failed to set item '${key}':`, error);
    }
  }

  removeItem(key: string): void {
    try {
      this.mmkv.delete(key);
    } catch (error) {
      logger.error(`[${this.name}] Failed to remove item '${key}':`, error);
    }
  }

  clear(): void {
    try {
      this.mmkv.clearAll();
    } catch (error) {
      logger.error(`[${this.name}] Failed to clear storage:`, error);
    }
  }

  getAllKeys(): string[] {
    try {
      return this.mmkv.getAllKeys();
    } catch (error) {
      logger.error(`[${this.name}] Failed to get all keys:`, error);
      return [];
    }
  }
}

/**
 * Enhanced MMKV utility with typed operations
 */
class MMKVStorage {
  private adapter: StorageAdapter;

  constructor(adapter: StorageAdapter) {
    this.adapter = adapter;
  }

  /**
   * Get string value
   */
  getString(key: string): string | null {
    return this.adapter.getItem(key);
  }

  /**
   * Set string value
   */
  setString(key: string, value: string): void {
    this.adapter.setItem(key, value);
  }

  /**
   * Get boolean value
   */
  getBoolean(key: string): boolean | null {
    const value = this.adapter.getItem(key);
    if (value === null) {
      return null;
    }
    return value === "true";
  }

  /**
   * Set boolean value
   */
  setBoolean(key: string, value: boolean): void {
    this.adapter.setItem(key, value.toString());
  }

  /**
   * Get number value
   */
  getNumber(key: string): number | null {
    const value = this.adapter.getItem(key);
    if (value === null) {
      return null;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }

  /**
   * Set number value
   */
  setNumber(key: string, value: number): void {
    this.adapter.setItem(key, value.toString());
  }

  /**
   * Get JSON object
   */
  getObject<T = unknown>(key: string): T | null {
    const value = this.adapter.getItem(key);
    if (value === null) {
      return null;
    }

    try {
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error(`Failed to parse JSON for key '${key}':`, error);
      return null;
    }
  }

  /**
   * Set JSON object
   */
  setObject<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      this.adapter.setItem(key, serialized);
    } catch (error) {
      logger.error(`Failed to serialize object for key '${key}':`, error);
    }
  }

  /**
   * Remove item
   */
  removeItem(key: string): void {
    this.adapter.removeItem(key);
  }

  /**
   * Check if key exists
   */
  contains(key: string): boolean {
    return this.adapter.getItem(key) !== null;
  }

  /**
   * Get all keys
   */
  getAllKeys(): string[] {
    return this.adapter.getAllKeys();
  }

  /**
   * Clear all data
   */
  clear(): void {
    this.adapter.clear();
  }

  /**
   * Get storage adapter (for React Query, Zustand, etc.)
   */
  getAdapter(): StorageAdapter {
    return this.adapter;
  }
}

// Export storage instances
export const secureStorage = new MMKVStorage(new MMKVStorageAdapter(storage, "SecureStorage"));

export const cacheStorage = new MMKVStorage(new MMKVStorageAdapter(cacheStorageInstance, "CacheStorage"));

// Export adapters for third-party libraries
export const secureStorageAdapter = secureStorage.getAdapter();
export const cacheStorageAdapter = cacheStorage.getAdapter();

// Export class
export { MMKVStorage };
