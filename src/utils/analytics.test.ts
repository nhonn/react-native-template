const mockLogEvent = jest.fn().mockResolvedValue(undefined);
const mockLogScreenView = jest.fn().mockResolvedValue(undefined);
const mockGetAnalytics = jest.fn(() => ({}));
const mockLoggerError = jest.fn();

jest.mock("@react-native-firebase/analytics", () => ({
  __esModule: true,
  getAnalytics: mockGetAnalytics,
  logEvent: mockLogEvent,
  logScreenView: mockLogScreenView,
}));

jest.mock("./logger", () => ({
  logger: {
    error: mockLoggerError,
  },
}));

const analytics = require("./analytics") as typeof import("./analytics");

describe("analytics", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sends primitive event properties to Firebase Analytics", async () => {
    analytics.trackEvent("test_event", {
      amount: 42,
      flag: true,
      ignored: { nested: true },
      label: "test",
      nullable: null,
    });

    await Promise.resolve();

    expect(mockGetAnalytics).toHaveBeenCalledTimes(2);
    expect(mockLogEvent).toHaveBeenCalledWith(expect.anything(), "test_event", {
      amount: 42,
      flag: true,
      label: "test",
    });
  });

  it("tracks screen views with name, class, and primitive properties", async () => {
    analytics.trackScreenView("settings/profile", {
      source: "navigation",
      version: 2,
      invalid: ["drop"],
    });

    await Promise.resolve();

    expect(mockLogScreenView).toHaveBeenCalledWith(expect.anything(), {
      screen_class: "settings/profile",
      screen_name: "settings/profile",
      source: "navigation",
      version: 2,
    });
  });

  it("derives screen names from route segments by stripping route groups", () => {
    expect(analytics.getScreenNameFromSegments(["(tabs)", "index"])).toBe("index");
    expect(analytics.getScreenNameFromSegments(["(tabs)", "tab2"])).toBe("tab2");
    expect(analytics.getScreenNameFromSegments(["(tabs)", "settings", "profile"])).toBe("settings/profile");
  });
});
