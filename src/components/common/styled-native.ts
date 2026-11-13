import { styled, type TailwindComponent } from "@tamagui/tailwind";
import type { ComponentProps, ComponentType } from "react";

/**
 * `styled()` from `@tamagui/tailwind` for a third-party React Native component.
 * Its typings only accept Tamagui components, but at runtime Tamagui wraps any
 * component and resolves the class string into the `style` it receives.
 */
export function styledNative<Component extends ComponentType<any>>(component: Component, className: string) {
  return styled(component as unknown as TailwindComponent<unknown, ComponentProps<Component>>, className);
}
