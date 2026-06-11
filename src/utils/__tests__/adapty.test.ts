jest.mock("react-native-adapty", () => ({
  adapty: {
    activate: jest.fn(),
    getPaywall: jest.fn(),
    makePurchase: jest.fn(),
    restorePurchases: jest.fn(),
    getProfile: jest.fn(),
  },
  createPaywallView: jest.fn(),
}));

jest.mock("@/utils/logger", () => ({
  logger: {
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

describe("initializeAdapty", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    delete process.env.EXPO_PUBLIC_ADAPTY_API_KEY;
  });

  it("skips activation when the API key is missing", () => {
    const { adapty } = require("react-native-adapty");
    const { logger } = require("@/utils/logger");
    const { initializeAdapty } = require("../adapty");

    initializeAdapty();

    expect(adapty.activate).not.toHaveBeenCalled();
    expect(logger.warn).toHaveBeenCalledWith(
      "Skipping Adapty initialization because EXPO_PUBLIC_ADAPTY_API_KEY is missing.",
    );
  });

  it("activates Adapty when the API key is configured", () => {
    process.env.EXPO_PUBLIC_ADAPTY_API_KEY = "adapty_test";

    const { adapty } = require("react-native-adapty");
    const { initializeAdapty } = require("../adapty");

    initializeAdapty();

    expect(adapty.activate).toHaveBeenCalledWith("adapty_test");
  });
});
