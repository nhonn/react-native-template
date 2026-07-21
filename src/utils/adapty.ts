import type { AdaptyProfile, AdaptyPurchaseResult } from "react-native-adapty";
import { adapty, createFlowView } from "react-native-adapty";

import { useSettingsStore } from "@/stores/settings";

import { logger } from "./logger";

const apiKey = process.env.EXPO_PUBLIC_ADAPTY_API_KEY || "";
export const PREMIUM_ACCESS_LEVEL_ID = "premium";
export const PAYWALL_PLACEMENTS = {
  limit: "settings",
  subscription: "settings",
} as const;
export const ONBOARDING_PLACEMENT = "onboarding_v1";

const syncPremiumProfile = (profile: AdaptyProfile) => {
  const premium = profile.accessLevels?.[PREMIUM_ACCESS_LEVEL_ID];
  const hasPremiumAccess = Boolean(premium?.isActive || premium?.isInGracePeriod || premium?.isLifetime);
  useSettingsStore.getState().setIsPremium(hasPremiumAccess);
  return hasPremiumAccess;
};

export const initializeAdapty = async () => {
  if (!apiKey) {
    logger.warn("Skipping Adapty initialization because EXPO_PUBLIC_ADAPTY_API_KEY is missing.");
    return;
  }

  adapty.addEventListener("onLatestProfileLoad", (profile) => {
    syncPremiumProfile(profile);
  });
  await adapty.activate(apiKey, { __ignoreActivationOnFastRefresh: __DEV__ });
  await refreshPremiumStatus();
};

export const restorePurchases = async () => {
  try {
    const profile = await adapty.restorePurchases();
    syncPremiumProfile(profile);
    return { success: true, profile };
  } catch (error: unknown) {
    const errorObj = error as { message?: string };
    return { success: false, error: errorObj.message || "Restore failed" };
  }
};

export const getProfile = async () => {
  try {
    const profile = await adapty.getProfile();
    syncPremiumProfile(profile);
    return profile;
  } catch (error) {
    logger.error("Error getting profile:", error);
    return null;
  }
};

export const refreshPremiumStatus = async (): Promise<boolean> => {
  try {
    const profile = await adapty.getProfile();
    return syncPremiumProfile(profile);
  } catch (error) {
    logger.error("Error checking subscription status:", error);
    useSettingsStore.getState().setIsPremium(false);
    return false;
  }
};

const handlePurchaseCompleted = (purchaseResult: AdaptyPurchaseResult) => {
  if (purchaseResult.type === "success") {
    syncPremiumProfile(purchaseResult.profile);
  }
  return false;
};

const handleRestoreCompleted = (profile: AdaptyProfile) => {
  syncPremiumProfile(profile);
  return false;
};

const handleDisappeared = () => {
  void refreshPremiumStatus();
  return false;
};

const presentFlow = async (placementId: string, includeOnboardingHandlers: boolean) => {
  const flow = await adapty.getFlow(placementId);
  const view = await createFlowView(flow);

  const handlers: Parameters<typeof view.setEventHandlers>[0] = {
    onPurchaseCompleted: (purchaseResult) => handlePurchaseCompleted(purchaseResult),
    onRestoreCompleted: (profile) => handleRestoreCompleted(profile),
    onDisappeared: () => handleDisappeared(),
  };

  view.setEventHandlers(handlers);

  await view.present();

  const profile = await adapty.getProfile();
  syncPremiumProfile(profile);
  return { success: true as const, profile };
};

const presentFlowErrorResult = (error: unknown, cancelledMessage: string, failedMessage: string) => {
  const errorObj = error as { userCancelled?: boolean; message?: string };
  if (errorObj.userCancelled) {
    return { success: false as const, error: cancelledMessage };
  }
  return { success: false as const, error: errorObj.message || failedMessage };
};

export const presentPaywall = async (placementId: string = PAYWALL_PLACEMENTS.subscription) => {
  try {
    const result = await presentFlow(placementId, false);
    return result;
  } catch (error: unknown) {
    const result = presentFlowErrorResult(error, "User cancelled paywall", "Failed to present paywall");
    if (result.error === "User cancelled paywall") {
    }
    return result;
  }
};

export const presentOnboardingFlow = async () => {
  try {
    const result = await presentFlow(ONBOARDING_PLACEMENT, true);
    return result;
  } catch (error: unknown) {
    logger.error("Failed to present onboarding flow:", error);
    const result = presentFlowErrorResult(error, "User cancelled onboarding", "Failed to present onboarding");
    if (result.error === "User cancelled onboarding") {
    }
    return result;
  }
};
