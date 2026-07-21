jest.mock("react-native-adapty", () => ({
  adapty: {
    activate: jest.fn().mockResolvedValue(undefined),
    addEventListener: jest.fn(),
    getFlow: jest.fn(),
    getProfile: jest.fn().mockResolvedValue({ accessLevels: {} }),
    restorePurchases: jest.fn(),
  },
  createFlowView: jest.fn(),
}));

jest.mock("@/utils/logger", () => ({
  logger: {
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("@/stores/settings", () => ({
  useSettingsStore: {
    getState: jest.fn(() => ({ setIsPremium: jest.fn() })),
  },
}));

describe("initializeAdapty", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    delete process.env.EXPO_PUBLIC_ADAPTY_API_KEY;
  });

  it("skips activation when the API key is missing", async () => {
    const { adapty } = require("react-native-adapty");
    const { logger } = require("@/utils/logger");
    const { initializeAdapty } = require("./adapty");

    await initializeAdapty();

    expect(adapty.activate).not.toHaveBeenCalled();
    expect(logger.warn).toHaveBeenCalledWith(
      "Skipping Adapty initialization because EXPO_PUBLIC_ADAPTY_API_KEY is missing.",
    );
  });

  it("activates Adapty when the API key is configured", async () => {
    process.env.EXPO_PUBLIC_ADAPTY_API_KEY = "adapty_test";

    const { adapty } = require("react-native-adapty");
    const { initializeAdapty } = require("./adapty");

    await initializeAdapty();

    expect(adapty.activate).toHaveBeenCalledWith("adapty_test", { __ignoreActivationOnFastRefresh: true });
  });
});
