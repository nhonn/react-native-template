# Agent instructions

## UI

Use **HeroUI Native** (`heroui-native`) as the default UI library for new screens and components.

- Import from granular entry points (`heroui-native/button`, `heroui-native/text`, `heroui-native/input`, …). Do not import the full `heroui-native` barrel unless you already depend on most of the library.
- Do not recreate buttons, inputs, typography, avatars, badges, cards, checkboxes, dividers, loaders, modals, progress, sheets, switches, or toasts locally. Those live in HeroUI.
- Keep `@/components/common/pressable` for custom press targets. HeroUI `PressableFeedback` is for HeroUI-styled press surfaces.
- App-specific pieces that stay local: layouts, `error-boundary`, `legend-list`, `SafeAreaView`.
- Wrap new trees under the existing `HeroUINativeProvider` in `MainProvider`. Do not add a second provider.
