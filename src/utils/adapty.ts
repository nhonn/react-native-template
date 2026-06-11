import type { AdaptyPaywallProduct } from "react-native-adapty";
import { adapty, createPaywallView } from "react-native-adapty";

import { logger } from "./logger";

const apiKey = process.env.EXPO_PUBLIC_ADAPTY_API_KEY || "";

export const initializeAdapty = () => {
  if (!apiKey) {
    logger.warn("Skipping Adapty initialization because EXPO_PUBLIC_ADAPTY_API_KEY is missing.");
    return;
  }

  adapty.activate(apiKey);
};

export const getPaywall = async (placementId: string = "default", locale: string = "en") => {
  try {
    const paywall = await adapty.getPaywall(placementId, locale);
    return paywall;
  } catch (error) {
    logger.error("Error getting paywall:", error);
    return null;
  }
};

export const purchase = async (product: AdaptyPaywallProduct) => {
  try {
    const profile = await adapty.makePurchase(product);
    return { success: true, profile };
  } catch (error: unknown) {
    const errorObj = error as { userCancelled?: boolean; message?: string };
    if (errorObj.userCancelled) {
      return { success: false, error: "User cancelled purchase" };
    }
    return { success: false, error: errorObj.message || "Purchase failed" };
  }
};

export const restorePurchases = async () => {
  try {
    const profile = await adapty.restorePurchases();
    return { success: true, profile };
  } catch (error: unknown) {
    const errorObj = error as { message?: string };
    return { success: false, error: errorObj.message || "Restore failed" };
  }
};

export const getProfile = async () => {
  try {
    const profile = await adapty.getProfile();
    return profile;
  } catch (error) {
    logger.error("Error getting profile:", error);
    return null;
  }
};

export const checkActiveSubscription = async (): Promise<boolean> => {
  try {
    const profile = await adapty.getProfile();
    if (!profile?.accessLevels) {
      return false;
    }
    return Object.values(profile.accessLevels).some(
      (level) => level?.isActive || level?.isInGracePeriod || level?.isLifetime,
    );
  } catch (error) {
    logger.error("Error checking subscription status:", error);
    return false;
  }
};

export const presentPaywall = async (placementId: string = "default") => {
  try {
    const paywall = await adapty.getPaywall(placementId, "en");
    if (!paywall.hasViewConfiguration) {
      return { success: false, error: "No paywall configuration available" };
    }

    const view = await createPaywallView(paywall);
    await view.present();

    const profile = await adapty.getProfile();
    return { success: true, profile };
  } catch (error: unknown) {
    const errorObj = error as { userCancelled?: boolean; message?: string };
    if (errorObj.userCancelled) {
      return { success: false, error: "User cancelled paywall" };
    }
    return { success: false, error: errorObj.message || "Failed to present paywall" };
  }
};
