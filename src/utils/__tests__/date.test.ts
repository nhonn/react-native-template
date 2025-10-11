/**
 * @jest-environment node
 */
import dayjs from "dayjs";
import {
  DateFormats,
  dateFormatters,
  formatDate,
  formatDateRange,
  formatDateWithUserPreference,
  formatRelativeDate,
  parseDateSafely,
} from "../date";

// Define regex at module level for performance
const TIME_REGEX = /\d{1,2}:\d{2} [AP]M/;

// Mock i18n
const mockGetI18nInstance = () => ({
  t: (key: string) => {
    const translations: Record<string, string> = {
      "history:yesterday": "Yesterday",
      "date:range_separator": " - ",
    };
    return translations[key] || key;
  },
});

// Mock the i18n module
jest.mock("@/i18n", () => ({
  getI18nInstance: () => mockGetI18nInstance(),
}));

// Mock logger
jest.mock("@/utils/logger", () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

describe("Date Utilities", () => {
  const testDate = new Date("2024-01-15T10:30:00Z");
  const testTimestamp = testDate.getTime();
  const testDayjs = dayjs(testDate);

  describe("formatDate", () => {
    test("formats date with default format", () => {
      const result = formatDate(testDate);
      expect(result).toContain("January 15, 2024");
    });

    test("formats date with custom format", () => {
      const result = formatDate(testDate, DateFormats.SHORT);
      expect(result).toContain("01/15/2024");
    });

    test("handles timestamp input", () => {
      const result = formatDate(testTimestamp);
      expect(result).toContain("January 15, 2024");
    });

    test("handles dayjs input", () => {
      const result = formatDate(testDayjs);
      expect(result).toContain("January 15, 2024");
    });

    test("handles invalid date", () => {
      const result = formatDate(new Date("invalid"));
      expect(result).toBe("");
    });
  });

  describe("formatDateWithUserPreference", () => {
    test("formats with user preference", () => {
      const result = formatDateWithUserPreference(testDate, "MM/DD/YYYY", "en");
      expect(result).toContain("01/15/2024");
    });

    test("handles different locales", () => {
      const result = formatDateWithUserPreference(testDate, "DD/MM/YYYY", "en");
      expect(result).toContain("15/01/2024");
    });
  });

  describe("formatRelativeDate", () => {
    const mockT = (key: string) => {
      const translations: Record<string, string> = {
        "history:yesterday": "Yesterday",
      };
      return translations[key] || key;
    };

    test("formats today as time", () => {
      const today = dayjs().toDate();
      const result = formatRelativeDate(today, mockT);
      expect(result).toMatch(TIME_REGEX);
    });

    test("formats yesterday", () => {
      const yesterday = dayjs().subtract(1, "day").toDate();
      const result = formatRelativeDate(yesterday, mockT);
      expect(result).toBe("Yesterday");
    });
  });

  describe("parseDateSafely", () => {
    test("parses valid date string", () => {
      const result = parseDateSafely("2024-01-15");
      expect(result).not.toBeNull();
      expect(result?.isValid()).toBe(true);
    });

    test("returns null for invalid input", () => {
      const result = parseDateSafely("invalid-date");
      expect(result).toBeNull();
    });
  });

  describe("formatDateRange", () => {
    const startDate = new Date("2024-01-15T10:00:00Z");
    const endDate = new Date("2024-01-20T15:00:00Z");

    test("formats date range", () => {
      const result = formatDateRange(startDate, endDate);
      expect(result).toContain("January 15, 2024");
      expect(result).toContain("January 20, 2024");
      expect(result).toContain(" - ");
    });
  });

  describe("dateFormatters", () => {
    test("has all required formatters", () => {
      expect(dateFormatters.short).toBeDefined();
      expect(dateFormatters.medium).toBeDefined();
      expect(dateFormatters.long).toBeDefined();
      expect(dateFormatters.time).toBeDefined();
    });

    test("formatters return strings", () => {
      expect(typeof dateFormatters.short(testDate)).toBe("string");
      expect(typeof dateFormatters.medium(testDate)).toBe("string");
      expect(typeof dateFormatters.long(testDate)).toBe("string");
      expect(typeof dateFormatters.time(testDate)).toBe("string");
    });
  });
});
