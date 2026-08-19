# Agent instructions

This is an Expo (SDK 57) + Expo Router template. App code lives under `src/`. The TypeScript path alias `@/*` maps to `./src/*`. Package manager is **Bun**. Do not invent a second folder convention or migrate the tree to a generic Expo skeleton.

## Stack (do not swap without being asked)

| Concern       | Choice                                                              |
| ------------- | ------------------------------------------------------------------- |
| UI            | Custom primitives in `@/components/ui/*` (granular imports)         |
| Styling       | Tailwind CSS 4 + Uniwind (`className`)                              |
| Icons         | `phosphor-react-native` (direct icon path imports)                  |
| Navigation    | Expo Router file routes in `src/app`                                |
| Screen bodies | `src/screens/*`, imported by route files                            |
| State         | Legend State (`@legendapp/state`) + MMKV persist                    |
| Forms         | React Hook Form                                                     |
| Lists         | `@/components/common/legend-list` (`@legendapp/list`)               |
| i18n          | i18next + `react-i18next`, JSON namespaces under `src/i18n/locales` |
| Analytics     | Firebase Analytics via `@/utils/analytics`                          |
| Errors        | Sentry (`@/utils/sentry`) + local `ErrorBoundary`                   |
| Subscriptions | RevenueCat (`@/utils/revenuecat`)                                   |
| Lint / format | Oxlint + Oxfmt; Lefthook runs format + `tsc` on commit              |

Do not add Zustand, Recoil, Redux, or a second UI kit. Do not add a UI provider.

---

## Folder structure

```
src/
├── app/                    # Expo Router ONLY — every file is a route or layout
│   ├── _layout.tsx         # root Stack: (tabs), (stacks), (modals)
│   ├── +not-found.tsx
│   ├── (tabs)/             # NativeTabs; anchor is (home)
│   │   ├── _layout.tsx
│   │   ├── (home)/         # tab 1 group
│   │   └── tab2/
│   ├── (stacks)/           # push stacks, header hidden at root
│   └── (modals)/           # presentation: modal
├── screens/                # screen UI rendered by route files
│   ├── tab-one/
│   └── tab-two/
├── components/
│   ├── common/             # shared primitives (pressable, error-boundary, legend-list)
│   ├── ui/                 # app UI kit (text, button, input, …)
│   ├── layouts/            # Layout.Base / Bare / Modal
│   └── styled/             # thin RN wrappers (SafeAreaView)
├── hooks/                  # app-wide hooks (debounce, throttle, refresh)
├── i18n/                   # initializeI18n + locales/<lang>/<ns>.json
├── providers/              # MainProvider (ErrorBoundary + theme tracking)
├── stores/                 # app observables (settings$)
├── theme/                  # tokens, hooks, theme store, light/dark schemes
├── types/                  # shared TS types
└── utils/                  # storage, logger, analytics, sentry, persist plugin, …
```

Config and native identity stay at the repo root: `app.json`, `app.config.ts`, `eas.json`, `package.json`, Firebase plists/json, `patches/`. Generated `ios/` and `android/` are prebuild output.

### Placement rules

| Kind of file                           | Put it here                                    |
| -------------------------------------- | ---------------------------------------------- |
| Route, `_layout`, `+not-found`, `+api` | `src/app/…` and nowhere else                   |
| Screen body (the UI a route renders)   | `src/screens/<kebab-name>/`                    |
| UI reused by more than one screen      | `src/components/…`                             |
| Kit primitive (button, input, text)    | `src/components/ui/`                           |
| UI used by only one screen             | Colocate under that screen folder              |
| App-wide hook                          | `src/hooks/`                                   |
| Theme token / theme hook               | `src/theme/` (not `src/hooks`)                 |
| Cross-screen persisted state           | `src/stores/`                                  |
| Theme mode / colors                    | `src/theme/stores/`                            |
| String the user sees                   | `src/i18n/locales/<lang>/<ns>.json` + `t()`    |
| One-off helper                         | `src/utils/`                                   |
| Provider that must wrap the tree       | `src/providers/` — compose into `MainProvider` |

`src/app` is routes-only. Route files stay thin:

```tsx
import { TabOneScreen } from "@/screens/tab-one";

export default function TabOneRoute() {
  return <TabOneScreen />;
}
```

Read params, `useLocalSearchParams`, and navigation options in the route file when they are route concerns. Keep layout, lists, and feature UI in `screens/`.

### File naming

- Files and folders: **kebab-case** (`error-boundary.tsx`, `tab-one/`).
- Hooks: `useX.ts` (camelCase after `use`).
- Stores: observable `foo$` in `src/stores/foo.ts`; hook export `useFooStore`.
- Platform splits: `name.ios.tsx` / `name.android.tsx` / `name.web.tsx` plus a default `name.tsx`. Same public props on every variant.
- Tests: colocate `__tests__/` next to the module (existing pattern in `components/common`, `hooks`, `utils`).

Do not introduce `src/features/`, `src/lib/`, or flatten screens into `app/`.

---

## Components and UI

### Custom UI kit (default)

Use `@/components/ui` for buttons, inputs, text, badges, cards, checkboxes, dividers, loaders, and switches.

- Import from **granular** files. Do not import the `@/components/ui` barrel unless the file already depends on most of the kit.

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
```

- Do not add a UI provider. Theme is already applied via Uniwind + `MainProvider` / `useSystemThemeTracking`.
- Sheets and full-screen modals stay Expo Router (`src/app/(modals)/`) and Gorhom bottom sheets — not kit primitives.
- Do not add HeroUI, NativeBase, or another component library.

### Local components that stay local

| Import                                                                | Role                                                                      |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `@/components/ui/*`                                                   | Kit primitives (text, button, input, card, …).                            |
| `@/components/common/pressable`                                       | Custom press targets (gesture-handler). Prefer this over raw `Pressable`. |
| `@/components/common/error-boundary`                                  | Already mounted in `MainProvider`.                                        |
| `@/components/common/legend-list`                                     | List virtualization wrapper.                                              |
| `@/components/styled/safe-area-view`                                  | Safe area + Uniwind `className`.                                          |
| `@/components/layouts` (`Layout.Base`, `Layout.Bare`, `Layout.Modal`) | Screen chrome: back button, title, modal frame.                           |

New reusable UI: kebab-case file, one primary named export. When a component grows, use a folder + `index.tsx` and colocate private parts.

Icons: import the specific Phosphor file (`phosphor-react-native/src/icons/CaretLeft`), not the full icon barrel.

### Styling

- Prefer Uniwind/`className` and theme tokens (`bg-background`, `bg-surface-primary`, semantic colors from `useThemeColors()`).
- `StyleSheet.create` only when className cannot express the style; keep it at the bottom of the same file.
- Theme mode: `useTheme()` / `useThemeStore()` from `@/theme`. Do not call `Appearance` ad hoc in screens.

### Layouts and navigation

- Tabs: `NativeTabs` in `src/app/(tabs)/_layout.tsx`. New tabs are a folder + `Trigger`.
- Push flows: `src/app/(stacks)/`.
- Modals: `src/app/(modals)/` (root stack already sets `presentation: "modal"`).
- Root `unstable_settings.anchor` is `(tabs)`; tabs anchor is `(home)`.
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

Theme persistence lives in `themePrefs$` (`local: "theme-store"`). `MainProvider` already runs `useSystemThemeTracking()`. After theme mode changes, Uniwind is updated from the store — do not call `Uniwind.setTheme` from random screens.

### What belongs where

| Data                                                | Mechanism                                                                         |
| --------------------------------------------------- | --------------------------------------------------------------------------------- |
| User settings, flags that must persist              | `src/stores/*` + `persistObservable` + MMKV plugin                                |
| Theme mode / follow-system                          | `src/theme/stores/useThemeStore.ts`                                               |
| One-off key/value (i18n language bootstrap, etc.)   | `@/utils/storage` (`StorageKeys`)                                                 |
| Server/async cache, lists from network              | Keep fetch close to the screen or a dedicated store; do not dump into `settings$` |
| Form field state                                    | React Hook Form, local to the screen                                              |
| Transient UI (open sheet, selected tab in a screen) | `useState` / `useReducer` in that component                                       |
| URL / navigation state                              | Expo Router params and segments                                                   |

Do not persist derived data, functions, or React nodes. Do not create a new MMKV instance per store — reuse the persist plugin / `storage` helper.

### React state hygiene

- Select the smallest slice (`useSettingsStore(s => s.language)`).
- Memoize callbacks that are passed to lists and `Pressable`.
- Do not subscribe to `settings$` or `themePrefs$` in a list item if the parent can pass a prop.

---

## i18n, analytics, errors

- User-visible copy goes through `useTranslation("<namespace>")` and keys in `src/i18n/locales/en/*.json`. Add a language by adding `locales/<code>/` and registering it in `src/i18n/index.ts`.
- Screen views are tracked in root `_layout` from `useSegments`. New routes should remain compatible with `getScreenNameFromSegments` in `@/utils/analytics`. Custom events: primitive GA4 properties only, via that util.
- Log with `@/utils/logger`. Report unexpected failures with Sentry (`captureException`) after `initSentry()` (already in root init).
- Init order is owned by `src/app/_layout.tsx` (`initSentry` → splash → `initializeI18n` + `initializeRevenueCat`). Do not add competing startup effects in random screens.

---

## Git commits

Lefthook **pre-commit** runs `oxfmt --write` (auto-stages fixes) and `bun run typecheck`. A commit that fails `tsc` will be rejected. Run `bun run lint` and `bun run typecheck` before you commit when you touched types or many files.

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
feat: adopt HeroUI Native as the default UI library
feat: replace Zustand with Legend State
fix(settings): stop persisting premium onto disk
refactor(analytics): migrate from PostHog to Firebase and Sentry
chore: replace Biome with Oxlint and Oxfmt
```

### What to put in a commit

- One logical change per commit. Do not mix a feature with unrelated dependency churn.
- Do not commit secrets, `.env`, or someone else’s `GoogleService-Info.plist` / `google-services.json` as if they were the template’s placeholders without being asked.
- Do not commit `node_modules/`. Treat `ios/` and `android/` as prebuild output unless the task is explicitly about native projects.
- Do not use `git commit --no-verify` to skip format/typecheck unless the user explicitly asks.
- Do not amend or force-push unless the user asks.

---

## Implementation defaults

- TypeScript strict: no `any`, no unchecked empties; use `unknown` in `catch`.
- Named exports for screens and components; route files use `export default` (Expo Router).
- Keep route files thin; keep providers centralized.
- Prefer editing existing stores/utils over adding parallel ones.
- Do not add markdown/docs the user did not ask for.
- Do not restructure the tree to match a generic Expo tutorial.
