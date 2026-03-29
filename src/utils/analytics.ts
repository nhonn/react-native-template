import { logger } from "./logger";

export interface AnalyticsError {
  error: Error;
  context?: Record<string, unknown>;
  level?: "error" | "warning" | "info";
  tags?: Record<string, string>;
}

let isInitialized = false;

export const initAnalytics = (): void => {
  try {
    isInitialized = true;
    logger.log("Analytics template initialized (no provider configured)");
  } catch (error) {
    logger.error("Failed to initialize analytics:", error);
  }
};

export const trackError = (analyticsError: AnalyticsError): void => {
  if (!isInitialized) {
    return;
  }

  logger.log("trackError called (analytics provider not configured):", analyticsError);
};

export const trackEvent = (name: string, properties: Record<string, unknown> = {}): void => {
  if (!isInitialized) {
    return;
  }

  logger.log("trackEvent called (analytics provider not configured):", { name, properties });
};

export const identifyUser = async (userId: string): Promise<void> => {
  if (!isInitialized) {
    return;
  }

  logger.log("identifyUser called (analytics provider not configured):", userId);
};

export const resetUser = async (): Promise<void> => {
  if (!isInitialized) {
    return;
  }

  logger.log("resetUser called (analytics provider not configured)");
};

export const setTrackingEnabled = async (enabled: boolean): Promise<void> => {
  if (!isInitialized) {
    return;
  }

  logger.log("setTrackingEnabled called (analytics provider not configured):", enabled);
};
