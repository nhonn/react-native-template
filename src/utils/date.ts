import type { Locale } from "date-fns";
import { format } from "date-fns";
import { enUS, vi } from "date-fns/locale";

import { getI18nInstance } from "@/i18n";
import { logger } from "@/utils/logger";

// Helper: map app language to date-fns locale
const languageToLocale: Record<string, Locale> = {
  en: enUS,
  vi,
};

function getDateFnsLocale(lang?: string): Locale {
  const lng = lang || getI18nInstance().language || "en";
  return languageToLocale[lng] || enUS;
}

// Map user's date format preference to date-fns format strings
const userDateFormatToDateFnsFormat: Record<string, string> = {
  "DD/MM/YYYY": "dd/MM/yyyy",
  "MM/DD/YYYY": "MM/dd/yyyy",
  "YYYY/MM/DD": "yyyy/MM/dd",
};

// Get user's preferred date format from settings
function getUserDateFormat(): string {
  try {
    // Access the settings store state directly using getState()
    return "DD/MM/YYYY";
  } catch (error) {
    logger.error("Error getting user date format:", error);
    return "DD/MM/YYYY"; // Default fallback
  }
}

// Function to format date using user's preferred format from settings
export const formatDateWithUserPreference = (
  timestamp: Date | number,
  userDateFormat: string,
  lang?: string,
): string => {
  const date = typeof timestamp === "number" ? new Date(timestamp) : timestamp;
  if (!isValidDate(date)) {
    return "";
  }

  const dformat = getUserDateFnsFormat(userDateFormat);
  const locale = getDateFnsLocale(lang);
  const cacheKey = createCacheKey(date.getTime(), dformat + (lang || ""));
  const cached = getCachedFormattedDate(cacheKey);
  if (cached !== undefined) {
    return cached;
  }

  let result: DateFormatResult;
  try {
    result = formatDateInternal(date, dformat, locale);
    if (!result.success) {
      logger.error("Date formatting error:", result.error);
      return "";
    }
  } catch (error) {
    return handleFormatError(error);
  }

  if (result.formatted) {
    setCachedFormattedDate(cacheKey, result.formatted);
    return result.formatted;
  }
  return "";
};

// Convert user's date format preference to date-fns format
function getUserDateFnsFormat(userFormat?: string): string {
  const userDateFormat = userFormat || getUserDateFormat();
  return userDateFormatToDateFnsFormat[userDateFormat] || userDateFormatToDateFnsFormat["DD/MM/YYYY"];
}

export interface DateFormatOptions {
  readonly enableCache?: boolean;
  readonly cacheSize?: number;
  readonly strictMode?: boolean;
}

export interface DateFormatResult {
  readonly success: boolean;
  readonly formatted?: string;
  readonly error?: string;
}

const dateFormatCache = new Map<string, string>();

const MAX_CACHE_SIZE = 300;

const defaultOptions: Required<DateFormatOptions> = {
  enableCache: true,
  cacheSize: MAX_CACHE_SIZE,
  strictMode: false,
} as const;

let options = defaultOptions;

export const DateFormats = {
  SHORT: "MM/dd/yyyy",
  MEDIUM: "MMMM d, yyyy",
  LONG: "EEEE, MMMM d, yyyy",
  TIME: "h:mm a",
  DATETIME: "MMMM d, yyyy, h:mm a",
  SHORT_DATETIME: "MM/dd/yyyy h:mm a",
  ISO: "yyyy-MM-dd",
  ISO_DATETIME: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
  RELATIVE_SHORT: "MMM d",
  RELATIVE_LONG: "MMMM d, yyyy",
  TIME_24H: "HH:mm",
  DATETIME_24H: "MMMM d, yyyy, HH:mm",
  // User preference formats
  USER_PREFERRED: "USER_PREFERRED", // Special marker for user preference
} as const;

export type DateFormat = (typeof DateFormats)[keyof typeof DateFormats];

const isValidDate = (date: Date): boolean => {
  return date instanceof Date && !Number.isNaN(date.getTime());
};

const createCacheKey = (timestamp: number, dateFormat: string): string => {
  return `${timestamp}-${dateFormat}`;
};

const formatDateInternal = (date: Date, dateFormat: string, locale: Locale): DateFormatResult => {
  try {
    if (!isValidDate(date)) {
      return {
        success: false,
        error: "Invalid date provided",
      };
    }
    const formatted = format(date, dateFormat, { locale });
    return {
      success: true,
      formatted,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown date formatting error",
    };
  }
};

function getCachedFormattedDate(cacheKey: string): string | undefined {
  if (options.enableCache && dateFormatCache.has(cacheKey)) {
    return dateFormatCache.get(cacheKey) || "";
  }
  return;
}

function setCachedFormattedDate(cacheKey: string, formatted: string) {
  if (!options.enableCache) {
    return;
  }
  if (dateFormatCache.size >= options.cacheSize) {
    const firstKey = dateFormatCache.keys().next().value;
    if (firstKey !== undefined) {
      dateFormatCache.delete(firstKey);
    }
  }
  dateFormatCache.set(cacheKey, formatted);
}

function handleFormatError(error: unknown): string {
  if (options.strictMode) {
    throw error;
  }
  logger.error("Error formatting date:", error);
  return "";
}

export const formatDate = (timestamp: Date | number, dateFormat?: string, lang?: string): string => {
  const date = typeof timestamp === "number" ? new Date(timestamp) : timestamp;
  if (!isValidDate(date)) {
    if (options.strictMode) {
      throw new Error("Invalid date provided");
    }
    return "";
  }

  // Use user's preferred format if no specific format is provided
  let dformat: string;
  if (dateFormat === DateFormats.USER_PREFERRED) {
    dformat = getUserDateFnsFormat();
  } else if (dateFormat) {
    dformat = dateFormat;
  } else {
    dformat = DateFormats.MEDIUM;
  }

  const locale = getDateFnsLocale(lang);
  const cacheKey = createCacheKey(date.getTime(), dformat + (lang || ""));
  const cached = getCachedFormattedDate(cacheKey);
  if (cached !== undefined) {
    return cached;
  }
  let result: DateFormatResult;
  try {
    result = formatDateInternal(date, dformat, locale);
    if (!result.success) {
      if (options.strictMode) {
        throw new Error(result.error);
      }
      logger.error("Date formatting error:", result.error);
      return "";
    }
  } catch (error) {
    return handleFormatError(error);
  }
  if (result.formatted) {
    setCachedFormattedDate(cacheKey, result.formatted);
    return result.formatted;
  }
  return "";
};

export const formatDateSafe = (timestamp: Date | number, dateFormat?: string, lang?: string): DateFormatResult => {
  try {
    const date = typeof timestamp === "number" ? new Date(timestamp) : timestamp;
    if (!isValidDate(date)) {
      return {
        success: false,
        error: "Invalid date provided",
      };
    }
    const dformat = dateFormat ?? DateFormats.MEDIUM;
    const locale = getDateFnsLocale(lang);
    return formatDateInternal(date, dformat, locale);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown date formatting error",
    };
  }
};

export const formatRelativeDate = (timestamp: Date | number, t?: (key: string) => string, lang?: string): string => {
  try {
    const date = typeof timestamp === "number" ? new Date(timestamp) : timestamp;
    const now = new Date();
    if (!isValidDate(date)) {
      return "";
    }
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    if (diffInDays === 0) {
      return formatDate(date, DateFormats.TIME, lang);
    }
    if (diffInDays === 1) {
      // Use translation for 'Yesterday'
      const translate = t || getI18nInstance().t.bind(getI18nInstance());
      return translate("history.yesterday");
    }
    if (diffInDays < 7) {
      return formatDate(date, "EEEE", lang);
    }
    if (diffInDays < 365) {
      return formatDate(date, DateFormats.RELATIVE_SHORT, lang);
    }
    return formatDate(date, DateFormats.RELATIVE_LONG, lang);
  } catch (error) {
    logger.error("Error formatting relative date:", error);
    return "";
  }
};

export const configureDateFormat = (newOptions: Partial<DateFormatOptions>): void => {
  options = { ...defaultOptions, ...newOptions };
  if (!newOptions.enableCache) {
    clearDateFormatCache();
  }
};

export const clearDateFormatCache = (): void => {
  dateFormatCache.clear();
};
export const getDateFormatCacheStats = (): {
  readonly size: number;
  readonly maxSize: number;
  readonly hitRate: number;
} => {
  const hitRate = dateFormatCache.size > 0 ? (dateFormatCache.size / options.cacheSize) * 100 : 0;
  return {
    size: dateFormatCache.size,
    maxSize: options.cacheSize,
    hitRate: Math.round(hitRate * 100) / 100,
  };
};

export const validateDateFormat = (
  dateFormat: string,
): {
  readonly isValid: boolean;
  readonly error?: string;
} => {
  try {
    const testDate = new Date(2025, 0, 1);
    format(testDate, dateFormat);
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : "Invalid date format",
    };
  }
};

export const createDateFormatter = (defaultFormat: string) => {
  return (timestamp: Date | number, customFormat?: string): string => {
    return formatDate(timestamp, customFormat || defaultFormat);
  };
};

export const dateFormatters = {
  short: createDateFormatter(DateFormats.SHORT),
  medium: createDateFormatter(DateFormats.MEDIUM),
  long: createDateFormatter(DateFormats.LONG),
  time: createDateFormatter(DateFormats.TIME),
  datetime: createDateFormatter(DateFormats.DATETIME),
  shortDatetime: createDateFormatter(DateFormats.SHORT_DATETIME),
  iso: createDateFormatter(DateFormats.ISO),
  relative: formatRelativeDate,
} as const;

export const parseDateSafely = (
  dateString: string,
): {
  readonly success: boolean;
  readonly date?: Date;
  readonly error?: string;
} => {
  try {
    if (!dateString || typeof dateString !== "string") {
      return {
        success: false,
        error: "Date string is required",
      };
    }
    const date = new Date(dateString);
    if (!isValidDate(date)) {
      return {
        success: false,
        error: "Invalid date string format",
      };
    }
    return {
      success: true,
      date,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown date parsing error",
    };
  }
};

export const getDateRangeFormatter = (
  startDate: Date | number,
  endDate: Date | number,
  t?: (key: string) => string,
  lang?: string,
): string => {
  try {
    const start = typeof startDate === "number" ? new Date(startDate) : startDate;
    const end = typeof endDate === "number" ? new Date(endDate) : endDate;
    if (!(isValidDate(start) && isValidDate(end))) {
      return "";
    }
    const startFormatted = formatDate(start, DateFormats.MEDIUM, lang);
    const endFormatted = formatDate(end, DateFormats.MEDIUM, lang);
    const translate = t || getI18nInstance().t.bind(getI18nInstance());
    const separator = translate("date.range_separator");
    return `${startFormatted}${separator}${endFormatted}`;
  } catch (error) {
    logger.error("Error formatting date range:", error);
    const start = typeof startDate === "number" ? new Date(startDate) : startDate;
    const end = typeof endDate === "number" ? new Date(endDate) : endDate;
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  }
};
