jest.mock("expo-splash-screen", () => ({
  preventAutoHideAsync: jest.fn(),
}));

jest.mock("@/utils/logger", () => ({
  logger: {
    warn: jest.fn(),
  },
}));

import { preventAutoHideAsync } from "expo-splash-screen";

describe("initializeSplashScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("swallows preventAutoHideAsync failures and logs a warning", async () => {
    const { logger } = require("@/utils/logger");
    (preventAutoHideAsync as jest.Mock).mockRejectedValueOnce(new Error("boom"));

    const { initializeSplashScreen } = require("./splashScreen");

    await initializeSplashScreen();

    expect(logger.warn).toHaveBeenCalledWith("Failed to prevent splash screen auto-hide:", expect.any(Error));
  });

  it("resolves when preventAutoHideAsync succeeds", async () => {
    const { logger } = require("@/utils/logger");
    (preventAutoHideAsync as jest.Mock).mockResolvedValueOnce(undefined);

    const { initializeSplashScreen } = require("./splashScreen");

    await initializeSplashScreen();

    expect(preventAutoHideAsync).toHaveBeenCalledTimes(1);
    expect(logger.warn).not.toHaveBeenCalled();
  });
});
