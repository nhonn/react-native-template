import type { ComponentProps } from "react";
import { createNanoIconSet } from "react-native-nano-icons";

import glyphMap from "../../../assets/icons/nanoicons/ui.glyphmap.json";

const NanoIcon = createNanoIconSet(glyphMap);

export type IconName = keyof typeof glyphMap.i;

export type IconProps = Omit<ComponentProps<typeof NanoIcon>, "name"> & {
  name: IconName;
};

/**
 * Typed wrapper around the generated `ui` icon set. Names come from the SVGs
 * in `assets/icons/ui`; the font is produced by the nano-icons config plugin
 * (or `npx react-native-nano-icons` for JS-only checks).
 */
export function Icon({ name, ...props }: IconProps) {
  return <NanoIcon name={name} {...props} />;
}
