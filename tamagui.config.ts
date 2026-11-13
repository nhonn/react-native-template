import { defaultConfig } from "@tamagui/config/v6";
import { createTamagui } from "tamagui";

import { BorderRadius } from "./src/theme/constants/borderRadius";
import { Colors } from "./src/theme/constants/colors";
import { Spacing } from "./src/theme/constants/spacing";
import { darkColorScheme } from "./src/theme/themes/dark";
import { lightColorScheme } from "./src/theme/themes/light";

const kebab = (key: string) => key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);

/** Flattens a nested object into kebab-case keys joined by "-": `{ text: { primaryHover } }` -> `text-primary-hover`. */
const flatten = (source: object, prefix = ""): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(source)) {
    const name = prefix ? `${prefix}-${kebab(key)}` : kebab(key);
    if (typeof value === "string") {
      out[name] = value;
    } else {
      Object.assign(out, flatten(value, name));
    }
  }
  return out;
};

const space = { ...Spacing };
// "none" is a reserved CSS keyword Tamagui rejects as a token name; `rounded-none` resolves without one.
const { none: _none, ...radius } = BorderRadius;
// "transparent" is a reserved CSS keyword that always resolves literally, so it needs no token.
const { transparent: _transparent, ...palette } = Colors;
const color = flatten(palette);

// Width-like domains keep Tamagui's container scale (max-w-3xl etc.) next to the app spacing scale.
const { size: _size, space: _space, radius: _radius, color: _color, ...otherTokens } = defaultConfig.tokens;
const withAppSize = <T extends Record<string, string | number>>(domain: T) => ({
  ...domain,
  ...space,
});

export const config = createTamagui({
  ...defaultConfig,
  tokens: {
    ...otherTokens,
    space,
    size: space,
    width: withAppSize(otherTokens.width),
    minWidth: withAppSize(otherTokens.minWidth),
    maxWidth: withAppSize(otherTokens.maxWidth),
    inlineSize: withAppSize(otherTokens.inlineSize),
    minInlineSize: withAppSize(otherTokens.minInlineSize),
    maxInlineSize: withAppSize(otherTokens.maxInlineSize),
    flexBasis: withAppSize(otherTokens.flexBasis),
    radius,
    color,
  },
  themes: {
    light: flatten(lightColorScheme),
    dark: flatten(darkColorScheme),
  },
});

export type Conf = typeof config;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}

export default config;
