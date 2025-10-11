import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";

import { getI18nInstance } from "@/i18n";
import type { DateInput, SupportedLocale, TranslationFunction } from "@/types/date";
import { logger } from "@/utils/logger";

// Initialize dayjs plugins
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

// Supported locales mapping
const LOCALE_MAP: Record<SupportedLocale, string> = {
  en: "en",
  vi: "vi",
  es: "es",
  fr: "fr",
  zh: "zh",
  ja: "ja",
  ko: "ko",
  ms: "ms",
};

// Common date formats
export const DateFormats = {
  SHORT: "MM/DD/YYYY",
  MEDIUM: "MMMM D, YYYY",
  LONG: "dddd, MMMM D, YYYY",
  TIME: "h:mm A",
  DATETIME: "MMMM D, YYYY, h:mm A",
  ISO: "YYYY-MM-DD",
  RELATIVE_SHORT: "MMM D",
} as const;

export type DateFormat = (typeof DateFormats)[keyof typeof DateFormats];

// User date format preferences
const USER_FORMATS: Record<string, string> = {
  "DD/MM/YYYY": "DD/MM/YYYY",
  "MM/DD/YYYY": "MM/DD/YYYY",
  "YYYY/MM/DD": "YYYY/MM/DD",
};

const getLocale = (lang?: string): SupportedLocale => {
  const language = lang || getI18nInstance().language || "en";
  return (LOCALE_MAP[language as SupportedLocale] ? language : "en") as SupportedLocale;
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
export const formatDate = (timestamp: DateInput, dateFormat?: string, lang?: string): string => {
  try {
    const date = dayjs(timestamp);
    if (!date.isValid()) {
      return "";
    }

    const formatString = dateFormat || DateFormats.MEDIUM;
    const locale = getLocale(lang);

    return date.locale(locale).format(formatString);
  } catch (error) {
    logger.error("Error formatting date:", error);
    return "";
  }
};

// Format with user's preferred date format
export const formatDateWithUserPreference = (timestamp: DateInput, userDateFormat?: string, lang?: string): string => {
  try {
    const date = dayjs(timestamp);
    if (!date.isValid()) {
      return "";
    }

    const formatString = getUserDateFnsFormat(userDateFormat);
    const locale = getLocale(lang);

    return date.locale(locale).format(formatString);
  } catch (error) {
    logger.error("Error formatting date with user preference:", error);
    return "";
  }
};

// Format relative dates (today, yesterday, etc.)
export const formatRelativeDate = (timestamp: DateInput, t?: TranslationFunction, lang?: string): string => {
  try {
    const date = dayjs(timestamp);
    if (!date.isValid()) {
      return "";
    }

    const now = dayjs();
    const diffInDays = now.diff(date, "day");

    const translate = t || getI18nInstance().t.bind(getI18nInstance());

    if (diffInDays === 0) {
      return formatDate(date, DateFormats.TIME, lang);
    }
    if (diffInDays === 1) {
      return translate("history:yesterday");
    }
    if (diffInDays < 7) {
      return formatDate(date, "dddd", lang);
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
export const parseDateSafely = (dateString: string): Dayjs | null => {
  try {
    if (!dateString || typeof dateString !== "string") {
      return null;
    }
    const date = dayjs(dateString);
    return date.isValid() ? date : null;
  } catch {
    return null;
  }
};

// Format date range
export const formatDateRange = (
  startDate: DateInput,
  endDate: DateInput,
  t?: TranslationFunction,
  lang?: string,
): string => {
  try {
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (!start.isValid()) {
      return "";
    }
    if (!end.isValid()) {
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
  short: (date: DateInput, lang?: string) => formatDate(date, DateFormats.SHORT, lang),
  medium: (date: DateInput, lang?: string) => formatDate(date, DateFormats.MEDIUM, lang),
  long: (date: DateInput, lang?: string) => formatDate(date, DateFormats.LONG, lang),
  time: (date: DateInput, lang?: string) => formatDate(date, DateFormats.TIME, lang),
  datetime: (date: DateInput, lang?: string) => formatDate(date, DateFormats.DATETIME, lang),
  iso: (date: DateInput, lang?: string) => formatDate(date, DateFormats.ISO, lang),
  relative: formatRelativeDate,
} as const;
