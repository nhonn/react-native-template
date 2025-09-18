import type { ReactNode } from "react";
import { useEffect } from "react";

import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { analytics } from "@/lib/analytics";
import { sentry } from "@/lib/sentry";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { logger } from "@/utils/logger";

interface MainProviderProps {
  children: ReactNode;
}

export function MainProvider({ children }: MainProviderProps) {
  useEffect(() => {
    const initializeServices = async () => {
      try {
        // Initialize Sentry first for error tracking
        const sentryDsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
        if (sentryDsn) {
          sentry.initialize({
            dsn: sentryDsn,
            debug: __DEV__,
            environment: __DEV__ ? "development" : "production",
          });
          logger.info("Sentry initialized");
        } else {
          logger.warn("Sentry DSN not found, skipping initialization");
        }

        // Initialize Analytics
        const mixpanelToken = process.env.EXPO_PUBLIC_MIXPANEL_TOKEN;
        if (mixpanelToken) {
          await analytics.initialize({
            token: mixpanelToken,
            trackAutomaticEvents: true,
            enableLogging: __DEV__,
          });
          logger.info("Analytics initialized");
        } else {
          logger.warn("Mixpanel token not found, skipping initialization");
        }
      } catch (error) {
        logger.error("Failed to initialize services:", error);
        // Don't throw - app should still work without analytics/sentry
      }
    };

    initializeServices();
  }, []);

  return (
    <ThemeProvider>
      <ErrorBoundary>{children}</ErrorBoundary>
    </ThemeProvider>
  );
}
