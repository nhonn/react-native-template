import { vexo } from "vexo-analytics";

import { analyticsLogger } from "@/utils/logger";

export interface AnalyticsConfig {
  readonly apiKey: string;
  readonly environment: "development" | "production";
  readonly enableLogging: boolean;
}

export interface AnalyticsEvent {
  readonly name: string;
  readonly properties?: Record<string, unknown>;
  readonly timestamp?: Date;
}

export interface AnalyticsError {
  readonly message: string;
  readonly code?: string;
  readonly context?: Record<string, unknown>;
}

let isInitialized = false;

let config: AnalyticsConfig | null = null;

export const initAnalytics = (apiKey?: string): { success: boolean; error?: string } => {
  try {
    const key = apiKey || process.env.EXPO_PUBLIC_VEXO_API_KEY;
    if (!key) {
      return {
        success: false,
        error: "Analytics API key is required",
      };
    }
    if (typeof key !== "string" || key.trim().length === 0) {
      return {
        success: false,
        error: "Analytics API key must be a non-empty string",
      };
    }
    config = {
      apiKey: key.trim(),
      environment: process.env.NODE_ENV === "production" ? "production" : "development",
      enableLogging: process.env.NODE_ENV !== "production",
    };
    vexo(config.apiKey);
    isInitialized = true;
    try {
      // Initialize analytics here if needed
      analyticsLogger.info("Analytics initialized successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      analyticsLogger.error("Analytics initialization failed:", errorMessage);
    }
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown analytics initialization error";
    analyticsLogger.error("Analytics initialization failed:", errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
};

export const trackEvent = (event: AnalyticsEvent): { success: boolean; error?: string } => {
  try {
    if (!isInitialized) {
      return {
        success: false,
        error: "Analytics not initialized. Call initAnalytics() first.",
      };
    }
    if (!event.name || typeof event.name !== "string") {
      return {
        success: false,
        error: "Event name is required and must be a string",
      };
    }
    try {
      // Track event here
      analyticsLogger.info("Analytics event tracked:", event);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      analyticsLogger.error("Analytics tracking failed:", errorMessage);
    }
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown tracking error";
    analyticsLogger.error("Analytics tracking failed:", errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
};

export const trackError = (error: AnalyticsError): { success: boolean; error?: string } => {
  try {
    if (!isInitialized) {
      return {
        success: false,
        error: "Analytics not initialized. Call initAnalytics() first.",
      };
    }
    if (!error.message || typeof error.message !== "string") {
      return {
        success: false,
        error: "Error message is required and must be a string",
      };
    }
    analyticsLogger.info("Analytics error tracked:", error);

    return { success: true };
  } catch (trackingError) {
    const errorMessage = trackingError instanceof Error ? trackingError.message : "Unknown error tracking failure";
    analyticsLogger.error("Analytics error tracking failed:", errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
};

export const getAnalyticsConfig = (): AnalyticsConfig | null => {
  return config;
};

export const isAnalyticsInitialized = (): boolean => {
  return isInitialized;
};

export const resetAnalytics = (): void => {
  isInitialized = false;
  config = null;
};
