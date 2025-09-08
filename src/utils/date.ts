import type { Locale } from "date-fns";
import { format as formatDateFns } from "date-fns";
import { enUS, vi } from "date-fns/locale";

import { getI18nInstance } from "@/i18n";
import { logger } from "@/utils/logger";

// Supported locales
const LOCALES: Record<string, Locale> = {
  en: enUS,
  vi,
};

// Common date formats
export const DateFormats = {
  SHORT: "MM/dd/yyyy",
  MEDIUM: "MMMM d, yyyy",
  LONG: "EEEE, MMMM d, yyyy",
  TIME: "h:mm a",
  DATETIME: "MMMM d, yyyy, h:mm a",
  ISO: "yyyy-MM-dd",
  RELATIVE_SHORT: "MMM d",
} as const;

export type DateFormat = (typeof DateFormats)[keyof typeof DateFormats];

// User date format preferences
const USER_FORMATS: Record<string, string> = {
  "DD/MM/YYYY": "dd/MM/yyyy",
  "MM/DD/YYYY": "MM/dd/yyyy",
  "YYYY/MM/DD": "yyyy/MM/dd",
};

// Helper functions
const isValidDate = (date: Date): boolean => {
  return date instanceof Date && !Number.isNaN(date.getTime());
};

const getLocale = (lang?: string): Locale => {
  const language = lang || getI18nInstance().language || "en";
  return LOCALES[language] || enUS;
};

const getUserDateFormat = (): string => {
  // TODO: Get from user settings store when available
  return "DD/MM/YYYY";
};

const getUserDateFnsFormat = (userFormat?: string): string => {
  const userFormatString = userFormat || getUserDateFormat();
  return USER_FORMATS[userFormatString] || USER_FORMATS["DD/MM/YYYY"];
};

// Core formatting function
export const formatDate = (timestamp: Date | number, dateFormat?: string, lang?: string): string => {
  try {
    const date = typeof timestamp === "number" ? new Date(timestamp) : timestamp;
    if (!isValidDate(date)) {
      return "";
    }

    const formatString = dateFormat || DateFormats.MEDIUM;
    const locale = getLocale(lang);

    return formatDateFns(date, formatString, { locale });
  } catch (error) {
    logger.error("Error formatting date:", error);
    return "";
  }
};

// Format with user's preferred date format
export const formatDateWithUserPreference = (
  timestamp: Date | number,
  userDateFormat?: string,
  lang?: string,
): string => {
  try {
    const date = typeof timestamp === "number" ? new Date(timestamp) : timestamp;
    if (!isValidDate(date)) {
      return "";
    }

    const formatString = getUserDateFnsFormat(userDateFormat);
    const locale = getLocale(lang);

    return formatDateFns(date, formatString, { locale });
  } catch (error) {
    logger.error("Error formatting date with user preference:", error);
    return "";
  }
};

// Format relative dates (today, yesterday, etc.)
export const formatRelativeDate = (timestamp: Date | number, t?: (key: string) => string, lang?: string): string => {
  try {
    const date = typeof timestamp === "number" ? new Date(timestamp) : timestamp;
    if (!isValidDate(date)) {
      return "";
    }

    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    const translate = t || getI18nInstance().t.bind(getI18nInstance());

    if (diffInDays === 0) {
      return formatDate(date, DateFormats.TIME, lang);
    }
    if (diffInDays === 1) {
      return translate("history:yesterday");
    }
    if (diffInDays < 7) {
      return formatDate(date, "EEEE", lang);
    }
    if (diffInDays < 365) {
      return formatDate(date, DateFormats.RELATIVE_SHORT, lang);
    }
    return formatDate(date, DateFormats.MEDIUM, lang);
  } catch (error) {
    logger.error("Error formatting relative date:", error);
    return "";
  }
};

// Parse date string safely
export const parseDateSafely = (dateString: string): Date | null => {
  try {
    if (!dateString || typeof dateString !== "string") {
      return null;
    }
    const date = new Date(dateString);
    return isValidDate(date) ? date : null;
  } catch {
    return null;
  }
};

// Format date range
export const formatDateRange = (
  startDate: Date | number,
  endDate: Date | number,
  t?: (key: string) => string,
  lang?: string,
): string => {
  try {
    const start = typeof startDate === "number" ? new Date(startDate) : startDate;
    const end = typeof endDate === "number" ? new Date(endDate) : endDate;

    if (!isValidDate(start)) {
      return "";
    }
    if (!isValidDate(end)) {
      return "";
    }

    const startFormatted = formatDate(start, DateFormats.MEDIUM, lang);
    const endFormatted = formatDate(end, DateFormats.MEDIUM, lang);
    const translate = t || getI18nInstance().t.bind(getI18nInstance());
    const separator = translate("date:range_separator") || " - ";

    return `${startFormatted}${separator}${endFormatted}`;
  } catch (error) {
    logger.error("Error formatting date range:", error);
    return "";
  }
};

// Convenient date formatters
export const dateFormatters = {
  short: (date: Date | number, lang?: string) => formatDate(date, DateFormats.SHORT, lang),
  medium: (date: Date | number, lang?: string) => formatDate(date, DateFormats.MEDIUM, lang),
  long: (date: Date | number, lang?: string) => formatDate(date, DateFormats.LONG, lang),
  time: (date: Date | number, lang?: string) => formatDate(date, DateFormats.TIME, lang),
  datetime: (date: Date | number, lang?: string) => formatDate(date, DateFormats.DATETIME, lang),
  iso: (date: Date | number, lang?: string) => formatDate(date, DateFormats.ISO, lang),
  relative: formatRelativeDate,
} as const;
