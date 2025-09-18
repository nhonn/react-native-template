import { Mixpanel } from "mixpanel-react-native";

import { logger } from "@/utils/logger";

interface AnalyticsConfig {
  token: string;
  trackAutomaticEvents?: boolean;
  enableLogging?: boolean;
}

interface ScreenViewEvent {
  screen_name: string;
  screen_class?: string;
  previous_screen?: string;
  timestamp?: number;
}

interface SheetEvent {
  sheet_name: string;
  action: "open" | "close";
  trigger?: string;
  timestamp?: number;
}

interface UserProperties {
  user_id?: string;
  email?: string;
  name?: string;
  [key: string]: unknown;
}

class Analytics {
  private mixpanel: Mixpanel | null = null;
  private isInitialized = false;
  private currentScreen: string | null = null;

  async initialize(config: AnalyticsConfig): Promise<void> {
    try {
      this.mixpanel = new Mixpanel(config.token, config.trackAutomaticEvents ?? true);
      await this.mixpanel.init();

      if (config.enableLogging) {
        this.mixpanel.setLoggingEnabled(true);
      }

      this.isInitialized = true;
      logger.info("Analytics initialized successfully");
    } catch (error) {
      logger.error("Failed to initialize analytics:", error);
      throw error;
    }
  }

  trackScreenView(screenName: string, previousScreen?: string): void {
    if (!this.isInitialized) {
      logger.warn("Analytics not initialized, skipping screen view tracking");
      return;
    }

    if (!this.mixpanel) {
      logger.warn("Mixpanel instance not available");
      return;
    }

    try {
      const event: ScreenViewEvent = {
        screen_name: screenName,
        screen_class: screenName,
        previous_screen: previousScreen || this.currentScreen || undefined,
        timestamp: Date.now(),
      };

      this.mixpanel.track("Screen View", event);
      this.currentScreen = screenName;

      logger.debug(`Tracked screen view: ${screenName}`);
    } catch (error) {
      logger.error("Failed to track screen view:", error);
    }
  }

  trackSheetOpen(sheetName: string, trigger?: string): void {
    if (!this.isInitialized) {
      logger.warn("Analytics not initialized, skipping sheet open tracking");
      return;
    }

    if (!this.mixpanel) {
      logger.warn("Mixpanel instance not available");
      return;
    }

    try {
      const event: SheetEvent = {
        sheet_name: sheetName,
        action: "open",
        trigger,
        timestamp: Date.now(),
      };

      this.mixpanel.track("Sheet Open", event);
      logger.debug(`Tracked sheet open: ${sheetName}`);
    } catch (error) {
      logger.error("Failed to track sheet open:", error);
    }
  }

  trackSheetClose(sheetName: string): void {
    if (!this.isInitialized) {
      logger.warn("Analytics not initialized, skipping sheet close tracking");
      return;
    }

    if (!this.mixpanel) {
      logger.warn("Mixpanel instance not available");
      return;
    }

    try {
      const event: SheetEvent = {
        sheet_name: sheetName,
        action: "close",
        timestamp: Date.now(),
      };

      this.mixpanel.track("Sheet Close", event);
      logger.debug(`Tracked sheet close: ${sheetName}`);
    } catch (error) {
      logger.error("Failed to track sheet close:", error);
    }
  }

  trackEvent(eventName: string, properties?: Record<string, unknown>): void {
    if (!this.isInitialized) {
      logger.warn("Analytics not initialized, skipping event tracking");
      return;
    }

    if (!this.mixpanel) {
      logger.warn("Mixpanel instance not available");
      return;
    }

    try {
      this.mixpanel.track(eventName, {
        ...properties,
        timestamp: Date.now(),
      });

      logger.debug(`Tracked event: ${eventName}`, properties);
    } catch (error) {
      logger.error("Failed to track event:", error);
    }
  }

  setUserProperties(properties: UserProperties): void {
    if (!this.isInitialized) {
      logger.warn("Analytics not initialized, skipping user properties");
      return;
    }

    if (!this.mixpanel) {
      logger.warn("Mixpanel instance not available");
      return;
    }

    try {
      this.mixpanel.getPeople().set(properties);

      if (properties.user_id) {
        this.mixpanel.identify(properties.user_id);
      }

      logger.debug("Set user properties:", properties);
    } catch (error) {
      logger.error("Failed to set user properties:", error);
    }
  }

  reset(): void {
    if (!this.isInitialized) {
      return;
    }

    if (!this.mixpanel) {
      return;
    }

    try {
      this.mixpanel.reset();
      this.currentScreen = null;
      logger.debug("Analytics reset");
    } catch (error) {
      logger.error("Failed to reset analytics:", error);
    }
  }

  flush(): void {
    if (!this.isInitialized) {
      return;
    }

    if (!this.mixpanel) {
      return;
    }

    try {
      this.mixpanel.flush();
      logger.debug("Analytics flushed");
    } catch (error) {
      logger.error("Failed to flush analytics:", error);
    }
  }

  get isReady(): boolean {
    return this.isInitialized && this.mixpanel !== null;
  }
}

// Export singleton instance
export const analytics = new Analytics();

// Export types for external use
export type { AnalyticsConfig, ScreenViewEvent, SheetEvent, UserProperties };
