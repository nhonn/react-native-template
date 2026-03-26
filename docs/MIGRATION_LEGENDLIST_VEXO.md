# LegendList v3 + Vexo Migration

## Scope

- Removed `@shopify/flash-list`
- Added `@legendapp/list` pinned to `3.0.0-beta.43`
- Removed `posthog-react-native`
- Added `vexo-analytics`
- Replaced analytics implementation in `src/utils/analytics.ts`
- Added a shared LegendList wrapper in `src/components/common/LegendList.tsx`

## List Migration

The repository had no runtime `FlashList` components at migration time. List infrastructure was migrated by introducing a project-level `LegendList` wrapper with performance defaults:

- `recycleItems: true`
- `maintainVisibleContentPosition: true`

The wrapper is exported from `@/components/common` and should be used for all future virtualized list screens.

## Analytics Migration

### Environment Variables

- Removed:
  - `EXPO_PUBLIC_POSTHOG_API_KEY`
  - `EXPO_PUBLIC_POSTHOG_HOST`
- Added:
  - `EXPO_PUBLIC_VEXO_API_KEY`

### API Mapping

- `posthog.capture(event, props)` → `trackEvent(event, props)` → `customEvent(event, props)`
- `posthog.capture("$exception", props)` → `trackError({ ... })` → `customEvent("$exception", props)`
- `posthog.identify(userId)` → `identifyUser(userId)` → `identifyDevice(userId)`
- `posthog.reset()` → `resetUser()` → `identifyDevice(null)`
- `posthog.opt_in_capturing()` → `setTrackingEnabled(true)` → `enableTracking()`
- `posthog.opt_out_capturing()` → `setTrackingEnabled(false)` → `disableTracking()`

## Breaking Changes

- PostHog-specific env variables are no longer read.
- PostHog host configuration is removed.
- Any external code relying on direct PostHog client access must migrate to exported utility methods in `src/utils/analytics.ts`.
- `LegendList` should now be imported from `@/components/common` instead of directly from list libraries to preserve shared defaults.

## New Implementation Patterns

- Initialize analytics through `initAnalytics()` only.
- Track business events through `trackEvent(name, properties)`.
- Track handled exceptions through `trackError({ error, context, level, tags })`.
- Use `identifyUser`, `resetUser`, and `setTrackingEnabled` for identity and consent controls.
- Use shared `LegendList` wrapper for all new large lists.

## Validation Summary

- Unit tests passed:
  - `src/utils/__tests__/analytics.test.ts`
  - `src/components/common/__tests__/LegendList.test.tsx`
  - Existing test suite in `src/utils/__tests__/date.test.ts`
- Static checks passed:
  - `bun run typecheck`
  - `bun run lint`

## Platform Test Matrix

Run the following to validate on supported runtimes:

- iOS: `bun run ios`
- Android: `bun run android`
- Expo runtime: `bun start`

During device validation, verify:

- App startup still initializes analytics without crashes.
- Event tracking emits expected event names and properties.
- Identity and opt-in/opt-out flows toggle tracking behavior as expected.
- Any LegendList screen keeps smooth scrolling and stable item positions while appending/prepending data.
