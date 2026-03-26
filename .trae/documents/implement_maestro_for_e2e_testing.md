# Plan: Implement Maestro for E2E Testing

## Overview

Add Maestro E2E testing framework to this React Native + Expo project for mobile UI testing.

## Project Context

- **Framework**: React Native 0.83.2 + Expo SDK 55
- **Navigation**: Expo Router (file-based routing)
- **Existing Testing**: Jest + React Testing Library (unit tests)
- **Screens Available**:
  - `(tabs)/index.tsx` - Tab home screen
  - `(tabs)/tab2.tsx` - Tab 2 screen
  - `(stacks)/stack1.tsx` - Stack screen
  - `(modals)/modal1.tsx` - Modal screen

## Implementation Steps

### Step 1: Install Maestro CLI as Dev Dependency

Add `maestro` CLI tool to enable running flows from command line.

**Command**: `npm install -D @maestro-cli/maestro`

### Step 2: Create Maestro Configuration File

Create `maestro.yaml` in project root:

```yaml
appId: ${APP_ID}  # From environment or config
platform: both    # iOS and Android
flowDir: e2e/flows
outputDir: e2e/results
```

### Step 3: Create E2E Flows Directory Structure

Create directory: `e2e/flows/`

### Step 4: Create Sample E2E Flow Files

Create initial flows to test navigation:

1. **`e2e/flows/onboarding.yaml`** - Tests app launch and splash screen
2. **`e2e/flows/tab_navigation.yaml`** - Tests tab navigation between screens
3. **`e2e/flows/stack_navigation.yaml`** - Tests stack navigation
4. **`e2e/flows/modal.yaml`** - Tests modal presentation

### Step 5: Add NPM Scripts to package.json

Add the following scripts:

```json
{
  "e2e": "maestro test e2e/flows",
  "e2e:ios": "maestro test e2e/flows --platform ios",
  "e2e:android": "maestro test e2e/flows --platform android",
  "e2e:record": "maestro record --output e2e/flows"
}
```

### Step 6: Create maestro env configuration

Create `.env.maestro` with `APP_ID` placeholder:
```
APP_ID=com.yourcompany.yourapp
```

### Step 7: Create Gitignore Entry for E2E Results

Add to `.gitignore`:
```
e2e/results/
```

## File Changes Summary

| File | Action |
|------|--------|
| `package.json` | Add maestro dependency and scripts |
| `maestro.yaml` | Create Maestro configuration |
| `e2e/flows/onboarding.yaml` | Create sample flow |
| `e2e/flows/tab_navigation.yaml` | Create sample flow |
| `e2e/flows/stack_navigation.yaml` | Create sample flow |
| `e2e/flows/modal.yaml` | Create sample flow |
| `.env.maestro` | Create env file |
| `.gitignore` | Add e2e/results exclusion |

## Verification Steps

1. Install dependencies: `npm install`
2. Run E2E tests: `npm run e2e:ios` (requires iOS simulator running)
3. Verify flows execute without errors

## Notes

- Maestro uses YAML-based flow definitions that can also be recorded using `maestro record`
- Flows use selectors like `tapOnElement`, `assertVisible`, `scrollUntilVisible`
- App must be built and installed on simulator/device before running flows
- For CI/CD, use `maestro cloud` to upload flows to Maestro Cloud
