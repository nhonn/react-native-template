import { BareLayout } from "./Bare.js";
import { BaseLayout } from "./Base.js";
import { ModalLayout } from "./Modal.js";

export const Layout = {
  Bare: BareLayout,
  Base: BaseLayout,
  Modal: ModalLayout,
} as const;
