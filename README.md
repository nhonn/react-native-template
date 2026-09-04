# React Native Template

Modern Expo + Expo Router template with a small, production-oriented baseline: typed navigation, a custom UI kit, a theme system, i18n, and a lightweight state setup.

## Features

### Core

- **React Native**: 0.85.3 + React 19.2.3
- **Expo**: SDK 56
- **Navigation**: Expo Router 6 (tabs, stacks, modals)
- **TypeScript**: strict type checking
- **Package manager**: Bun

### Styling & Theme

- **Styling**: @expo/ui style/textStyle + React Native StyleSheet
- **Theming**: light/dark mode + system theme sync
- **Design tokens**: colors, spacing, typography, radii, shadows

### UI

- **UI**: `@expo/ui` universal components (Host, Button, Text, Column, Row, etc.)
- **Pressable**: local gesture-handler pressable kept for custom hit targets
- **Layouts**: Base/Bare/Modal layouts for screens

### State / Storage / Tooling

- **State**: Zustand with MMKV persistence
- **Forms**: React Hook Form + Valibot
- **List rendering**: LegendList v3 utility wrapper
- **Monetization**: RevenueCat utility
- **Quality**: Oxlint + Oxfmt + Lefthook
- **Testing**: Jest + React Native Testing Library (Expo preset)

## Project Structure

```
src/
├── app/                # Expo Router screens
├── components/         # Common, layouts
├── hooks/              # App-level hooks (debounce/throttle/etc.)
├── i18n/               # i18next setup + locales (en)
├── providers/          # Top-level providers (ErrorBoundary, etc.)
├── stores/             # App stores (settings, etc.)
├── theme/              # Theme system (tokens, hooks, store)
├── types/              # Shared TS types
└── utils/              # Utilities (storage, logger, date, etc.)
```

## Getting Started

```bash
bun install
bun start
```

Run native:

```bash
bun run ios
bun run android
```

### App variants

Development and production installs can sit side by side. `app.json` holds the production identity; `app.config.ts` suffixes it when `APP_VARIANT` is not `production`.

| Variant       | `APP_VARIANT`          | Name                        | Bundle ID / package             |
| ------------- | ---------------------- | --------------------------- | ------------------------------- |
| Dev (default) | `development` or `dev` | `my-template-app (Dev)`     | `com.mytemplateproject.dev`     |
| Preview       | `preview`              | `my-template-app (Preview)` | `com.mytemplateproject.preview` |
| Production    | `production`           | `my-template-app`           | `com.mytemplateproject`         |

Local scripts (`start`, `ios`, `android`, `prebuild`) set `APP_VARIANT=development`. EAS profiles in `eas.json` set the same variable per build. Only the development build registers the generated `exp+<slug>` scheme so the Metro QR code opens the Dev app.

Read the resolved variant at runtime with `Constants.expoConfig?.extra?.variant`. Register each identifier separately with Sentry, and any other service keyed to bundle ID.

Switching a local native project to another variant:

```bash
APP_VARIANT=production bunx expo prebuild --clean
```

Use `APP_VARIANT=development bunx expo prebuild --clean` before the next dev session so CLI schemes point at the Dev app again.

## Usage

### UI Components

Use `@expo/ui` universal components wrapped in `Host`.

```tsx
import { Button, Host, Text } from "@expo/ui";

export function Example() {
  return (
    <Host matchContents>
      <Text textStyle={{ fontSize: 24, fontWeight: "600" }}>Welcome</Text>
      <Button label="Continue" onPress={() => {}} />
    </Host>
  );
}
```

### Theming

```tsx
import { Button, Host, Text } from "@expo/ui";
import { useTheme } from "@/theme";

export function ThemeExample() {
  const { mode, isDark, toggleMode } = useTheme();

  return (
    <Host colorScheme={isDark ? "dark" : "light"} matchContents>
      <Text>
        Mode: {mode} ({isDark ? "dark" : "light"})
      </Text>
      <Button label="Toggle theme" onPress={toggleMode} variant="outlined" />
    </Host>
  );
}
```

### Internationalization

This template ships with English resources by default. Add more languages by extending `src/i18n/locales/*` and `resources` in `src/i18n/index.ts`.

### Subscriptions

Subscriptions use RevenueCat (`react-native-purchases` + `react-native-purchases-ui`). Set the public SDK keys in `.env`:

- `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY`
- `EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY`

The wrapper expects a `premium` entitlement and paywall placements `settings` and `onboarding_v1` in the RevenueCat dashboard. Initialization is skipped when the current platform key is missing.

Expo Go can load the SDK in Preview API Mode, but real purchases require a development build. After adding or changing these native packages, remake the native client (`bun run prebuild` or an EAS development build).

## Scripts

- `bun start` - start Expo dev server
- `bun run ios` - run iOS build
- `bun run android` - run Android build
- `bun run lint` - run Oxlint
- `bun run lint:fix` - run Oxlint with auto-fix
- `bun run format` - check formatting with Oxfmt
- `bun run format:write` - format with Oxfmt
- `bun run typecheck` - TypeScript typecheck
- `bun run analyze:bundle` - export + analyze JS bundle
