# Quickstart: Setup TurboRepo for Hybrid Architecture

## Overview
This feature establishes the TurboRepo-powered monorepo infrastructure for the hybrid architecture. It is isolated within the `hybrid/` subdirectory.

## Local Setup

### 1. Prerequisites
- **Node.js**: 20.x
- **NPM**: 7+ (for Workspaces support)

### 2. Initialization
From the repository root:
```bash
# Navigate to the hybrid subdirectory
cd hybrid/

# Install dependencies (will populate node_modules and setup symlinks for workspaces)
npm install
```

## Running Tasks

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

1. Create a new directory in `hybrid/apps/`.
2. Initialize a `package.json` with `build`, `test`, and `lint` scripts.
3. Add `@archkit/tsconfig` and `@archkit/eslint-config` as devDependencies.
4. TurboRepo will automatically detect the new service based on the `hybrid/package.json` workspaces glob.
