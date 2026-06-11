import { preventAutoHideAsync } from "expo-splash-screen";

import { logger } from "./logger";

export const initializeSplashScreen = async (): Promise<void> => {
  try {
    await preventAutoHideAsync();
  } catch (error) {
    logger.warn("Failed to prevent splash screen auto-hide:", error);
  }
};
