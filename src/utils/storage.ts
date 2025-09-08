import { storageLogger } from "@/utils/logger";
import { secureStorage } from "@/utils/mmkv";

export interface StorageResult<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
}

export const getLanguage = (): StorageResult<string> => {
  try {
    const language = secureStorage.getString("language");
    const result = language ?? "en";
    return { success: true, data: result };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown storage error";
    storageLogger.error("Failed to get language:", errorMessage);
    return { success: false, error: errorMessage };
  }
};

// Simplified storage - only keeping what's actually used

export const storage = {
  getLanguage,
} as const;
