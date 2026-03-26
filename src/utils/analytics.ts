import { customEvent, disableTracking, enableTracking, identifyDevice, vexo } from "vexo-analytics";

import { logger } from "./logger";

export interface AnalyticsError {
  error: Error;
  context?: Record<string, unknown>;
  level?: "error" | "warning" | "info";
  tags?: Record<string, string>;
}

let isInitialized = false;

const initializeVexo = (): boolean => {
  const vexoApiKey = process.env.EXPO_PUBLIC_VEXO_API_KEY;

  if (!vexoApiKey) {
    logger.log("Vexo NOT initialized - api key: NOT SET");
    return false;
  }

  vexo(vexoApiKey);
  logger.log("Vexo initialized successfully");
  return true;
};

export const initAnalytics = (): void => {
  try {
    isInitialized = initializeVexo();
    logger.log("Analytics initialization completed");
  } catch (error) {
    logger.error("Failed to initialize analytics:", error);
    throw error;
  }
};

export const trackError = (analyticsError: AnalyticsError): void => {
  if (!isInitialized) {
    return;
  }

  try {
    customEvent("$exception", {
      level: analyticsError.level || "error",
      $exception_personURL: analyticsError.error.message,
      $exception_type: analyticsError.error.name,
      ...analyticsError.context,
      ...analyticsError.tags,
    });
  } catch (error) {
    if (process.env.EXPO_PUBLIC_ENVIRONMENT === "development") {
      logger.error("Failed to track error:", error);
    }
  }
};

export const trackEvent = (name: string, properties: Record<string, unknown> = {}): void => {
  if (!isInitialized) {
    return;
  }

  try {
    customEvent(name, properties);
  } catch (error) {
    if (process.env.EXPO_PUBLIC_ENVIRONMENT === "development") {
      logger.error("Failed to track event:", error);
    }
  }
};

export const identifyUser = async (userId: string): Promise<void> => {
  if (!isInitialized) {
    return;
  }

  try {
    await identifyDevice(userId);
  } catch (error) {
    if (process.env.EXPO_PUBLIC_ENVIRONMENT === "development") {
      logger.error("Failed to identify user:", error);
    }
  }
};

export const resetUser = async (): Promise<void> => {
  if (!isInitialized) {
    return;
  }

  try {
    await identifyDevice(null);
  } catch (error) {
    if (process.env.EXPO_PUBLIC_ENVIRONMENT === "development") {
      logger.error("Failed to reset user identity:", error);
    }
  }
};

export const setTrackingEnabled = async (enabled: boolean): Promise<void> => {
  if (!isInitialized) {
    return;
  }

  try {
    if (enabled) {
      await enableTracking();
      return;
    }

    await disableTracking();
  } catch (error) {
    if (process.env.EXPO_PUBLIC_ENVIRONMENT === "development") {
      logger.error("Failed to update tracking state:", error);
    }
  }
};
