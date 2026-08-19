import { BareLayout } from "./Bare";
import { BaseLayout } from "./Base";
import { ModalLayout } from "./Modal";

export const Layout = {
  Bare: BareLayout,
  Base: BaseLayout,
  Modal: ModalLayout,
} as const;
