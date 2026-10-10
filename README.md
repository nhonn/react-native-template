# React Native Template

Modern Expo + Expo Router template with a small, production-oriented baseline: file-based navigation, a theme system, i18n, and a lightweight state setup.

## Features

### Core

- **React Native**: 0.88.0-rc.4 + React 19.3.0 (New Architecture)
- **Expo**: SDK 58
- **Navigation**: Expo Router (tabs, stacks, modals)
- **TypeScript**: strict type checking
- **Package manager**: [bun](https://bun.sh) (`bun install`, `bun.lock`)

### Styling & Theme

- **Styling**: [react-native-unistyles](https://unistyl.es) for RN views + `@expo/ui` style/textStyle on native trees
- **Theming**: light/dark mode + system theme sync (Legend State store bridged to `UnistylesRuntime`)
- **Design tokens**: colors, spacing, typography, radii, shadows

### UI

- **UI**: `@expo/ui` universal components (Host, Button, Text, Column, Row, etc.)
- **2D Graphics**: [react-native-skia](https://shopify.github.io/react-native-skia/) 3.0.3 (unscoped Skia 3); tab one renders an animated Skia canvas (`src/screens/tab-one/pulse-canvas.tsx`) colored from the theme
- **Pressable**: local gesture-handler pressable kept for custom hit targets
- **Layouts**: Base/Bare/Modal layouts for screens

### State / Storage / Tooling

- **State**: Legend State with MMKV persistence
- **Database**: [WatermelonDB](https://watermelondb.dev) (SQLite adapter, JSI mode) in `src/data`; tab two adds and lists notes
- **List rendering**: LegendList v3 utility wrapper
- **Monetization**: RevenueCat utility
- **Quality**: Oxlint + Oxfmt + Lefthook

## Project Structure

```
app/                     # Expo Router layouts & route wrappers
├── (tabs)/             # Tab routes & tab layout
├── _layout.tsx         # Root layout & providers
├── modal-one.tsx       # Modal route
├── stack-one.tsx       # Stack push route
└── +not-found.tsx      # Unmatched route
src/
├── components/         # Common, layouts
├── data/               # WatermelonDB schema, migrations, models, database
├── hooks/              # App-level hooks (refresh control, etc.)
├── i18n/               # i18next setup + locales (en)
├── providers/          # Top-level providers (ErrorBoundary, etc.)
├── screens/            # Screen UI rendered by routes
├── stores/             # App stores (settings, etc.)
├── theme/              # Theme system (tokens, hooks, store, unistyles registry)
├── types/              # Shared TS types
└── utils/              # Utilities (storage, logger, date, etc.)
```

## Getting Started

```bash
brew install oven-sh/bun/bun   # or: curl -fsSL https://bun.sh/install | bash
bun install
bun run start
```

Run native:

```bash
bun run ios
bun run android
```

Add or remove dependencies with `bun add` / `bun remove`; bun owns the lockfile (`bun.lock`), so `npm install`, `pnpm install`, and `expo install` must not be used to change the tree.

### App variants

Development and production installs can sit side by side. `app.json` holds the production identity; `app.config.ts` suffixes it when `APP_VARIANT` is not `production`. When `APP_VARIANT` is unset (local `start`, `ios`, `android`, `prebuild`) it defaults to `development`; production must be requested explicitly.

| Variant       | `APP_VARIANT`                 | Name                        | Bundle ID / package             |
| ------------- | ----------------------------- | --------------------------- | ------------------------------- |
| Dev (default) | unset, `development` or `dev` | `my-template-app (Dev)`     | `com.mytemplateproject.dev`     |
| Preview       | `preview`                     | `my-template-app (Preview)` | `com.mytemplateproject.preview` |
| Production    | `production`                  | `my-template-app`           | `com.mytemplateproject`         |

EAS profiles in `eas.json` set `APP_VARIANT` explicitly per build. Only the development build registers the generated `exp+<slug>` scheme so the Metro QR code opens the Dev app.

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

### Database (WatermelonDB)

Local persistence uses [WatermelonDB](https://watermelondb.dev) on the SQLite adapter with `jsi: true`.

- `src/data/schema.ts`, `src/data/migrations.ts` — schema and migrations. Bump `version` and add a migration step together.
- `src/data/models/` — models (legacy decorators, e.g. `src/data/models/note.ts`). Register new models in `modelClasses` in `src/data/database.ts`.
- `src/data/database.ts` — the `database` instance. `DatabaseProvider` is composed into `MainProvider`, so `useDatabase()` works anywhere under the root layout.
- `src/screens/tab-two` — add/list example (`useNotes.ts` observes a query).

Native setup comes from the `expo-watermelondb-plugin` config plugin in `app.json` (registers `WatermelonDBJSIPackage` on Android; iOS pods are autolinked). JSI mode needs a development build — WatermelonDB does not run in Expo Go. Decorators work through `babel-preset-expo` (`decorators: { legacy: true }` in `babel.config.js`) plus `experimentalDecorators` in `tsconfig.json`. After adding or upgrading it, rebuild the native client (`bun run prebuild` or an EAS development build).

### Skia

`react-native-skia` (the unscoped Skia 3 package, successor of `@shopify/react-native-skia`) is installed. The tab one demo animates a `Canvas` with a Reanimated shared value and takes its colors from `useTheme()`, so it follows light/dark.

### Subscriptions

Subscriptions use RevenueCat (`react-native-purchases` + `react-native-purchases-ui`). Set the public SDK keys in `.env`:

- `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY`
- `EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY`

The wrapper expects a `premium` entitlement and paywall placements `settings` and `onboarding_v1` in the RevenueCat dashboard. Initialization is skipped when the current platform key is missing.

Expo Go can load the SDK in Preview API Mode, but real purchases require a development build. After adding or changing these native packages, remake the native client (`bun run prebuild` or an EAS development build).

## Scripts

- `bun run start` - start Expo dev server
- `bun run ios` - run iOS build
- `bun run android` - run Android build
- `bun run lint` - run Oxlint (check only)
- `bun run lint:fix` - run Oxlint with auto-fix
- `bun run format` - check formatting with Oxfmt
- `bun run format:write` - format with Oxfmt
- `bun run typecheck` - TypeScript typecheck
- `bun run verify:locales` - verify i18n key parity across locales
- `bun run prebuild` - regenerate native projects (`APP_VARIANT=development` with `prebuild:dev`)
