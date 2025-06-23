import type { Languages } from '@/i18n';
import i18n from '@/i18n';
import { format, Locale } from 'date-fns';

// Import all supported locales
import { enUS } from 'date-fns/locale/en-US';
import { vi } from 'date-fns/locale/vi';

// Define supported languages - using the same type as i18n system
export type SupportedLanguage = Languages;

/**
 * Map language codes to date-fns locale objects
 */
const localeMap: Record<SupportedLanguage, Locale> = {
  en: enUS,
  vi,
};

/**
 * Common date format presets
 */
export const DateFormats = {
  /** 05/02/2025 */
  SHORT: 'MM/dd/yyyy',
  /** May 2, 2025 */
  MEDIUM: 'MMMM d, yyyy',
  /** Friday, May 2, 2025 */
  LONG: 'EEEE, MMMM d, yyyy',
  /** 10:31 AM */
  TIME: 'h:mm a',
  /** May 2, 2025, 10:31 AM */
  DATETIME: 'MMMM d, yyyy, h:mm a',
  /** 05/02/2025 10:31 AM */
  SHORT_DATETIME: 'MM/dd/yyyy h:mm a',
};

/**
 * Format a date with internationalization support
 * @param timestamp - Date object or timestamp in milliseconds
 * @param dateFormat - Format string following date-fns format patterns or a preset from DateFormats
 * @param language - Language code (defaults to current app language)
 * @returns Formatted date string in the specified language
 *
 * @example
 * // Returns "May 2, 2025" in English
 * formatDate(new Date(2025, 4, 2), 'MMMM d, yyyy', 'en')
 *
 * @example
 * // Returns "02/05/2025" in Vietnamese
 * formatDate(new Date(2025, 4, 2), DateFormats.SHORT, 'vi')
 *
 * @example
 * // Returns date in current app language
 * formatDate(new Date(2025, 4, 2), DateFormats.MEDIUM)
 */
export const formatDate = (
  timestamp: Date | number,
  dateFormat: string = DateFormats.MEDIUM,
  language?: SupportedLanguage,
): string => {
  try {
    // Convert timestamp to Date object if it's a number
    const date =
      typeof timestamp === 'number' ? new Date(timestamp) : timestamp;

    // If no language is specified, use the current app language
    const currentLanguage =
      language || (i18n.language as SupportedLanguage) || 'en';

    // Get the locale from the map, fallback to English if not found
    const locale = localeMap[currentLanguage] || localeMap.en;

    // Format the date with the specified format and locale
    return format(date, dateFormat, {locale});
  } catch (error) {
    console.error('Error formatting date:', error);
    return ''; // Return empty string on error
  }
};
