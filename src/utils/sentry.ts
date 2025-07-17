import { init as SentryInit } from "@sentry/react-native";
import { logger } from "@/utils/logger";

let isInitialized = false;

export const initSentry = (): { success: boolean; error?: string } => {
  try {
    const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
    if (!dsn || typeof dsn !== "string" || dsn.trim().length === 0) {
      return {
        success: false,
        error: "Sentry DSN not found in environment variables or configuration",
      };
    }
    SentryInit({
      dsn,
      debug: __DEV__,
      enableAutoSessionTracking: true,
      sessionTrackingIntervalMillis: 10_000,
      integrations: (defaultIntegrations) =>
        defaultIntegrations.filter((integration) => integration.name !== "AppRegistryIntegration"),
      beforeSend(event) {
        if (
          event.message?.includes('multiple versions of the "promise" package') ||
          event.message?.includes("Promise.allSettled") ||
          event.message?.includes("AppRegistryIntegration.onRunApplication not found or invalid")
        ) {
          return null;
        }
        return event;
      },
      beforeBreadcrumb(breadcrumb) {
        if (
          breadcrumb.message?.includes('multiple versions of the "promise" package') ||
          breadcrumb.message?.includes("Promise.allSettled") ||
          breadcrumb.message?.includes("AppRegistryIntegration.onRunApplication not found or invalid")
        ) {
          return null;
        }
        return breadcrumb;
      },
    });
    isInitialized = true;
    logger.scope("Sentry").info("Sentry initialized successfully");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error during Sentry initialization",
    };
  }
};

export const isSentryInitialized = (): boolean => {
  return isInitialized;
};
