const mockSetIsPremium = jest.fn();
const mockGetState = jest.fn(() => ({ setIsPremium: mockSetIsPremium }));

jest.mock("react-native", () => ({
  Platform: { OS: "ios" },
}));

jest.mock("react-native-purchases", () => ({
  __esModule: true,
  default: {
    configure: jest.fn(),
    setLogLevel: jest.fn().mockResolvedValue(undefined),
    addCustomerInfoUpdateListener: jest.fn(),
    getCustomerInfo: jest.fn(),
    restorePurchases: jest.fn(),
    getCurrentOfferingForPlacement: jest.fn(),
    getOfferings: jest.fn(),
  },
  LOG_LEVEL: { DEBUG: "DEBUG" },
}));

jest.mock("react-native-purchases-ui", () => ({
  __esModule: true,
  default: {
    presentPaywall: jest.fn(),
  },
  PAYWALL_RESULT: {
    NOT_PRESENTED: "NOT_PRESENTED",
    ERROR: "ERROR",
    CANCELLED: "CANCELLED",
    PURCHASED: "PURCHASED",
    RESTORED: "RESTORED",
  },
}));

jest.mock("@/utils/logger", () => ({
  logger: {
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("@/stores/settings", () => ({
  useSettingsStore: {
    getState: mockGetState,
  },
}));

const premiumCustomerInfo = {
  entitlements: {
    active: {
      premium: { identifier: "premium" },
    },
  },
};

const freeCustomerInfo = {
  entitlements: {
    active: {},
  },
};

const loadModule = () => require("./revenuecat") as typeof import("./revenuecat");

describe("revenuecat", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    mockGetState.mockReturnValue({ setIsPremium: mockSetIsPremium });
    delete process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY;
    delete process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY;
    require("react-native").Platform.OS = "ios";
  });

  describe("initializeRevenueCat", () => {
    it("skips configuration when the platform API key is missing", async () => {
      const Purchases = require("react-native-purchases").default;
      const { logger } = require("@/utils/logger");
      const { initializeRevenueCat } = loadModule();

      await initializeRevenueCat();

      expect(Purchases.configure).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalledWith(
        "Skipping RevenueCat initialization because the platform API key is missing.",
      );
    });

    it("configures RevenueCat on iOS when the iOS key is set", async () => {
      process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY = "appl_test";

      const Purchases = require("react-native-purchases").default;
      Purchases.getCustomerInfo.mockResolvedValue(freeCustomerInfo);
      const { initializeRevenueCat } = loadModule();

      await initializeRevenueCat();

      expect(Purchases.setLogLevel).toHaveBeenCalledWith("DEBUG");
      expect(Purchases.configure).toHaveBeenCalledWith({ apiKey: "appl_test" });
      expect(Purchases.addCustomerInfoUpdateListener).toHaveBeenCalledTimes(1);
      expect(mockSetIsPremium).toHaveBeenCalledWith(false);
    });

    it("configures RevenueCat on Android when the Android key is set", async () => {
      require("react-native").Platform.OS = "android";
      process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY = "goog_test";

      const Purchases = require("react-native-purchases").default;
      Purchases.getCustomerInfo.mockResolvedValue(premiumCustomerInfo);
      const { initializeRevenueCat } = loadModule();

      await initializeRevenueCat();

      expect(Purchases.configure).toHaveBeenCalledWith({ apiKey: "goog_test" });
      expect(mockSetIsPremium).toHaveBeenCalledWith(true);
    });

    it("does not configure twice in the same module lifetime", async () => {
      process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY = "appl_test";

      const Purchases = require("react-native-purchases").default;
      Purchases.getCustomerInfo.mockResolvedValue(freeCustomerInfo);
      const { initializeRevenueCat } = loadModule();

      await initializeRevenueCat();
      await initializeRevenueCat();

      expect(Purchases.configure).toHaveBeenCalledTimes(1);
      expect(Purchases.getCustomerInfo).toHaveBeenCalledTimes(2);
    });

    it("syncs premium when the customer-info listener fires", async () => {
      process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY = "appl_test";

      const Purchases = require("react-native-purchases").default;
      Purchases.getCustomerInfo.mockResolvedValue(freeCustomerInfo);
      const { initializeRevenueCat } = loadModule();

      await initializeRevenueCat();

      const listener = Purchases.addCustomerInfoUpdateListener.mock.calls[0][0];
      listener(premiumCustomerInfo);

      expect(mockSetIsPremium).toHaveBeenLastCalledWith(true);
    });
  });

  describe("refreshPremiumStatus", () => {
    it("returns true when the premium entitlement is active", async () => {
      const Purchases = require("react-native-purchases").default;
      Purchases.getCustomerInfo.mockResolvedValue(premiumCustomerInfo);
      const { refreshPremiumStatus } = loadModule();

      await expect(refreshPremiumStatus()).resolves.toBe(true);
      expect(mockSetIsPremium).toHaveBeenCalledWith(true);
    });

    it("returns false and clears premium when customer info fails", async () => {
      const Purchases = require("react-native-purchases").default;
      const { logger } = require("@/utils/logger");
      Purchases.getCustomerInfo.mockRejectedValue(new Error("network"));
      const { refreshPremiumStatus } = loadModule();

      await expect(refreshPremiumStatus()).resolves.toBe(false);
      expect(logger.error).toHaveBeenCalledWith("Error checking subscription status:", expect.any(Error));
      expect(mockSetIsPremium).toHaveBeenCalledWith(false);
    });
  });

  describe("restorePurchases", () => {
    it("syncs premium after a successful restore", async () => {
      const Purchases = require("react-native-purchases").default;
      Purchases.restorePurchases.mockResolvedValue(premiumCustomerInfo);
      const { restorePurchases } = loadModule();

      await expect(restorePurchases()).resolves.toEqual({
        success: true,
        customerInfo: premiumCustomerInfo,
      });
      expect(mockSetIsPremium).toHaveBeenCalledWith(true);
    });

    it("returns a failure when restore throws", async () => {
      const Purchases = require("react-native-purchases").default;
      Purchases.restorePurchases.mockRejectedValue(new Error("store down"));
      const { restorePurchases } = loadModule();

      await expect(restorePurchases()).resolves.toEqual({
        success: false,
        error: "store down",
      });
    });
  });

  describe("getCustomerInfo", () => {
    it("returns customer info and syncs premium", async () => {
      const Purchases = require("react-native-purchases").default;
      Purchases.getCustomerInfo.mockResolvedValue(premiumCustomerInfo);
      const { getCustomerInfo } = loadModule();

      await expect(getCustomerInfo()).resolves.toEqual(premiumCustomerInfo);
      expect(mockSetIsPremium).toHaveBeenCalledWith(true);
    });

    it("returns null when customer info fails", async () => {
      const Purchases = require("react-native-purchases").default;
      const { logger } = require("@/utils/logger");
      Purchases.getCustomerInfo.mockRejectedValue(new Error("offline"));
      const { getCustomerInfo } = loadModule();

      await expect(getCustomerInfo()).resolves.toBeNull();
      expect(logger.error).toHaveBeenCalledWith("Error getting customer info:", expect.any(Error));
    });
  });

  describe("presentPaywall", () => {
    it("presents the placement offering and reports a purchase", async () => {
      const offering = { identifier: "settings" };
      const Purchases = require("react-native-purchases").default;
      const RevenueCatUI = require("react-native-purchases-ui").default;
      Purchases.getCurrentOfferingForPlacement.mockResolvedValue(offering);
      RevenueCatUI.presentPaywall.mockResolvedValue("PURCHASED");
      Purchases.getCustomerInfo.mockResolvedValue(premiumCustomerInfo);
      const { presentPaywall } = loadModule();

      await expect(presentPaywall()).resolves.toEqual({
        success: true,
        customerInfo: premiumCustomerInfo,
      });
      expect(Purchases.getCurrentOfferingForPlacement).toHaveBeenCalledWith("settings");
      expect(RevenueCatUI.presentPaywall).toHaveBeenCalledWith({ offering });
    });

    it("falls back to the current offering when placement is empty", async () => {
      const current = { identifier: "default" };
      const Purchases = require("react-native-purchases").default;
      const RevenueCatUI = require("react-native-purchases-ui").default;
      Purchases.getCurrentOfferingForPlacement.mockResolvedValue(null);
      Purchases.getOfferings.mockResolvedValue({ all: {}, current });
      RevenueCatUI.presentPaywall.mockResolvedValue("RESTORED");
      Purchases.getCustomerInfo.mockResolvedValue(premiumCustomerInfo);
      const { presentPaywall } = loadModule();

      await expect(presentPaywall()).resolves.toEqual({
        success: true,
        customerInfo: premiumCustomerInfo,
      });
      expect(RevenueCatUI.presentPaywall).toHaveBeenCalledWith({ offering: current });
    });

    it("returns a failure when the paywall cannot be presented", async () => {
      const Purchases = require("react-native-purchases").default;
      const RevenueCatUI = require("react-native-purchases-ui").default;
      Purchases.getCurrentOfferingForPlacement.mockResolvedValue({ identifier: "settings" });
      RevenueCatUI.presentPaywall.mockResolvedValue("ERROR");
      Purchases.getCustomerInfo.mockResolvedValue(freeCustomerInfo);
      const { presentPaywall } = loadModule();

      await expect(presentPaywall()).resolves.toEqual({
        success: false,
        error: "Failed to present paywall",
      });
    });

    it("returns cancelled when the user dismisses the paywall", async () => {
      const Purchases = require("react-native-purchases").default;
      const RevenueCatUI = require("react-native-purchases-ui").default;
      Purchases.getCurrentOfferingForPlacement.mockResolvedValue({ identifier: "settings" });
      RevenueCatUI.presentPaywall.mockResolvedValue("CANCELLED");
      Purchases.getCustomerInfo.mockResolvedValue(freeCustomerInfo);
      const { presentPaywall } = loadModule();

      await expect(presentPaywall()).resolves.toEqual({
        success: false,
        error: "User cancelled paywall",
      });
    });

    it("returns a failure when presentation throws", async () => {
      const Purchases = require("react-native-purchases").default;
      const { logger } = require("@/utils/logger");
      Purchases.getCurrentOfferingForPlacement.mockRejectedValue(new Error("no offerings"));
      const { presentPaywall } = loadModule();

      await expect(presentPaywall()).resolves.toEqual({
        success: false,
        error: "no offerings",
      });
      expect(logger.error).toHaveBeenCalledWith("Failed to present paywall", expect.any(Error));
    });
  });

  describe("presentOnboardingFlow", () => {
    it("presents the onboarding placement", async () => {
      const offering = { identifier: "onboarding_v1" };
      const Purchases = require("react-native-purchases").default;
      const RevenueCatUI = require("react-native-purchases-ui").default;
      Purchases.getCurrentOfferingForPlacement.mockResolvedValue(offering);
      RevenueCatUI.presentPaywall.mockResolvedValue("PURCHASED");
      Purchases.getCustomerInfo.mockResolvedValue(premiumCustomerInfo);
      const { presentOnboardingFlow } = loadModule();

      await presentOnboardingFlow();

      expect(Purchases.getCurrentOfferingForPlacement).toHaveBeenCalledWith("onboarding_v1");
      expect(RevenueCatUI.presentPaywall).toHaveBeenCalledWith({ offering });
    });
  });
});
