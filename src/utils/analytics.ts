import type { JsonType, PostHogEventProperties } from "@posthog/core";
import PostHog from "posthog-react-native";

import { logger } from "./logger";

export interface AnalyticsError {
  error: Error;
  context?: PostHogEventProperties;
  level?: "error" | "warning" | "info";
  tags?: Record<string, string>;
}

type PostHogClient = InstanceType<typeof PostHog>;
export type AnalyticsEventProperties = PostHogEventProperties;
export type AnalyticsJson = JsonType;

const postHogApiKey = process.env.EXPO_PUBLIC_POSTHOG_API_KEY?.trim() ?? "";
const postHogHost = process.env.EXPO_PUBLIC_POSTHOG_HOST?.trim() ?? "";

let posthog: PostHogClient | null = null;
let isInitialized = false;
let trackingEnabled = true;

const buildPostHogClient = (): PostHogClient => {
  return new PostHog(postHogApiKey, {
    ...(postHogHost ? { host: postHogHost } : {}),
    defaultOptIn: trackingEnabled,
  });
};

const canTrack = (): boolean => isInitialized && posthog !== null && trackingEnabled;

const capture = (eventName: string, properties: PostHogEventProperties = {}): void => {
  if (!canTrack() || posthog === null) {
    return;
  }

  try {
    posthog.capture(eventName, properties);
  } catch (error) {
    logger.error(`Failed to capture PostHog event "${eventName}":`, error);
  }
};

const buildExceptionProperties = (analyticsError: AnalyticsError): PostHogEventProperties => {
  const properties: PostHogEventProperties = {};

  properties.context = analyticsError.context ?? null;
  properties.level = analyticsError.level ?? null;
  properties.tags = analyticsError.tags ?? null;

  return properties;
};

export const initAnalytics = (): void => {
  if (isInitialized) {
    return;
  }

  isInitialized = true;

  if (!postHogApiKey) {
    return;
  }

  try {
    posthog = buildPostHogClient();
  } catch (error) {
    posthog = null;
    logger.error("Failed to initialize PostHog analytics:", error);
  }
};

export const trackEvent = (name: string, properties: PostHogEventProperties = {}): void => {
  capture(name, properties);
};

export const trackScreenView = (screenName: string, properties: PostHogEventProperties = {}): void => {
  capture("screen_view", {
    screen_name: screenName,
    ...properties,
  });
};

export const trackError = (analyticsError: AnalyticsError): void => {
  if (!canTrack() || posthog === null) {
    return;
  }

  try {
    posthog.captureException(analyticsError.error, buildExceptionProperties(analyticsError));
  } catch (error) {
    logger.error("Failed to capture PostHog exception:", error);
  }
};

export const identifyUser = async (userId: string): Promise<void> => {
  if (!canTrack() || posthog === null) {
    return;
  }

  try {
    await posthog.identify(userId);
  } catch (error) {
    logger.error("Failed to identify PostHog user:", error);
  }
};

export const resetUser = async (): Promise<void> => {
  if (!isInitialized || posthog === null) {
    return;
  }

  try {
    posthog.reset();

    if (!trackingEnabled) {
      await posthog.optOut();
    }
  } catch (error) {
    logger.error("Failed to reset PostHog user:", error);
  }
};

export const setTrackingEnabled = async (enabled: boolean): Promise<void> => {
  trackingEnabled = enabled;

  if (!isInitialized || posthog === null) {
    return;
  }

  try {
    if (enabled) {
      await posthog.optIn();
    } else {
      await posthog.optOut();
    }
  } catch (error) {
    logger.error("Failed to update PostHog tracking state:", error);
  }
};

export const getScreenNameFromSegments = (segments: string[]): string => {
  const screenSegments = segments.filter((segment) => !segment.startsWith("("));
  return screenSegments.join("/") || "index";
};
