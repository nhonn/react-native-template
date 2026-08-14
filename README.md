# React Native Template

Modern Expo + Expo Router template with a small, production-oriented baseline: typed navigation, HeroUI Native, a theme system, i18n, and a lightweight state setup.

## Features

### Core

- **React Native**: 0.85.3 + React 19.2.3
- **Expo**: SDK 56
- **Navigation**: Expo Router 6 (tabs, stacks, modals)
- **TypeScript**: strict type checking
- **Package manager**: Bun

### Styling & Theme

- **Styling**: TailwindCSS 4 + Uniwind
- **Theming**: light/dark mode + system theme sync
- **Design tokens**: colors, spacing, typography, radii, shadows

### UI

- **HeroUI Native**: default component library (Button, Input, Typography, Toast, etc.)
- **Pressable**: local gesture-handler pressable kept for custom hit targets
- **Layouts**: Base/Bare/Modal layouts for screens

### State / Storage / Tooling

- **State**: Zustand with MMKV persistence
- **Forms**: React Hook Form + Valibot
- **List rendering**: LegendList v3 utility wrapper
- **Analytics**: Firebase Analytics / GA4 with Expo Router `screen_view` tracking
- **Monetization**: RevenueCat utility
- **Quality**: Oxlint + Oxfmt + Lefthook
- **Testing**: Jest + React Native Testing Library (Expo preset)

## Project Structure

```
src/
├── app/                # Expo Router screens
├── components/         # UI components (common/layouts/styled)
├── hooks/              # App-level hooks (debounce/throttle/etc.)
├── i18n/               # i18next setup + locales (en)
├── providers/          # Top-level providers (ErrorBoundary, etc.)
├── stores/             # App stores (settings, etc.)
├── theme/              # Theme system (tokens, hooks, store)
├── types/              # Shared TS types
└── utils/              # Utilities (storage, logger, analytics, date, etc.)
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

## Usage

### UI Components

Use HeroUI Native as the default UI. Prefer granular imports.

```tsx
import { Button } from "heroui-native/button";
import { Input } from "heroui-native/input";
import { Typography } from "heroui-native/text";

export function Example() {
  return (
    <>
      <Typography type="h2">Welcome</Typography>
      <Input placeholder="you@example.com" />
      <Button variant="primary">Continue</Button>
    </>
  );
}
```

### Theming

```tsx
import { Button } from "heroui-native/button";
import { Typography } from "heroui-native/text";
import { useTheme } from "@/theme";

export function ThemeExample() {
  const { mode, isDark, toggleMode } = useTheme();

  return (
    <>
      <Typography>
        Mode: {mode} ({isDark ? "dark" : "light"})
      </Typography>
      <Button variant="secondary" onPress={toggleMode}>
        Toggle theme
      </Button>
    </>
  );
}
```

### Internationalization

This template ships with English resources by default. Add more languages by extending `src/i18n/locales/*` and `resources` in `src/i18n/index.ts`.

### Analytics

Analytics is backed by Firebase Analytics / GA4 on native iOS and Android. Set up these files in your app root before building a development client:

- `GoogleService-Info.plist`
- `google-services.json`

The template config points Expo at those files through `app.json`. You will need to replace them with files that match your bundle identifier and Android package before native builds will succeed.

By default, the app tracks `screen_view` events with `screen_name` and `screen_class` derived from the current Expo Router route. Generic events are logged through the shared analytics utility with primitive GA4 properties only.

`EXPO_PUBLIC_SENTRY_DSN` remains the only required analytics-related environment variable in `.env`.

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
