# Quickstart: Relocated Hybrid Monorepo

## Overview
This feature relocates the TurboRepo-powered monorepo from `hybrid/` (root) to `apps/hybrid/`.

## Local Setup

### 1. Prerequisites
- **Node.js**: 20.x
- **NPM**: 7+ (for Workspaces support)

### 2. Initialization
From the repository root:
```bash
# Navigate to the NEW hybrid subdirectory
cd apps/hybrid/

# Install dependencies (setup symlinks for workspaces)
npm install
```

## Running Tasks (from `apps/hybrid/`)

### Build all services
```bash
npx turbo build
```

### Run tests in parallel
```bash
npx turbo test
```

### Run linting across the monorepo
```bash
npx turbo lint
```

## Adding a New Service

1. Create a new directory in `apps/hybrid/apps/`.
2. Initialize a `package.json` with `build`, `test`, and `lint` scripts.
3. Add `@archkit/tsconfig` and `@archkit/eslint-config` as devDependencies.
4. TurboRepo will automatically detect the new service based on the `apps/hybrid/package.json` workspaces glob.
