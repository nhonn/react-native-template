jest.mock("vexo-analytics", () => ({
  customEvent: jest.fn(),
  disableTracking: jest.fn(() => Promise.resolve()),
  enableTracking: jest.fn(() => Promise.resolve()),
  identifyDevice: jest.fn(() => Promise.resolve()),
  vexo: jest.fn(),
}));

jest.mock("../logger", () => ({
  logger: {
    error: jest.fn(),
    log: jest.fn(),
  },
}));

describe("analytics", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    delete process.env.EXPO_PUBLIC_VEXO_API_KEY;
    process.env.EXPO_PUBLIC_ENVIRONMENT = "development";
  });

  it("does not initialize tracking without api key", () => {
    const { customEvent, vexo } = require("vexo-analytics");
    const { initAnalytics, trackEvent } = require("../analytics");

    initAnalytics();
    trackEvent("test_event", { source: "test" });

    expect(vexo).not.toHaveBeenCalled();
    expect(customEvent).not.toHaveBeenCalled();
  });

  it("initializes Vexo and tracks events with key", () => {
    process.env.EXPO_PUBLIC_VEXO_API_KEY = "test-key";

    const { customEvent, vexo } = require("vexo-analytics");
    const { initAnalytics, trackEvent } = require("../analytics");

    initAnalytics();
    trackEvent("cta_clicked", { location: "home" });

    expect(vexo).toHaveBeenCalledWith("test-key");
    expect(customEvent).toHaveBeenCalledWith("cta_clicked", { location: "home" });
  });

  it("maps trackError to exception event", () => {
    process.env.EXPO_PUBLIC_VEXO_API_KEY = "test-key";

    const { customEvent } = require("vexo-analytics");
    const { initAnalytics, trackError } = require("../analytics");
    const error = new Error("boom");

    initAnalytics();
    trackError({
      context: { screen: "settings" },
      error,
      level: "warning",
      tags: { feature: "analytics" },
    });

    expect(customEvent).toHaveBeenCalledWith(
      "$exception",
      expect.objectContaining({
        $exception_personURL: "boom",
        $exception_type: "Error",
        feature: "analytics",
        level: "warning",
        screen: "settings",
      }),
    );
  });

  it("supports identify, reset, and tracking toggles", async () => {
    process.env.EXPO_PUBLIC_VEXO_API_KEY = "test-key";

    const { disableTracking, enableTracking, identifyDevice } = require("vexo-analytics");
    const { identifyUser, initAnalytics, resetUser, setTrackingEnabled } = require("../analytics");

    initAnalytics();
    await identifyUser("user-123");
    await resetUser();
    await setTrackingEnabled(true);
    await setTrackingEnabled(false);

    expect(identifyDevice).toHaveBeenNthCalledWith(1, "user-123");
    expect(identifyDevice).toHaveBeenNthCalledWith(2, null);
    expect(enableTracking).toHaveBeenCalledTimes(1);
    expect(disableTracking).toHaveBeenCalledTimes(1);
  });
});
