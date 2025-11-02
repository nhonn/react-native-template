import { captureException, init, withScope } from "@sentry/react-native";
import { vexo } from "vexo-analytics";

import { logger } from "./logger";

export interface AnalyticsError {
  error: Error;
  context?: Record<string, unknown>;
  level?: "error" | "warning" | "info";
  tags?: Record<string, string>;
}

let isInitialized = false;

const initializeSentry = (): void => {
  const sentryDsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
  if (sentryDsn) {
    init({
      dsn: sentryDsn,
      environment: process.env.EXPO_PUBLIC_ENVIRONMENT || "development",
      enableAutoSessionTracking: true,
      sessionTrackingIntervalMillis: 30_000,
    });

    logger.log("Sentry initialized successfully");
  }
};

const initializeVexo = (): void => {
  const vexoApiKey = process.env.EXPO_PUBLIC_VEXO_API_KEY;
  if (!vexoApiKey) {
    logger.log(
      "Vexo NOT initialized - enableAnalytics:",
      process.env.EXPO_PUBLIC_ENABLE_ANALYTICS,
      "api key:",
      vexoApiKey ? "SET" : "NOT SET",
    );
    return;
  }

  vexo(vexoApiKey);
  logger.log("Vexo initialized successfully");
};

export const initAnalytics = (): void => {
  try {
    initializeSentry();
    initializeVexo();

    isInitialized = true;
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
  } catch (error) {
    if (process.env.EXPO_PUBLIC_ENVIRONMENT === "development") {
      // biome-ignore lint: Development error logging
      console.error("Failed to track error:", error);
    }
  }
};
