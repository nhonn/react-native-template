const createPostHogMock = () => {
  return {
    capture: jest.fn(),
    captureException: jest.fn(),
    identify: jest.fn(),
    optIn: jest.fn(),
    optOut: jest.fn(),
    reset: jest.fn(),
  };
};

const loadAnalytics = (env: { apiKey?: string; host?: string } = {}) => {
  jest.resetModules();

  if (env.apiKey === undefined) {
    delete process.env.EXPO_PUBLIC_POSTHOG_API_KEY;
  } else {
    process.env.EXPO_PUBLIC_POSTHOG_API_KEY = env.apiKey;
  }

  if (env.host === undefined) {
    delete process.env.EXPO_PUBLIC_POSTHOG_HOST;
  } else {
    process.env.EXPO_PUBLIC_POSTHOG_HOST = env.host;
  }

  const posthogClient = createPostHogMock();
  const posthogConstructor = jest.fn(() => posthogClient);

  jest.doMock("posthog-react-native", () => ({
    __esModule: true,
    default: posthogConstructor,
  }));

  const analytics = require("../analytics") as typeof import("../analytics");

  return {
    analytics,
    posthogClient,
    posthogConstructor,
  };
};

describe("analytics", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.EXPO_PUBLIC_POSTHOG_API_KEY;
    delete process.env.EXPO_PUBLIC_POSTHOG_HOST;
  });

  it("does not initialize PostHog without an API key", () => {
    const { analytics, posthogConstructor } = loadAnalytics();

    analytics.initAnalytics();
    analytics.trackEvent("test_event", { source: "test" });

    expect(posthogConstructor).not.toHaveBeenCalled();
  });

  it("initializes PostHog with the configured host and tracks events", () => {
    const { analytics, posthogClient, posthogConstructor } = loadAnalytics({
      apiKey: "phc_test",
      host: "https://us.i.posthog.com",
    });

    analytics.initAnalytics();
    analytics.trackEvent("test_event", { source: "test" });

    expect(posthogConstructor).toHaveBeenCalledWith("phc_test", {
      defaultOptIn: true,
      host: "https://us.i.posthog.com",
    });
    expect(posthogClient.capture).toHaveBeenCalledWith("test_event", { source: "test" });
  });

  it("tracks screen views with a screen_name property", () => {
    const { analytics, posthogClient } = loadAnalytics({ apiKey: "phc_test" });

    analytics.initAnalytics();
    analytics.trackScreenView("tab2", { source: "navigation" });

    expect(posthogClient.capture).toHaveBeenCalledWith("screen_view", {
      screen_name: "tab2",
      source: "navigation",
    });
  });

  it("captures error details for PostHog exception events", () => {
    const { analytics, posthogClient } = loadAnalytics({ apiKey: "phc_test" });
    const error = new Error("boom");

    analytics.initAnalytics();
    analytics.trackError({
      context: { screen: "settings" },
      error,
      level: "warning",
      tags: { feature: "analytics" },
    });

    expect(posthogClient.captureException).toHaveBeenCalledWith(
      error,
      expect.objectContaining({
        context: { screen: "settings" },
        level: "warning",
        tags: { feature: "analytics" },
      }),
    );
  });

  it("identifies users, resets them, and toggles tracking", async () => {
    const { analytics, posthogClient } = loadAnalytics({ apiKey: "phc_test" });

    analytics.initAnalytics();
    await analytics.identifyUser("user-123");
    await analytics.setTrackingEnabled(false);
    await analytics.resetUser();
    await analytics.setTrackingEnabled(true);

    expect(posthogClient.identify).toHaveBeenCalledWith("user-123");
    expect(posthogClient.optOut).toHaveBeenCalledTimes(2);
    expect(posthogClient.reset).toHaveBeenCalledTimes(1);
    expect(posthogClient.optIn).toHaveBeenCalledTimes(1);
  });

  it("derives screen names from route segments by stripping route groups", () => {
    const { analytics } = loadAnalytics({ apiKey: "phc_test" });

    expect(analytics.getScreenNameFromSegments(["(tabs)", "index"])).toBe("index");
    expect(analytics.getScreenNameFromSegments(["(stacks)", "stack1"])).toBe("stack1");
    expect(analytics.getScreenNameFromSegments(["(tabs)", "settings", "profile"])).toBe("settings/profile");
  });
});
