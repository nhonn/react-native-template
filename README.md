# React Native Template

Modern Expo + React Navigation template with a small, production-oriented baseline: typed navigation, a theme system, i18n, and a lightweight state setup.

## Features

### Core

- **React Native**: 0.86.3 + React 19.2.3 (New Architecture)
- **Expo**: SDK 57
- **Navigation**: React Navigation 7 (tabs, stacks, modals)
- **TypeScript**: strict type checking
- **Package manager**: pnpm

### Styling & Theme

- **Styling**: [react-native-unistyles](https://unistyl.es) for RN views + `@expo/ui` style/textStyle on native trees
- **Theming**: light/dark mode + system theme sync (Legend State store bridged to `UnistylesRuntime`)
- **Design tokens**: colors, spacing, typography, radii, shadows

### UI

- **UI**: `@expo/ui` universal components (Host, Button, Text, Column, Row, etc.)
- **Pressable**: local gesture-handler pressable kept for custom hit targets
- **Layouts**: Base/Bare/Modal layouts for screens

### State / Storage / Tooling

- **State**: Legend State with MMKV persistence
- **Forms**: React Hook Form
- **List rendering**: LegendList v3 utility wrapper
- **Monetization**: RevenueCat utility
- **Quality**: Oxlint + Oxfmt + Lefthook

## Project Structure

```
src/
├── components/         # Common, layouts
├── hooks/              # App-level hooks (debounce/throttle/etc.)
├── i18n/               # i18next setup + locales (en)
├── navigation/         # Navigators, linking, param lists
├── providers/          # Top-level providers (ErrorBoundary, etc.)
├── screens/            # Screen UI rendered by navigators
├── stores/             # App stores (settings, etc.)
├── theme/              # Theme system (tokens, hooks, store, unistyles registry)
├── types/              # Shared TS types
└── utils/              # Utilities (storage, logger, date, etc.)
```

## Getting Started

```bash
pnpm install
pnpm start
```

Run native:

```bash
pnpm run ios
pnpm run android
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
APP_VARIANT=production pnpm exec expo prebuild --clean
```

Use `APP_VARIANT=development pnpm exec expo prebuild --clean` before the next dev session so CLI schemes point at the Dev app again.

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

### Styling

RN views are styled with [react-native-unistyles](https://unistyl.es). Import `StyleSheet` from `react-native-unistyles` (never `react-native`), define styles at module level, and reach theme tokens through the `theme` callback argument. Styles update automatically on light/dark change — no hook needed.

```tsx
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

const styles = StyleSheet.create((theme) => ({
  card: {
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface.elevated,
  },
}));

export function Card() {
  return <View style={styles.card}>{/* ... */}</View>;
}
```

Avoid inline `style={{...}}` on RN views and theme reads in JSX. `@expo/ui` props (`style`, `textStyle` on `Host`/`Column`/`Text`, …) are `@expo/ui`'s own API and stay inline.

The unistyles themes are registered in `src/theme/unistyles.ts`; the light/dark decision itself lives in the Legend State theme store (`themePrefs$`) and is bridged to `UnistylesRuntime.setTheme` on every mode change.

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

Expo Go can load the SDK in Preview API Mode, but real purchases require a development build. After adding or changing these native packages, remake the native client (`pnpm run prebuild` or an EAS development build).

## Scripts

- `pnpm start` - start Expo dev server
- `pnpm run ios` - run iOS build
- `pnpm run android` - run Android build
- `pnpm run lint` - run Oxlint with auto-fix
- `pnpm run format` - check formatting with Oxfmt
- `pnpm run format:write` - format with Oxfmt
- `pnpm run typecheck` - TypeScript typecheck
- `pnpm run prebuild` - regenerate native projects (`APP_VARIANT=development` with `prebuild:dev`)
