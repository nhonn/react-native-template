import { captureException, init, setUser, withScope } from "@sentry/react-native";
import { Mixpanel } from "mixpanel-react-native";

import { EVENT_BUTTON_PRESSED, EVENT_SCREEN_VIEW, EVENT_SHEET_VIEW } from "@/constants/analytics";
import { logger } from "./logger";
import { storage } from "./storage";

// Analytics Configuration Interface
export interface AnalyticsConfig {
  mixpanelToken: string;
  sentryDsn: string;
  environment: "development" | "production" | "staging";
  enableAnalytics: boolean;
  enableErrorTracking: boolean;
  userId?: string;
  userProperties?: Record<string, unknown>;
}

// Analytics Event Interface
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp?: Date;
}

// Analytics Error Interface
export interface AnalyticsError {
  error: Error;
  context?: Record<string, unknown>;
  level?: "error" | "warning" | "info";
  tags?: Record<string, string>;
}

// Global instances and state
let mixpanelInstance: Mixpanel | null = null;
let isInitialized = false;
let config: AnalyticsConfig | null = null;

const initializeSentry = (analyticsConfig: AnalyticsConfig): void => {
  if (analyticsConfig.enableErrorTracking && analyticsConfig.sentryDsn) {
    init({
      dsn: analyticsConfig.sentryDsn,
      environment: analyticsConfig.environment,
      enableAutoSessionTracking: true,
      sessionTrackingIntervalMillis: 30_000,
    });

    logger.log("Sentry initialized successfully");
  }
};

const setMixpanelUserProperties = async (analyticsConfig: AnalyticsConfig): Promise<void> => {
  if (analyticsConfig.userId) {
    await mixpanelInstance?.identify(analyticsConfig.userId);
    logger.log("Mixpanel user identified:", analyticsConfig.userId);
  }

  if (analyticsConfig.userProperties) {
    await mixpanelInstance?.getPeople().set(analyticsConfig.userProperties);
    logger.log("Mixpanel user properties set:", analyticsConfig.userProperties);
  }
};

const initializeMixpanel = async (analyticsConfig: AnalyticsConfig): Promise<void> => {
  if (analyticsConfig.enableAnalytics && analyticsConfig.mixpanelToken) {
    logger.log("Initializing Mixpanel with token:", analyticsConfig.mixpanelToken);

    const trackAutomaticEvents = false;
    mixpanelInstance = new Mixpanel(analyticsConfig.mixpanelToken, trackAutomaticEvents);
    await mixpanelInstance.init();

    logger.log("Mixpanel initialized successfully");

    await setMixpanelUserProperties(analyticsConfig);
  } else {
    logger.log(
      "Mixpanel NOT initialized - enableAnalytics:",
      analyticsConfig.enableAnalytics,
      "token:",
      analyticsConfig.mixpanelToken ? "SET" : "NOT SET",
    );
  }
};

/**
 * Initialize analytics with Mixpanel and Sentry
 */
export const initAnalytics = async (analyticsConfig: AnalyticsConfig): Promise<void> => {
  try {
    config = analyticsConfig;

    initializeSentry(config);
    await initializeMixpanel(config);

    isInitialized = true;
    logger.log("Analytics initialization completed");
  } catch (error) {
    logger.error("Failed to initialize analytics:", error);
    throw error;
  }
};

/**
 * Track custom events
 */
export const trackEvent = async (event: AnalyticsEvent): Promise<void> => {
  if (!(isInitialized && config?.enableAnalytics && mixpanelInstance)) {
    return;
  }

  await mixpanelInstance.track(event.name, {
    ...event.properties,
    timestamp: event.timestamp || new Date(),
    environment: config.environment,
  });
};

/**
 * Track screen open events
 */
export const trackScreenOpen = async (screenName: string, properties?: Record<string, unknown>): Promise<void> => {
  await trackEvent({
    name: EVENT_SCREEN_VIEW,
    properties: {
      screen_name: screenName,
      ...properties,
    },
  });
};

/**
 * Track sheet open events (bottom sheets, modals, etc.)
 */
export const trackSheetOpen = async (sheetName: string, properties?: Record<string, unknown>): Promise<void> => {
  await trackEvent({
    name: EVENT_SHEET_VIEW,
    properties: {
      sheet_name: sheetName,
      ...properties,
    },
  });
};

export const trackPressed = async (
  screenName: string,
  elementName: string,
  properties?: Record<string, unknown>,
): Promise<void> => {
  await trackEvent({
    name: EVENT_BUTTON_PRESSED,
    properties: {
      screen_name: screenName,
      element: elementName,
      ...properties,
    },
  });
};

/**
 * Track errors with Sentry and Mixpanel
 */
export const trackError = async (analyticsError: AnalyticsError): Promise<void> => {
  if (!(isInitialized && config?.enableErrorTracking)) {
    return;
  }

  try {
    // Track with Sentry
    withScope((scope) => {
      if (analyticsError.context) {
        scope.setContext("error_context", analyticsError.context);
      }

      if (analyticsError.tags) {
        for (const [key, value] of Object.entries(analyticsError.tags)) {
          scope.setTag(key, value);
        }
      }

      scope.setLevel(analyticsError.level || "error");
      captureException(analyticsError.error);
    });

    // Also track as Mixpanel event for analytics
    if (config?.enableAnalytics && mixpanelInstance) {
      await mixpanelInstance.track("Error Occurred", {
        error_message: analyticsError.error.message,
        error_name: analyticsError.error.name,
        error_stack: analyticsError.error.stack,
        level: analyticsError.level || "error",
        ...analyticsError.context,
        environment: config.environment,
      });
    }
  } catch (error) {
    if (config?.environment === "development") {
      // biome-ignore lint: Development error logging
      console.error("Failed to track error:", error);
    }
  }
};

/**
 * Identify user for analytics and error tracking
 */
export const identifyUser = async (userId: string, properties?: Record<string, unknown>): Promise<void> => {
  if (!isInitialized) {
    return;
  }

  try {
    // Update Sentry user context
    if (config?.enableErrorTracking) {
      setUser({
        id: userId,
        ...properties,
      });
    }

    // Update Mixpanel user
    if (config?.enableAnalytics && mixpanelInstance) {
      await mixpanelInstance.identify(userId);

      if (properties) {
        await mixpanelInstance.getPeople().set(properties);
      }
    }

    // Store user ID for persistence
    await storage.setItem("analytics_user_id", userId);
    if (properties) {
      await storage.setItem("analytics_user_properties", JSON.stringify(properties));
    }
  } catch (error) {
    if (config?.environment === "development") {
      // biome-ignore lint: Development error logging
      console.error("Failed to identify user:", error);
    }
  }
};

/**
 * Reset user data
 */
export const resetUser = async (): Promise<void> => {
  if (!isInitialized) {
    return;
  }

  try {
    // Clear Sentry user
    if (config?.enableErrorTracking) {
      setUser(null);
    }

    // Reset Mixpanel user
    if (config?.enableAnalytics && mixpanelInstance) {
      await mixpanelInstance.reset();
    }

    // Clear stored user data
    await storage.removeItem("analytics_user_id");
    await storage.removeItem("analytics_user_properties");
  } catch (error) {
    if (config?.environment === "development") {
      // biome-ignore lint: Development error logging
      console.error("Failed to reset user:", error);
    }
  }
};

/**
 * Set user property
 */
export const setUserProperty = async (key: string, value: unknown): Promise<void> => {
  if (!(isInitialized && config?.enableAnalytics && mixpanelInstance)) {
    return;
  }

  try {
    await mixpanelInstance.getPeople().set({ [key]: value });

    // Update Sentry user context
    if (config.enableErrorTracking) {
      setUser({ [key]: value });
    }
  } catch (error) {
    if (config.environment === "development") {
      // biome-ignore lint: Development error logging
      console.error("Failed to set user property:", error);
    }
  }
};

/**
 * Start session tracking
 */
export const startSession = async (): Promise<void> => {
  if (!(isInitialized && config?.enableAnalytics && mixpanelInstance)) {
    return;
  }

  try {
    await trackEvent({
      name: "Session Started",
      properties: {
        session_id: Date.now().toString(),
        timestamp: new Date(),
      },
    });
  } catch (error) {
    if (config.environment === "development") {
      // biome-ignore lint: Development error logging
      console.error("Failed to start session:", error);
    }
  }
};

/**
 * End session tracking
 */
export const endSession = async (): Promise<void> => {
  if (!(isInitialized && config?.enableAnalytics && mixpanelInstance)) {
    return;
  }

  try {
    await trackEvent({
      name: "Session Ended",
      properties: {
        timestamp: new Date(),
      },
    });

    await flush();
  } catch (error) {
    if (config.environment === "development") {
      // biome-ignore lint: Development error logging
      console.error("Failed to end session:", error);
    }
  }
};

/**
 * Flush pending analytics data
 */
export const flush = async (): Promise<void> => {
  if (!isInitialized) {
    return;
  }

  try {
    if (config?.enableAnalytics && mixpanelInstance) {
      await mixpanelInstance.flush();
    }
  } catch (error) {
    if (config?.environment === "development") {
      // biome-ignore lint: Development error logging
      console.error("Failed to flush analytics:", error);
    }
  }
};

/**
 * Get Mixpanel instance (for advanced usage)
 */
export const getMixpanelInstance = (): Mixpanel | null => {
  return mixpanelInstance;
};

/**
 * Get analytics configuration
 */
export const getAnalyticsConfig = (): AnalyticsConfig | null => {
  return config;
};

/**
 * Check if analytics is initialized
 */
export const isAnalyticsInitialized = (): boolean => {
  return isInitialized;
};
