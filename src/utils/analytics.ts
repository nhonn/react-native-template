import { PostHog } from "posthog-react-native";

import { logger } from "./logger";

export interface AnalyticsError {
  error: Error;
  context?: Record<string, unknown>;
  level?: "error" | "warning" | "info";
  tags?: Record<string, string>;
}

let posthogClient: PostHog | null = null;
let isInitialized = false;

const initializePostHog = (): void => {
  const posthogApiKey = process.env.EXPO_PUBLIC_POSTHOG_API_KEY;
  const posthogHost = process.env.EXPO_PUBLIC_POSTHOG_HOST;

  if (!posthogApiKey) {
    logger.log("PostHog NOT initialized - api key: NOT SET");
    return;
  }

  posthogClient = new PostHog(posthogApiKey, {
    host: posthogHost,
  });

  logger.log("PostHog initialized successfully");
};

export const initAnalytics = (): void => {
  try {
    initializePostHog();

    isInitialized = true;
    logger.log("Analytics initialization completed");
  } catch (error) {
    logger.error("Failed to initialize analytics:", error);
    throw error;
  }
};

export const trackError = (analyticsError: AnalyticsError): void => {
  if (!(isInitialized && posthogClient)) {
    return;
  }

  try {
    posthogClient.capture("$exception", {
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
