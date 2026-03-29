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
    process.env.EXPO_PUBLIC_ENVIRONMENT = "development";
  });

  it("initializes successfully", () => {
    const { logger } = require("../logger");
    const { initAnalytics } = require("../analytics");

    initAnalytics();

    expect(logger.log).toHaveBeenCalledWith("Analytics template initialized (no provider configured)");
  });

  it("trackEvent logs when not configured", () => {
    const { logger } = require("../logger");
    const { initAnalytics, trackEvent } = require("../analytics");

    initAnalytics();
    trackEvent("test_event", { source: "test" });

    expect(logger.log).toHaveBeenCalledWith("trackEvent called (analytics provider not configured):", {
      name: "test_event",
      properties: { source: "test" },
    });
  });

  it("trackError logs error details", () => {
    const { logger } = require("../logger");
    const { initAnalytics, trackError } = require("../analytics");
    const error = new Error("boom");

    initAnalytics();
    trackError({
      context: { screen: "settings" },
      error,
      level: "warning",
      tags: { feature: "analytics" },
    });

    expect(logger.log).toHaveBeenCalledWith(
      "trackError called (analytics provider not configured):",
      expect.objectContaining({
        error,
        level: "warning",
      }),
    );
  });

  it("identifyUser logs user id", async () => {
    const { logger } = require("../logger");
    const { initAnalytics, identifyUser } = require("../analytics");

    initAnalytics();
    await identifyUser("user-123");

    expect(logger.log).toHaveBeenCalledWith("identifyUser called (analytics provider not configured):", "user-123");
  });

  it("resetUser logs reset", async () => {
    const { logger } = require("../logger");
    const { initAnalytics, resetUser } = require("../analytics");

    initAnalytics();
    await resetUser();

    expect(logger.log).toHaveBeenCalledWith("resetUser called (analytics provider not configured)");
  });

  it("setTrackingEnabled logs enabled state", async () => {
    const { logger } = require("../logger");
    const { initAnalytics, setTrackingEnabled } = require("../analytics");

    initAnalytics();
    await setTrackingEnabled(true);
    await setTrackingEnabled(false);

    expect(logger.log).toHaveBeenCalledWith("setTrackingEnabled called (analytics provider not configured):", true);
    expect(logger.log).toHaveBeenCalledWith("setTrackingEnabled called (analytics provider not configured):", false);
  });
});
