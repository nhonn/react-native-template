import { captureException as sentryCaptureException, init } from "@sentry/react-native";

import { logger } from "./logger";

const sentryDsn = process.env.EXPO_PUBLIC_SENTRY_DSN?.trim() ?? "";

let initialized = false;

export const initSentry = (): void => {
  if (initialized || !sentryDsn) {
    return;
  }

  initialized = true;

  try {
    init({
      dsn: sentryDsn,
      enabled: !__DEV__ || Boolean(sentryDsn),
      tracesSampleRate: 0,
    });
  } catch (error) {
    logger.error("Failed to initialize Sentry:", error);
  }
};

export const captureException = (error: unknown): void => {
  if (!sentryDsn) {
    return;
  }

  sentryCaptureException(error);
};
