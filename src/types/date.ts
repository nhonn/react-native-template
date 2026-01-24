import type { Dayjs } from "dayjs";

export type ValidDateFormat = "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY/MM/DD";

// Date input types that our utilities can accept
export type DateInput = Date | number | string | Dayjs;

// Locale codes supported by the application
export type SupportedLocale = "en";

// Translation function type for date utilities
export type TranslationFunction = (key: string) => string;

// Date formatter function type
export type DateFormatterFunction = (date: DateInput, lang?: string) => string;
