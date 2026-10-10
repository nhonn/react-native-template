# Agent instructions

This is an Expo (SDK 58) + Expo Router template. App code lives under `src/` (screen bodies, components, stores, theme) with thin route wrappers and layouts under `app/`. The TypeScript path alias `@/*` maps to `./src/*`. Package manager is **bun** (`bun.lock`). Do not invent a second folder convention or migrate the tree to a generic Expo skeleton.

## Stack (do not swap without being asked)

| UI | `@expo/ui` universal. Import from `@expo/ui`. Every `@expo/ui` tree sits in `Host`. |
| Styling | `@expo/ui` `style` / `textStyle` on native trees. RN views: react-native-unistyles `StyleSheet.create((theme) => ...)`. Never `className`, Tailwind, or Uniwind. Never `StyleSheet` from `react-native`. |
| Icons | `@expo/ui` `Icon` + `@expo/material-symbols`. `Icon.select({ ios: "<sf-symbol>", android: import("@expo/material-symbols/<name>.xml") })`. Never Phosphor. |
| Navigation | Expo Router file-based routing (`app/` layouts and route wrappers) |
| Screen bodies | `src/screens/*`, imported by route wrappers |
| State | Legend State (`@legendapp/state`) + MMKV persist |
| Database | WatermelonDB (`@nozbe/watermelondb`), SQLite adapter with `jsi: true`, in `src/data/` |
| Graphics | `react-native-skia` (unscoped Skia 3) with Reanimated; theme colors from `useTheme()` |
| Lists | `@/components/common/legend-list` (`@legendapp/list`) |
| i18n | i18next + `react-i18next`, JSON namespaces under `src/i18n/locales` |
| Errors | Sentry (`@/utils/sentry`) + local `ErrorBoundary` |
| Subscriptions | RevenueCat (`@/utils/revenuecat`) |
| Lint / format | Oxlint + Oxfmt; Lefthook runs format + `tsc` on commit |

Do not add Zustand, Recoil, Redux, a form library without being asked, or a second UI kit. Do not add a UI provider.

### Package manager: bun

[bun](https://bun.sh) owns this project. `bun.lock` is the lockfile; use bun's CLI for every install, script, and binary:

| Task | Command |
| Install | `bun install` (`bun install --frozen-lockfile` in CI) |
| Add / remove a dependency | `bun add <pkg>` / `bun remove <pkg>` |
| Run a `package.json` script | `bun run <script>` |
| Run a local binary | `bunx <bin>` (replaces `npx` / `pnpm exec`) |

- Never change the tree with `npm install`, `pnpm add`, or `expo install` — they write `package-lock.json` / `pnpm-lock.yaml` and drift from `bun.lock`.
- Dependency lifecycle scripts are deny-by-default. The approved set is the `trustedDependencies` array in `package.json`; approve new ones with `bun pm trust <pkg>`, or add them to that array.
- Root `prepare` runs `lefthook install` so a plain `bun install` wires the per-project git hooks.

---

## Folder structure

```
app/
├── _layout.tsx             # root providers, Sentry wrap, stack layout
├── (tabs)/
│   ├── _layout.tsx         # bottom tabs layout
│   ├── index.tsx           # route wrapper -> @/screens/tab-one
│   └── tab-two.tsx         # route wrapper -> @/screens/tab-two
├── stack-one.tsx           # route wrapper -> @/screens/stack-one
├── modal-one.tsx           # route wrapper -> @/screens/modal-one
└── +not-found.tsx          # route wrapper -> @/screens/not-found
src/
├── screens/                # screen UI rendered by routes
│   ├── tab-one/
│   ├── tab-two/
│   ├── stack-one/
│   ├── modal-one/
│   └── not-found/
├── components/
│   ├── common/             # shared primitives (pressable, error-boundary, legend-list)
│   └── layouts/            # Layout.Base / Bare / Modal
├── data/                   # WatermelonDB schema, migrations, models/, database instance
├── hooks/                  # app-wide hooks (refresh control)
├── i18n/                   # initializeI18n + locales/<lang>/<ns>.json
├── providers/              # MainProvider (ErrorBoundary + DatabaseProvider + theme tracking)
├── stores/                 # app observables (settings$)
├── theme/                  # tokens, hooks, theme store, light/dark schemes
├── types/                  # shared TS types
└── utils/                  # storage, logger, sentry, persist plugin, …
```

Config and native identity stay at the repo root: `app.json`, `app.config.ts`, `eas.json`, `package.json`, `patches/`. Generated `ios/` and `android/` are prebuild output.

### Placement rules

| Kind of file                         | Put it here                                                                   |
| ------------------------------------ | ----------------------------------------------------------------------------- |
| Route wrapper, layout                | `app/`                                                                        |
| Screen body (the UI a route renders) | `src/screens/<kebab-name>/`                                                   |
| UI reused by more than one screen    | `src/components/…`                                                            |
| Native control                       | Import from `@expo/ui` in the screen/layout. Do not add `src/components/ui/`. |
| UI used by only one screen           | Colocate under that screen folder                                             |
| App-wide hook                        | `src/hooks/`                                                                  |
| Theme token / theme hook             | `src/theme/` (not `src/hooks`)                                                |
| Cross-screen persisted state         | `src/stores/`                                                                 |
| Relational / queryable local data    | `src/data/` (schema, migrations, `models/`); register models in `database.ts` |
| Theme mode / colors                  | `src/theme/stores/`                                                           |
| String the user sees                 | `src/i18n/locales/<lang>/<ns>.json` + `t()`                                   |
| One-off helper                       | `src/utils/`                                                                  |
| Provider that must wrap the tree     | `src/providers/` — compose into `MainProvider`                                |

Layouts and routes live in `app/`; screen UI lives in `src/screens`. Read params with `useLocalSearchParams` in the screen or route wrapper. Keep layout, lists, and feature UI in `screens/`.

### File naming

- Files and folders: **kebab-case** (`error-boundary.tsx`, `tab-one/`).
- Hooks: `useX.ts` (camelCase after `use`).
- Stores: observable `foo$` in `src/stores/foo.ts`; hook export `useFooStore`.
- Platform splits (none exist in the template yet; use only when needed): `name.ios.tsx` / `name.android.tsx` / `name.web.tsx` plus a default `name.tsx`. Same public props on every variant.

Do not introduce `src/features/`, `src/lib/`, or put screen UI in `app/` or the repo root.

---

## Components and UI

### Expo UI (default)

- Import `Host`, `Button`, `Text`, `TextInput`, `Switch`, `Checkbox`, `Icon`, `BottomSheet`, `Picker`, `Slider`, `Column`, `Row`, `ScrollView` from `@expo/ui`.
- Wrap every `@expo/ui` subtree in `Host` from `@expo/ui` (never from `@expo/ui/swift-ui` or `@expo/ui/jetpack-compose`). `matchContents` for intrinsic-sized controls; `style={{ flex: 1 }}` when the host should fill. Pass `colorScheme={isDark ? "dark" : "light"}` from `useTheme()` so native UI follows the theme store.
- Example button:

```tsx
<Host matchContents colorScheme={isDark ? "dark" : "light"}>
  <Button label="Continue" onPress={() => {}} />
</Host>
```

- `BottomSheet` is a sibling of `Host`, not nested in it (`isPresented` + `onDismiss`):

```tsx
<>
  <Host matchContents>
    <Button label="Open" onPress={() => setOpen(true)} />
  </Host>
  <BottomSheet isPresented={open} onDismiss={() => setOpen(false)}>
    <Column spacing={12}>
      <Text>Sheet</Text>
    </Column>
  </BottomSheet>
</>
```

- Full-screen flows are root stack screens with `presentation: "modal"` in `app/_layout.tsx`. Sheets use universal `BottomSheet`, not Gorhom, not `@expo/ui/community/bottom-sheet`.
- Do not add `@gorhom/bottom-sheet`, `@react-native-community/datetimepicker`, `@react-native-community/slider`, `@react-native-picker/picker`, `@react-native-menu/menu`, `react-native-pager-view`, `@react-native-segmented-control/segmented-control`, `@react-native-masked-view/masked-view`. Universal `@expo/ui` first; `@expo/ui/community/<kebab-name>` only when migrating an existing community API.
- Universal first. Platform-specific `@expo/ui/swift-ui` / `jetpack-compose` only when universal lacks the control; isolate in `src/components/**/*.ios.tsx` / `*.android.tsx` (never under `app/`).
- `Button` uses `label` + `variant`: `"filled"` | `"outlined"` | `"text"`. `Switch`/`Checkbox` use `value` + `onValueChange`. Controlled `TextInput` uses `useNativeState`, not a string `value`.
- `@expo/ui` `List` is not for large datasets — keep `@/components/common/legend-list`.
- Do not wrap `@expo/ui` in a local kit. Do not add HeroUI/NativeBase/another kit. Do not add a UI provider. Do not add Tailwind, Uniwind, or `className`.
- RN-only gaps (card/spinner/divider): RN `View` / `ActivityIndicator` + unistyles `StyleSheet`, or platform-specific `@expo/ui` when needed.
- Theme mode: `useTheme()` / `useThemeStore()`. After mode changes, `Host colorScheme` is the only native theming hook — do not call `Uniwind.setTheme`.

### Local components that stay local

| Import                                                                | Role                                                                                                                 |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `@/components/common/pressable`                                       | Custom press targets (gesture-handler). Prefer this over raw `Pressable`.                                            |
| `@/components/common/error-boundary`                                  | Already mounted in `MainProvider`.                                                                                   |
| `@/components/common/legend-list`                                     | List virtualization wrapper.                                                                                         |
| `@/components/layouts` (`Layout.Base`, `Layout.Bare`, `Layout.Modal`) | Screen chrome: back button, title, modal frame. Layouts import `SafeAreaView` from `react-native-safe-area-context`. |

New reusable UI: kebab-case file, one primary named export. When a component grows, use a folder + `index.tsx` and colocate private parts.

Icons: `@expo/ui` `Icon` + `@expo/material-symbols`. `Icon.select({ ios: "<sf-symbol>", android: import("@expo/material-symbols/<name>.xml") })`. Never Phosphor.

### Styling

- React Native trees: **react-native-unistyles**. Import `StyleSheet` from `react-native-unistyles` (never from `react-native`), define styles at module level as `StyleSheet.create((theme) => ({...}))`, and apply with `styles.x`. Themed styles update automatically on mode change — no hook needed.
- Never inline `style={{...}}` on RN views, never read theme colors in JSX, and never `className`, Tailwind, or Uniwind. `@expo/ui` `style` / `textStyle` props on native trees are the exception — they are `@expo/ui`'s own API and stay inline.
- Theme mode: `useTheme()` / `useThemeStore()` from `@/theme`. Do not call `Appearance` ad hoc in screens.
- The mode decision stays in `themePrefs$` (Legend State + MMKV). The store bridges it to unistyles via `applyUnistylesTheme()` (`src/theme/unistyles.ts`) → `UnistylesRuntime.setTheme`. `Host colorScheme` remains the native-tree theming hook; do not call `Uniwind.setTheme`.

Example:

```tsx
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    padding: theme.spacing[4],
    backgroundColor: theme.colors.background.primary,
  },
}));

export function MyScreen() {
  return <View style={styles.container}>{/* ... */}</View>;
}
```

### Layouts and navigation

- Tabs: `app/(tabs)/_layout.tsx` using `Tabs` from `expo-router`. New tabs are a `Tabs.Screen`.
- Push flows: another `Stack.Screen` on the root native stack in `app/_layout.tsx`.
- Modals: root `Stack.Screen` with `presentation: "modal"`.
- Initial route is `(tabs)`.
- Use `Layout.Base` for stack screens that need a title/back; `Layout.Modal` for modal chrome; `Layout.Bare` when the screen owns the whole frame.

---

## State

### Legend State is the app store

Global and persisted state uses `@legendapp/state` observables, not React Context and not Zustand.

Pattern (see `src/stores/settings.ts` and `src/theme/stores/useThemeStore.ts`):

1. Split **runtime** fields (must not persist) from **persistent** fields.
2. Create `foo$` with `persistObservable` when anything should survive process death.
3. Persist through `ObservablePersistMMKVNative` from `@/utils/legend-persist`.
4. Use a `transform.out` (or omit keys) so ephemeral fields like `premium` never hit disk.
5. Put mutations in a named `*Actions` object that writes with `.set()` / observable APIs.
6. Export a hook via `useSelector` that can take an optional selector. Attach `.getState()` for non-React callers.

```tsx
// subscribe to a slice — do not pull the whole store in a hot component
const language = useSettingsStore((s) => s.language);
useSettingsStore.getState().setLanguage("en");

// fine-grained / non-React
settings$.language.set("en");
```

Theme persistence lives in `themePrefs$` (`local: "theme-store"`). `MainProvider` already runs `useSystemThemeTracking()`. Mode changes reach unistyles through `applyUnistylesTheme` (wired inside `applyMode` in the store); root init calls `initializeUnistylesTheme()` so a persisted manual override wins over the system. Native trees track theme changes via `Host colorScheme`; RN trees via unistyles stylesheets.

### What belongs where

| Data                                                | Mechanism                                                                         |
| --------------------------------------------------- | --------------------------------------------------------------------------------- |
| User settings, flags that must persist              | `src/stores/*` + `persistObservable` + MMKV plugin                                |
| Theme mode / follow-system                          | `src/theme/stores/useThemeStore.ts`                                               |
| One-off key/value (i18n language bootstrap, etc.)   | `@/utils/storage` (`StorageKeys`)                                                 |
| Server/async cache, lists from network              | Keep fetch close to the screen or a dedicated store; do not dump into `settings$` |
| Form field state                                    | `useState` / `useNativeState` local to the screen (no form library installed)     |
| Transient UI (open sheet, selected tab in a screen) | `useState` / `useReducer` in that component                                       |
| URL / navigation state                              | Expo Router route paths and params                                                |

Do not persist derived data, functions, or React nodes. Do not create a new MMKV instance per store — reuse the persist plugin / `storage` helper.

### React state hygiene

- Select the smallest slice (`useSettingsStore(s => s.language)`).
- Memoize callbacks that are passed to lists and `Pressable`.
- Do not subscribe to `settings$` or `themePrefs$` in a list item if the parent can pass a prop.

---

### Database (WatermelonDB)

- Everything lives in `src/data/`: `schema.ts`, `migrations.ts`, `models/<name>.ts`, `database.ts` (SQLite adapter, `jsi: true`). Export from `src/data/index.ts`; `DatabaseProvider` is composed into `MainProvider`.
- Changing a table: bump `version` in `schema.ts` **and** add a step in `migrations.ts`. Register new models in `modelClasses`.
- Models use legacy decorators (`@field`, `@date`, `@readonly`) from `@nozbe/watermelondb/decorators`. Decorator support comes from `babel-preset-expo` (`decorators: { legacy: true }`) and `experimentalDecorators` in `tsconfig.json`; do not add a separate Babel decorators plugin.
- Read via `useDatabase()` + `collection.query(...).observe()` (see `src/screens/tab-two/useNotes.ts`); write inside `database.write(...)`.
- Needs a development build (JSI, not Expo Go). Native wiring is the `expo-watermelondb-plugin` entry in `app.json`; rebuild native after changing it.
- Do not put queryable/relational data in `settings$` or MMKV.

## i18n, errors

- User-visible copy goes through `useTranslation("<namespace>")` and keys in `src/i18n/locales/en/*.json`. Add a language by adding `locales/<code>/` and registering it in `src/i18n/index.ts`. Change language with `useSettingsStore.getState().setLanguage(code)` — it updates `settings$`, persists the `StorageKeys.LANGUAGE` key that `initializeI18n` reads, and calls `i18n.changeLanguage`.
- Log with `@/utils/logger`. Report unexpected failures with Sentry (`captureException`) after `initSentry()` (already in root init).
- Init order is owned by `app/_layout.tsx`: `initSentry()` and `preventAutoHideAsync()` run at module scope; then `initializeI18n` + `initializeRevenueCat` run in the root effect before the splash screen is hidden. Do not add competing startup effects in random screens.

---

## Git commits

Lefthook **pre-commit** runs `bun run verify:locales`, `bunx oxfmt --write` (auto-stages fixes) and `bun run typecheck`. A commit that fails `tsc` will be rejected. Run `bun run lint` (check only; `bun run lint:fix` applies fixes) and `bun run typecheck` before you commit when you touched types or many files.

### Message format

[Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(optional-scope): <imperative summary>
```

- **type:** `feat` | `fix` | `refactor` | `chore` | `docs` | `test` | `perf` | `revert`
- **scope** (optional, kebab-case): area such as `analytics`, `theme`, `i18n`, `settings`, `tabs`
- **summary:** imperative, lowercase after the colon, no trailing period, ~72 characters
- Body (optional): what and why, not a file list. Wrap at 72–80 chars.
- Footer: `BREAKING CHANGE:` or `Refs: #123` when needed

Examples that match this repo’s history:

```
feat(data): add WatermelonDB with SQLite JSI adapter
feat: replace Zustand with Legend State
fix(settings): stop persisting premium onto disk
refactor: migrate to expo-router
chore: replace Biome with Oxlint and Oxfmt
```

### What to put in a commit

- One logical change per commit. Do not mix a feature with unrelated dependency churn.
- Do not commit secrets or `.env` as if they were the template’s placeholders without being asked.
- Do not commit `node_modules/`. Treat `ios/` and `android/` as prebuild output unless the task is explicitly about native projects.
- Do not use `git commit --no-verify` to skip format/typecheck unless the user explicitly asks.
- Do not amend or force-push unless the user asks.

---

## Implementation defaults

- TypeScript strict: no `any`, no unchecked empties; use `unknown` in `catch`.
- Named exports for screens and components. Route files and root layout in `app/` use default exports (root layout wrapped with Sentry `wrap`).
- Prefer editing existing stores/utils over adding parallel ones.
- Do not add markdown/docs the user did not ask for.
- Do not restructure the tree to match a generic Expo tutorial.
