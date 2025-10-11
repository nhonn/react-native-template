/**
 * Light Theme Definition
 * Color scheme for light mode
 */

import { Colors } from "../constants/colors";
import { Opacity } from "../constants/opacity";
import type { ColorScheme } from "../types";

export const lightColorScheme: ColorScheme = {
  background: {
    primary: Colors.white,
    secondary: Colors.gray[50],
    tertiary: Colors.gray[100],
    inverse: Colors.gray[900],
  },
  surface: {
    primary: Colors.white,
    secondary: Colors.gray[50],
    tertiary: Colors.gray[100],
    elevated: Colors.white,
    overlay: `${Colors.black}${Math.round(Opacity[50] * 255)
      .toString(16)
      .padStart(2, "0")}`,
  },
  text: {
    primary: Colors.gray[900],
    secondary: Colors.gray[700],
    tertiary: Colors.gray[500],
    inverse: Colors.white,
    disabled: Colors.gray[400],
    placeholder: Colors.gray[400],
  },
  border: {
    primary: Colors.gray[200],
    secondary: Colors.gray[300],
    focus: Colors.primary[500],
    error: Colors.error[500],
    success: Colors.success[500],
    warning: Colors.warning[500],
  },
  interactive: {
    primary: Colors.primary[500],
    primaryHover: Colors.primary[600],
    primaryPressed: Colors.primary[700],
    secondary: Colors.gray[100],
    secondaryHover: Colors.gray[200],
    secondaryPressed: Colors.gray[300],
    disabled: Colors.gray[100],
  },
  semantic: {
    success: Colors.success[600],
    successBackground: Colors.success[50],
    successBorder: Colors.success[200],
    error: Colors.error[600],
    errorBackground: Colors.error[50],
    errorBorder: Colors.error[200],
    warning: Colors.warning[600],
    warningBackground: Colors.warning[50],
    warningBorder: Colors.warning[200],
    info: Colors.info[600],
    infoBackground: Colors.info[50],
    infoBorder: Colors.info[200],
  },
  status: {
    online: Colors.success[500],
    offline: Colors.gray[400],
    away: Colors.warning[500],
    busy: Colors.error[500],
  },
};
