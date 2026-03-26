const mockConsole = {
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  group: jest.fn(),
  groupEnd: jest.fn(),
  table: jest.fn(),
  time: jest.fn(),
  timeEnd: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  jest.restoreAllMocks();
});

jest.spyOn(console, "log").mockImplementation(mockConsole.log);
jest.spyOn(console, "info").mockImplementation(mockConsole.info);
jest.spyOn(console, "warn").mockImplementation(mockConsole.warn);
jest.spyOn(console, "error").mockImplementation(mockConsole.error);
jest.spyOn(console, "group").mockImplementation(mockConsole.group);
jest.spyOn(console, "groupEnd").mockImplementation(mockConsole.groupEnd);
jest.spyOn(console, "table").mockImplementation(mockConsole.table);
jest.spyOn(console, "time").mockImplementation(mockConsole.time);
jest.spyOn(console, "timeEnd").mockImplementation(mockConsole.timeEnd);

import { logger } from "../logger";

describe("Logger", () => {
  describe("logger instance exists", () => {
    test("logger is exported and has required methods", () => {
      expect(logger).toBeDefined();
      expect(typeof logger.debug).toBe("function");
      expect(typeof logger.info).toBe("function");
      expect(typeof logger.warn).toBe("function");
      expect(typeof logger.error).toBe("function");
      expect(typeof logger.log).toBe("function");
    });
  });

  describe("debug method", () => {
    test("debug logs message with DEBUG prefix", () => {
      logger.debug("debug message");
      expect(mockConsole.log).toHaveBeenCalled();
      const call = mockConsole.log.mock.calls[0][0];
      expect(call).toContain("DEBUG:");
      expect(call).toContain("debug message");
    });

    test("debug includes extra arguments", () => {
      logger.debug("message", { extra: "data" }, 123);
      expect(mockConsole.log).toHaveBeenCalled();
      const call = mockConsole.log.mock.calls[0];
      expect(call[0]).toContain("DEBUG:");
      expect(call[0]).toContain("message");
      expect(call[1]).toEqual({ extra: "data" });
      expect(call[2]).toBe(123);
    });
  });

  describe("info method", () => {
    test("info logs message with INFO prefix", () => {
      logger.info("info message");
      expect(mockConsole.info).toHaveBeenCalled();
      const call = mockConsole.info.mock.calls[0][0];
      expect(call).toContain("INFO:");
      expect(call).toContain("info message");
    });
  });

  describe("warn method", () => {
    test("warn logs message with WARN prefix", () => {
      logger.warn("warn message");
      expect(mockConsole.warn).toHaveBeenCalled();
      const call = mockConsole.warn.mock.calls[0][0];
      expect(call).toContain("WARN:");
      expect(call).toContain("warn message");
    });
  });

  describe("error method", () => {
    test("error logs message with ERROR prefix", () => {
      logger.error("error message");
      expect(mockConsole.error).toHaveBeenCalled();
      const call = mockConsole.error.mock.calls[0][0];
      expect(call).toContain("ERROR:");
      expect(call).toContain("error message");
    });
  });

  describe("log method", () => {
    test("log logs without level prefix", () => {
      logger.log("raw message");
      expect(mockConsole.log).toHaveBeenCalledWith("raw message");
    });
  });

  describe("group methods", () => {
    test("group creates console group", () => {
      logger.group("Group Label");
      expect(mockConsole.group).toHaveBeenCalledWith("Group Label");
    });

    test("groupEnd ends console group", () => {
      logger.groupEnd();
      expect(mockConsole.groupEnd).toHaveBeenCalled();
    });
  });

  describe("table method", () => {
    test("table logs table data", () => {
      const data = [{ a: 1 }, { b: 2 }];
      logger.table(data);
      expect(mockConsole.table).toHaveBeenCalledWith(data);
    });
  });

  describe("time methods", () => {
    test("time starts timer", () => {
      logger.time("timer");
      expect(mockConsole.time).toHaveBeenCalledWith("timer");
    });

    test("timeEnd ends timer", () => {
      logger.timeEnd("timer");
      expect(mockConsole.timeEnd).toHaveBeenCalledWith("timer");
    });
  });

  describe("scope method", () => {
    test("scope creates logger with prefix", () => {
      const scopedLogger = logger.scope("ComponentName");
      scopedLogger.info("scoped message");
      expect(mockConsole.info).toHaveBeenCalled();
      const call = mockConsole.info.mock.calls[0][0];
      expect(call).toContain("ComponentName");
      expect(call).toContain("INFO:");
      expect(call).toContain("scoped message");
    });

    test("nested scopes concatenate prefixes", () => {
      const scopedLogger = logger.scope("Parent").scope("Child");
      scopedLogger.info("nested");
      expect(mockConsole.info).toHaveBeenCalled();
      const call = mockConsole.info.mock.calls[0][0];
      expect(call).toContain("Parent:Child");
      expect(call).toContain("INFO:");
    });
  });

  describe("configure method", () => {
    test("configure updates logger prefix", () => {
      logger.configure({ prefix: "NewPrefix" });
      logger.info("test");
      expect(mockConsole.info).toHaveBeenCalled();
      const call = mockConsole.info.mock.calls[0][0];
      expect(call).toContain("NewPrefix");
      expect(call).toContain("INFO:");
    });
  });

  describe("destructured convenience methods", () => {
    test("exports work when destructured", () => {
      const { log, debug, info, warn, error } = logger;
      expect(log).toBeDefined();
      expect(debug).toBeDefined();
      expect(info).toBeDefined();
      expect(warn).toBeDefined();
      expect(error).toBeDefined();
    });
  });
});
