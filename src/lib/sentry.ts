import {
  addBreadcrumb,
  flush,
  init,
  captureException as sentryCaptureException,
  captureMessage as sentryCaptureMessage,
  setContext,
  setTag,
  setUser,
  withScope,
} from "@sentry/react-native";
import { logger } from "@/utils/logger";

type SeverityLevel = "fatal" | "error" | "warning" | "log" | "info" | "debug";

interface SentryConfig {
  dsn: string;
  debug?: boolean;
  environment?: string;
  sampleRate?: number;
  tracesSampleRate?: number;
  enableAutoSessionTracking?: boolean;
  enableNativeCrashHandling?: boolean;
}

class SentryService {
  private isInitialized = false;

  initialize(config: SentryConfig): void {
    try {
      init({
        dsn: config.dsn,
        debug: config.debug ?? __DEV__,
        environment: config.environment ?? (__DEV__ ? "development" : "production"),
        sampleRate: config.sampleRate ?? 1.0,
        tracesSampleRate: config.tracesSampleRate ?? 0.1,
        enableAutoSessionTracking: config.enableAutoSessionTracking ?? true,
        enableNativeCrashHandling: config.enableNativeCrashHandling ?? true,
        beforeSend: (event) => {
          // Filter out development errors in production
          if (!__DEV__ && event.environment === "development") {
            return null;
          }
          return event;
        },
      });

      this.isInitialized = true;
      logger.info("Sentry initialized successfully");
    } catch (error) {
      logger.error("Failed to initialize Sentry:", error);
      throw error;
    }
  }

  captureException(error: Error, context?: Record<string, unknown>): void {
    if (!this.isInitialized) {
      logger.warn("Sentry not initialized, logging error locally:", error);
      return;
    }

    try {
      if (context) {
        withScope((scope) => {
          for (const [key, value] of Object.entries(context)) {
            scope.setContext(key, value as Record<string, unknown>);
          }
          sentryCaptureException(error);
        });
      } else {
        sentryCaptureException(error);
      }
    } catch (sentryError) {
      logger.error("Failed to capture exception in Sentry:", sentryError);
    }
  }

  captureMessage(message: string, level: SeverityLevel = "info", context?: Record<string, unknown>): void {
    if (!this.isInitialized) {
      logger.warn("Sentry not initialized, logging message locally:", message);
      return;
    }

    try {
      if (context) {
        withScope((scope) => {
          for (const [key, value] of Object.entries(context)) {
            scope.setContext(key, value as Record<string, unknown>);
          }
          sentryCaptureMessage(message, level);
        });
      } else {
        sentryCaptureMessage(message, level);
      }
    } catch (error) {
      logger.error("Failed to capture message in Sentry:", error);
    }
  }

  setUser(user: { id?: string; email?: string; username?: string; [key: string]: unknown }): void {
    if (!this.isInitialized) {
      return;
    }

    try {
      setUser(user);
    } catch (error) {
      logger.error("Failed to set user in Sentry:", error);
    }
  }

  setTag(key: string, value: string): void {
    if (!this.isInitialized) {
      return;
    }

    try {
      setTag(key, value);
    } catch (error) {
      logger.error("Failed to set tag in Sentry:", error);
    }
  }

  setContext(key: string, context: Record<string, unknown>): void {
    if (!this.isInitialized) {
      return;
    }

    try {
      setContext(key, context);
    } catch (error) {
      logger.error("Failed to set context in Sentry:", error);
    }
  }

  addBreadcrumb(breadcrumb: {
    message: string;
    category?: string;
    level?: SeverityLevel;
    data?: Record<string, unknown>;
  }): void {
    if (!this.isInitialized) {
      return;
    }

    try {
      addBreadcrumb(breadcrumb);
    } catch (error) {
      logger.error("Failed to add breadcrumb in Sentry:", error);
    }
  }

  flush(): Promise<boolean> {
    if (!this.isInitialized) {
      return Promise.resolve(false);
    }

    return flush().catch((error) => {
      logger.error("Failed to flush Sentry:", error);
      return false;
    });
  }

  get isReady(): boolean {
    return this.isInitialized;
  }
}

// Export singleton instance
export const sentry = new SentryService();

// Export types
export type { SentryConfig, SeverityLevel };
