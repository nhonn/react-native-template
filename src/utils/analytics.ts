import { getAnalytics, logEvent, logScreenView } from "@react-native-firebase/analytics";

import { logger } from "./logger";

export type AnalyticsPrimitive = string | number | boolean;
export type AnalyticsEventProperties = Record<string, AnalyticsPrimitive>;

const analyticsInstance = () => getAnalytics();

const isAnalyticsPrimitive = (value: unknown): value is AnalyticsPrimitive => {
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean";
};

const toAnalyticsProperties = (properties: Record<string, unknown> = {}): AnalyticsEventProperties => {
  const analyticsProperties: AnalyticsEventProperties = {};

  for (const [key, value] of Object.entries(properties)) {
    if (isAnalyticsPrimitive(value)) {
      analyticsProperties[key] = value;
    }
  }

  return analyticsProperties;
};

const reportAnalyticsError = (message: string, error: unknown): void => {
  logger.error(message, error);
};

const withAnalytics = async (
  operation: (analytics: ReturnType<typeof getAnalytics>) => Promise<void>,
): Promise<void> => {
  try {
    await operation(getAnalytics());
  } catch (error) {
    reportAnalyticsError("Failed to send Firebase Analytics event:", error);
  }
};

export const trackEvent = (name: string, properties: Record<string, unknown> = {}): void => {
  void withAnalytics(async (_analytics) => {
    await logEvent(analyticsInstance(), name, toAnalyticsProperties(properties));
  });
};

export const trackScreenView = (screenName: string, properties: Record<string, unknown> = {}): void => {
  void withAnalytics(async (analytics) => {
    await logScreenView(analytics, {
      screen_name: screenName,
      screen_class: screenName,
      ...toAnalyticsProperties(properties),
    });
  });
};

export const getScreenNameFromSegments = (segments: string[]): string => {
  const screenSegments = segments.filter((segment) => !segment.startsWith("("));
  return screenSegments.join("/") || "index";
};

export const shouldTrackScreenView = (previousScreenName: string | null, nextScreenName: string): boolean =>
  previousScreenName !== nextScreenName;
