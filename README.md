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

- **Styling**: [Tamagui Tailwind](https://tamagui.dev/docs/core/tailwind) (`@tamagui/tailwind` `View`/`Text`/`styled` + `className`) for RN views + `@expo/ui` style/textStyle on native trees
- **Theming**: light/dark mode + system theme sync (Legend State store feeds `TamaguiProvider` / `Theme`)
- **Design tokens**: colors, spacing, typography, radii, shadows

### UI

- **UI**: `@expo/ui` universal components (Host, Button, Text, Column, Row, etc.)
- **2D Graphics**: [react-native-skia](https://shopify.github.io/react-native-skia/) 3.7.0 (unscoped Skia 3); tab one renders an animated Skia canvas (`src/screens/tab-one/pulse-canvas.tsx`) colored from the theme
- **Pressable**: local gesture-handler pressable kept for custom hit targets
- **Layouts**: Base/Bare/Modal layouts for screens

### State / Storage / Tooling

- **State**: Legend State with MMKV persistence
- **Database**: [WatermelonDB](https://watermelondb.dev) (Nitro SQLite adapter) in `src/data`; tab two adds and lists notes
- **List rendering**: LegendList v3 utility wrapper
- **Monetization**: RevenueCat utility
- **Quality**: Oxlint + Lefthook

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
├── theme/              # Theme system (tokens, hooks, store)
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

RN views are styled with [Tamagui Tailwind](https://tamagui.dev/docs/core/tailwind): `View` and `Text` from `@tamagui/tailwind` take a `className` of utilities.

```tsx
import { View } from "@tamagui/tailwind";

export function Card() {
  return <View className="gap-1 rounded-lg bg-surface-elevated p-4">{/* ... */}</View>;
}
```

**Setup**

- `tamagui.config.ts` (repo root) builds the config from `@tamagui/config/v6` and replaces its tokens and themes with the template's own, imported from `src/theme/constants` and `src/theme/themes`:
  - `space` / `size` = `Spacing` (`p-4` = 16, `p-3.5` = 14, `gap-1` = 4)
  - `radius` = `BorderRadius` (`rounded-lg` = 12; `none` is a reserved Tamagui name, `rounded-none` works without it)
  - `color` = flattened `Colors` (`bg-gray-50`, `text-primary-500`)
  - `light` / `dark` themes = `lightColorScheme` / `darkColorScheme` flattened to kebab-case keys: `bg-background-primary`, `bg-surface-elevated`, `text-text-secondary`, `border-border-secondary`, `bg-interactive-primary-hover`. Theme classes switch with the mode.
- `MainProvider` wraps the app in `TamaguiProvider` + `<Theme name={mode}>`; `mode` comes from the Legend State theme store (`themePrefs$`), which remains the single source of truth for light/dark.
- `metro.config.js` wraps the config with `withTamagui` from `@tamagui/metro-plugin` (`components: ["tamagui", "@tamagui/tailwind"]`). `babel.config.js` only needs `babel-preset-expo` and the Reanimated plugin.
- Third-party components that do not take `className` (`SafeAreaView`, `GestureHandlerRootView`, `Animated.View`, Skia `Canvas`) are wrapped once at module level with `styledNative(Component, "classes")` from `@/components/common/styled-native`.

**Rules**

- Conflicting classes resolve by position, not like web Tailwind: write the winning class last (`rounded rounded-r-none`).
- Use `flex-1` for `flex: 1`; fixed font sizes and percentages use arbitrary values (`text-[16px]`, `max-w-[60%]`).
- Props that take a style object, not a class (`contentContainerStyle`, computed safe-area offsets), get a plain object; read tokens with `getTokenValue("4", "space")` from `tamagui` (Tamagui v3 keys have no `$` prefix).
- `@expo/ui` props (`style`, `textStyle` on `Host`/`Column`/`Text`, …) are `@expo/ui`'s own API and stay inline.

To sync an app with this template, copy `tamagui.config.ts`, the `withTamagui` metro wrapper, `MainProvider`, `styled-native.ts`, and `src/theme`.

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

Local persistence uses [WatermelonDB](https://watermelondb.dev) through `react-native-watermelondb`, a Nitro (JSI) C++ SQLite engine for iOS and Android. The API follows upstream; imports come from `react-native-watermelondb`.

- `src/data/schema.ts`, `src/data/migrations.ts` — schema and migrations. Bump `version` and add a migration step together.
- `src/data/models/` — models without decorators: declare typed fields and bind them with `defineColumns` (`src/data/define-columns.ts`), e.g. `src/data/models/note.ts`. Register new models in `modelClasses` in `src/data/database.ts`.
- `src/data/database.ts` — the `database` instance and `databaseReady` (await it before the first query or write; Android schema setup is async). `DatabaseProvider` is composed into `MainProvider`, so `useDatabase()` works anywhere under the root layout.
- `src/screens/tab-two` — add/list example (`useNotes.ts` observes a query).

Needs a development build — the native module does not run in Expo Go. Requires `react-native-nitro-modules` and `rxjs`. Metro lists `react-native-watermelondb` in `nonInlinedRequires`. After changing native deps, rebuild native (`bun run prebuild` or an EAS development build).

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
- `bun run typecheck` - TypeScript typecheck
- `bun run verify:locales` - verify i18n key parity across locales
- `bun run prebuild` - regenerate native projects (`APP_VARIANT=development` with `prebuild:dev`)
