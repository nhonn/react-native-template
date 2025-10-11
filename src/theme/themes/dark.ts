/**
 * Dark Theme Definition
 * Color scheme for dark mode
 */

import { Colors } from "../constants/colors";
import { Opacity } from "../constants/opacity";
import type { ColorScheme } from "../types";

export const darkColorScheme: ColorScheme = {
  background: {
    primary: Colors.gray[950],
    secondary: Colors.gray[900],
    tertiary: Colors.gray[800],
    inverse: Colors.gray[50],
  },
  surface: {
    primary: Colors.gray[900],
    secondary: Colors.gray[800],
    tertiary: Colors.gray[700],
    elevated: Colors.gray[800],
    overlay: `${Colors.black}${Math.round(Opacity[70] * 255)
      .toString(16)
      .padStart(2, "0")}`,
  },
  text: {
    primary: Colors.gray[50],
    secondary: Colors.gray[300],
    tertiary: Colors.gray[400],
    inverse: Colors.gray[950],
    disabled: Colors.gray[600],
    placeholder: Colors.gray[500],
  },
  border: {
    primary: Colors.gray[700],
    secondary: Colors.gray[600],
    focus: Colors.primary[400],
    error: Colors.error[400],
    success: Colors.success[400],
    warning: Colors.warning[400],
  },
  interactive: {
    primary: Colors.primary[500],
    primaryHover: Colors.primary[400],
    primaryPressed: Colors.primary[300],
    secondary: Colors.gray[800],
    secondaryHover: Colors.gray[700],
    secondaryPressed: Colors.gray[600],
    disabled: Colors.gray[800],
  },
  semantic: {
    success: Colors.success[400],
    successBackground: Colors.success[950],
    successBorder: Colors.success[800],
    error: Colors.error[400],
    errorBackground: Colors.error[950],
    errorBorder: Colors.error[800],
    warning: Colors.warning[400],
    warningBackground: Colors.warning[950],
    warningBorder: Colors.warning[800],
    info: Colors.info[400],
    infoBackground: Colors.info[950],
    infoBorder: Colors.info[800],
  },
  status: {
    online: Colors.success[400],
    offline: Colors.gray[600],
    away: Colors.warning[400],
    busy: Colors.error[400],
  },
};
