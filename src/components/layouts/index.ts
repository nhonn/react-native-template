import { BareLayout } from "./bare";
import { BaseLayout } from "./base";
import { ModalLayout } from "./modal";

export const Layout = {
  Bare: BareLayout,
  Base: BaseLayout,
  Modal: ModalLayout,
} as const;
