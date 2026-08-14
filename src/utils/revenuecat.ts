import { Platform } from "react-native";
import type { CustomerInfo, PurchasesOffering } from "react-native-purchases";
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";

import { useSettingsStore } from "@/stores/settings";

import { logger } from "./logger";

export const PREMIUM_ENTITLEMENT_ID = "premium";
export const PAYWALL_PLACEMENTS = {
  limit: "settings",
  subscription: "settings",
} as const;
export const ONBOARDING_PLACEMENT = "onboarding_v1";

type PurchaseActionSuccess = { success: true; customerInfo: CustomerInfo };
type PurchaseActionFailure = { success: false; error: string };
type PurchaseActionResult = PurchaseActionSuccess | PurchaseActionFailure;

let isConfigured = false;

const getPlatformApiKey = () => {
  if (Platform.OS === "android") {
    return process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY?.trim() ?? "";
  }

  return process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY?.trim() ?? "";
};

const getErrorMessage = (error: unknown, fallback: string) => {
  const errorObj = error as { message?: string };
  return errorObj.message || fallback;
};

const syncPremium = (customerInfo: CustomerInfo) => {
  const hasPremiumAccess = Boolean(customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID]);
  useSettingsStore.getState().setIsPremium(hasPremiumAccess);
  return hasPremiumAccess;
};

const resolveOffering = async (placementId: string): Promise<PurchasesOffering | undefined> => {
  const placementOffering = await Purchases.getCurrentOfferingForPlacement(placementId);
  if (placementOffering) {
    return placementOffering;
  }

  const offerings = await Purchases.getOfferings();
  return offerings.all[placementId] ?? offerings.current ?? undefined;
};

const presentPaywallForPlacement = async (
  placementId: string,
  cancelledMessage: string,
  failedMessage: string,
): Promise<PurchaseActionResult> => {
  try {
    const offering = await resolveOffering(placementId);
    const paywallResult = offering
      ? await RevenueCatUI.presentPaywall({ offering })
      : await RevenueCatUI.presentPaywall();

    const customerInfo = await Purchases.getCustomerInfo();
    syncPremium(customerInfo);

    if (paywallResult === PAYWALL_RESULT.PURCHASED || paywallResult === PAYWALL_RESULT.RESTORED) {
      return { success: true, customerInfo };
    }

    if (paywallResult === PAYWALL_RESULT.CANCELLED) {
      return { success: false, error: cancelledMessage };
    }

    return { success: false, error: failedMessage };
  } catch (error: unknown) {
    logger.error(failedMessage, error);
    return { success: false, error: getErrorMessage(error, failedMessage) };
  }
};

export const initializeRevenueCat = async () => {
  const apiKey = getPlatformApiKey();
  if (!apiKey) {
    logger.warn("Skipping RevenueCat initialization because the platform API key is missing.");
    return;
  }

  if (!isConfigured) {
    if (__DEV__) {
      await Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }

    Purchases.configure({ apiKey });
    Purchases.addCustomerInfoUpdateListener((customerInfo) => {
      syncPremium(customerInfo);
    });
    isConfigured = true;
  }

  await refreshPremiumStatus();
};

export const restorePurchases = async (): Promise<PurchaseActionResult> => {
  try {
    const customerInfo = await Purchases.restorePurchases();
    syncPremium(customerInfo);
    return { success: true, customerInfo };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error, "Restore failed") };
  }
};

export const getCustomerInfo = async () => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    syncPremium(customerInfo);
    return customerInfo;
  } catch (error) {
    logger.error("Error getting customer info:", error);
    return null;
  }
};

export const refreshPremiumStatus = async (): Promise<boolean> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return syncPremium(customerInfo);
  } catch (error) {
    logger.error("Error checking subscription status:", error);
    useSettingsStore.getState().setIsPremium(false);
    return false;
  }
};

export const presentPaywall = async (placementId: string = PAYWALL_PLACEMENTS.subscription) => {
  return presentPaywallForPlacement(placementId, "User cancelled paywall", "Failed to present paywall");
};

export const presentOnboardingFlow = async () => {
  return presentPaywallForPlacement(ONBOARDING_PLACEMENT, "User cancelled onboarding", "Failed to present onboarding");
};
