# Architecture Documentation

## Overview

This React Native template follows a layered architecture with clear separation of concerns. The codebase is built using modern React Native patterns, Expo SDK 54, and emphasizes performance, accessibility, and type safety.

## Tech Stack

- **Framework**: React Native 0.81.5 + React 19.1.0
- **Expo SDK**: 54 (latest)
- **Navigation**: Expo Router (file-based routing)
- **Styling**: TailwindCSS 4 + Uniwind (inline styles)
- **State Management**: Zustand with MMKV persistence
- **Forms**: React Hook Form + Valibot validation
- **Animations**: React Native Reanimated 4
- **Storage**: MMKV (Zustand persistence via JSON adapter)
- **Analytics**: PostHog
- **Monetization**: RevenueCat
- **Testing**: Jest + React Testing Library
- **Linting**: Biome (extends Ultracite)
- **Type Safety**: TypeScript 5.9 (strict mode)

## Directory Structure

```
src/
├── app/                    # Expo Router file-based navigation
│   ├── (tabs)/            # Tab navigator screens
│   ├── (stacks)/          # Stack navigator screens
│   ├── (modals)/          # Modal screens
│   ├── _layout.tsx        # Root layout with providers
│   └── +not-found.tsx     # 404 screen
├── components/             # Reusable UI components
│   ├── common/            # Shared components (Button, Input, Toast, etc.)
│   ├── layouts/           # Screen wrappers (Base, Bare, Modal)
│   └── styled/            # Styled native components
├── theme/                 # Design system
│   ├── constants/         # Design tokens (colors, spacing, typography)
│   ├── stores/            # Zustand state stores
│   ├── hooks/             # Theme hooks (useTheme, useThemeColors)
│   └── utils/             # Theme utilities
├── stores/                # Global state management (settings)
├── hooks/                 # Custom React hooks (useDebounce, useThrottle)
├── utils/                 # Utility functions (analytics, storage, logger)
├── i18n/                  # Internationalization (en)
├── providers/             # React providers (MainProvider)
├── types/                 # Global TypeScript types
└── global.css             # TailwindCSS + Uniwind config
```

## Architectural Patterns

### 1. Component Architecture

**Variant-Based Components**
- Uses `class-variance-authority` (CVA) for variant management
- Examples: `Button`, `Input`, `Loading`, `Toast`
- Props: `variant` (primary, secondary, etc.), `size` (sm, md, lg), `state`

**Compound Components**
- Exports multiple related components together
- Example: `Input` exports `Input`, `PasswordInput`, `SearchInput`, `Textarea`
- Layout exports: `Layout.Bare`, `Layout.Base`, `Layout.Modal`

**Performance Optimizations**
- All components wrapped with `React.memo`
- `useMemo` for computed values (classes, styles)
- `useCallback` for event handlers
- Uses `ForwardRef` for ref forwarding

### 2. State Management

**Primary**: Zustand with MMKV persistence
```typescript
// Theme Store
interface ThemeStore {
  mode: ThemeMode;
  followSystemTheme: boolean;
  theme: Theme;
}

// Settings Store  
interface SettingsState {
  premium: boolean;
  isTablet: boolean;
  language: string;
  dateFormat: ValidDateFormat;
  textSizePreference: TextSizePreference;
}
```

**Key Principles**:
- Single source of truth (removed duplicate ThemeContext)
- Persistent storage via MMKV
- Atomic selectors for performance
- TypeScript type-safe actions

### 3. Navigation Architecture

**Expo Router** - File-based routing
```
app/
├── _layout.tsx          # Root Stack
├── (tabs)/             # Tab Navigator
│   ├── _layout.tsx
│   ├── index.tsx
│   └── tab2.tsx
├── (stacks)/           # Stack Navigator  
│   ├── _layout.tsx
│   └── stack1.tsx
└── (modals)/           # Modal Navigator
    ├── _layout.tsx
    └── modal1.tsx
```

**Route Configuration**:
- Tabs: Icon-only, no labels
- Stacks: Slide from right animation
- Modals: Slide from bottom animation
- Typed routes enabled

### 4. Styling Architecture

**TailwindCSS 4 + Uniwind**
- Design tokens defined in CSS variables
- Inline style compilation (zero runtime)
- Responsive breakpoints
- Dark mode variants

**Theme System**
```typescript
interface Theme {
  mode: 'light' | 'dark';
  colors: ColorScheme;
  typography: Typography;
  spacing: Spacing;
  borderRadius: BorderRadius;
  shadows: Shadows;
  opacity: Opacity;
}
```

**Hooks for Theme**:
- `useTheme()` - Full theme object
- `useThemeColors()` - Color values
- `useThemeTypography()` - Typography config
- `useThemedStyle()` - Dynamic styling based on theme

### 5. Data Layer

**Storage** - MMKV via `react-native-mmkv`

**Analytics** - PostHog
```typescript
// Initialize with API key
initAnalytics();

// Track errors
trackError({ error, context, tags });

// Track events
posthogClient.capture('event_name', { properties });
```

### 6. Performance Optimizations

**List Rendering**:
- Use `@shopify/flash-list` (already installed)
- Implement `getItemLayout`, `renderItem`
- Use stable keys (not index or `Date.now()`)

**Animations**:
- Use Reanimated worklets for UI thread animations
- `useSharedValue` for animated values
- `useAnimatedStyle` for animated styles

**InteractionManager**:
- Defer heavy computations until after user interactions
```typescript
import { runAfterInteractions } from '@/utils/interactionManager';

runAfterInteractions(() => {
  heavyComputation();
});
```

**Bundle Optimization**:
- Code splitting enabled in Metro config
- Turbo Modules enabled
- Hermes with mmap enabled on Android

### 7. Accessibility

**Implemented**:
- `accessibilityLabel` on all interactive elements
- `accessibilityRole` (button, text, alert)
- `accessibilityHint` for additional context
- `accessibilityState` for disabled/loading states
- `accessibilityLiveRegion="polite"` for toasts

**Best Practices**:
- Minimum touch target size (48x48)
- Sufficient color contrast
- Screen reader support via Role and Label props

### 8. Error Handling

**ErrorBoundary** (class component):
- Catches React component errors
- Provides user-friendly fallback UI
- Recovery options: Try Again, Go Home
- Fallback navigation if back fails

**Global Error Tracking**:
- PostHog captures exceptions
- Context and tags for categorization
- Development logging

### 9. Form Handling

**React Hook Form + Valibot**:
```typescript
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: valibotResolver(schema),
});
```

**Validation**:
- Type-safe schemas using Valibot
- Real-time validation
- Error display per field

### 10. Internationalization

**i18next**:
```typescript
// Available namespaces
import { useTranslation } from 'react-i18next';

const { t } = useTranslation('screens');
```

**Supported Languages**:
- English (en)

**Namespaces**:
- common, screens, date, error_boundary

### 11. Development Workflow

**Git Hooks (Lefthook)**:
```yaml
pre-commit:
  parallel: true
  commands:
    format: bunx ultracite format
    lint: bunx @biomejs/biome check .
    typecheck: bun run typecheck
```

**Scripts**:
```json
{
  "start": "expo start",
  "android": "expo run:android",
  "ios": "expo run:ios",
  "lint": "bunx @biomejs/biome check .",
  "typecheck": "tsc --noEmit",
  "analyze:bundle": "bunx expo export --platform ios && npx source-map-explorer dist/main.js"
}
```

## Best Practices

### Component Development
1. Use functional components with TypeScript
2. Wrap all exported components with `memo`
3. Use `forwardRef` when refs are needed
4. Use CVA for variant-based components
5. Extract common patterns into custom hooks

### State Management
1. Use Zustand for global state
2. Keep selectors atomic (select only needed data)
3. Persist to MMKV for user preferences
4. Avoid prop drilling - use Zustand or Context

### Performance
1. Use `FlashList` instead of `ScrollView` for lists
2. Implement `getItemLayout` when item sizes are known
3. Use stable keys for lists (not index)
4. Memoize expensive computations with `useMemo`
5. Use `useCallback` for event handlers
6. Defer heavy work with `InteractionManager`
7. Use Reanimated worklets for smooth animations

### Accessibility
1. Add `accessibilityLabel` to all interactive elements
2. Set appropriate `accessibilityRole`
3. Use `accessibilityState` for disabled/loading states
4. Announce dynamic content with `accessibilityLiveRegion`
5. Ensure sufficient touch target sizes (min 44x44)
6. Test with VoiceOver (iOS) and TalkBack (Android)

### Code Quality
1. Run `bun run lint` before committing
2. Run `bun run typecheck` to catch type errors
3. Follow Biome formatting rules
4. Write tests for utility functions and hooks
5. Aim for 70% test coverage

## Build Configuration

**Expo** (app.json):
- New Architecture: `true`
- Hermes: `hermes`
- Turbo Modules: `turboModuleAttribute: true`
- Typed Routes: `true`

**Metro** (metro.config.js):
- Inline requires: `true`
- Code splitting: `true`
- CPU-based worker count
- Custom source extensions for SQL

**TypeScript** (tsconfig.json):
- Strict mode enabled
- Path aliases: `@/*` -> `./src/*`
- No implicit any
- Strict null checks

## Deployment

**iOS Build**:
```bash
bun run ios
```

**Android Build**:
```bash
bun run android
```

**Production Bundle Analysis**:
```bash
bun run analyze:bundle
```

## Performance Targets

- **Startup Time (TTI)**: < 2 seconds
- **FPS**: Maintain 60 FPS during animations
- **Bundle Size**: Minimize via tree shaking and code splitting
- **Memory**: No leaks, proper cleanup in useEffect
- **Re-renders**: Minimize unnecessary re-renders via memo and selective state

## Security Considerations

- Avoid hardcoded encryption keys; use platform keychain/secure storage for secrets
- Never commit `.env` files
- Use PostHog for error tracking (no secrets in logs)
- Validate all inputs using Valibot schemas
- Secure bundle IDs in production

## Future Enhancements

1. Add Storybook for component documentation
2. Implement E2E tests with Detox
3. Add performance monitoring with react-native-performance
4. Implement crash-free updates
5. Add offline support with service workers
