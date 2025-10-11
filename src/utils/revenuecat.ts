import { Platform } from "react-native";
import Purchases, { type CustomerInfo, type PurchasesOffering, type PurchasesPackage } from "react-native-purchases";
import PurchasesUI from "react-native-purchases-ui";

import { logger } from "./logger";

const apiKey =
  Platform.select({
    ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY || "",
    android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY || "",
  }) || "";

export const initializeRevenueCat = () => {
  Purchases.setLogLevel(__DEV__ ? Purchases.LOG_LEVEL.DEBUG : Purchases.LOG_LEVEL.ERROR);

  Purchases.configure({
    apiKey,
    appUserID: null,
  });
};

// Get available offerings
export const getOfferings = async (): Promise<PurchasesOffering | null> => {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  } catch (error) {
    logger.error("Error getting offerings:", error);
    return null;
  }
};

// Purchase a package
export const purchasePackage = async (packageToPurchase: PurchasesPackage) => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
    return { success: true, customerInfo };
  } catch (error: unknown) {
    const errorObj = error as { userCancelled?: boolean; message?: string };
    if (errorObj.userCancelled) {
      return { success: false, error: "User cancelled purchase" };
    }
    return { success: false, error: errorObj.message || "Purchase failed" };
  }
};

// Restore purchases
export const restorePurchases = async (): Promise<{
  success: boolean;
  customerInfo?: CustomerInfo;
  error?: string;
}> => {
  try {
    const customerInfo = await Purchases.restorePurchases();
    return { success: true, customerInfo };
  } catch (error: unknown) {
    const errorObj = error as { message?: string };
    return { success: false, error: errorObj.message || "Restore failed" };
  }
};

// Get customer info
export const getCustomerInfo = async (): Promise<CustomerInfo | null> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo;
  } catch (error) {
    logger.error("Error getting customer info:", error);
    return null;
  }
};

// Check if user has active subscription
export const checkActiveSubscription = async (): Promise<boolean> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return Object.keys(customerInfo.entitlements.active).length > 0;
  } catch (error) {
    logger.error("Error checking subscription status:", error);
    return false;
  }
};

// Present RevenueCat paywall
export const presentPaywall = async (): Promise<{
  success: boolean;
  customerInfo?: CustomerInfo;
  error?: string;
}> => {
  try {
    const offerings = await Purchases.getOfferings();
    if (!offerings.current) {
      return { success: false, error: "No offerings available" };
    }

    // Use PurchasesUI to present the paywall
    // This will show the paywall configured in the RevenueCat dashboard
    await PurchasesUI.presentPaywall();

    // Get updated customer info after potential purchase
    const customerInfo = await Purchases.getCustomerInfo();
    return { success: true, customerInfo };
  } catch (error: unknown) {
    const errorObj = error as { userCancelled?: boolean; message?: string };
    if (errorObj.userCancelled) {
      return { success: false, error: "User cancelled paywall" };
    }
    return { success: false, error: errorObj.message || "Failed to present paywall" };
  }
};
