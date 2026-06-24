# Infrastructure Contracts: Task Interface

## Overview
This document defines the common task interface that all microservices (`apps/`) and shared libraries (`packages/`) must implement to participate in the TurboRepo-managed build pipeline.

## Task Requirements

| Task | package.json Script | Purpose | Expected Output |
|------|--------------------|---------|-----------------|
| `build` | `npm run build` | Compiles source to JS | `dist/` directory (if applicable) |
| `lint` | `npm run lint` | Runs static analysis | Exit code 0 on success |
| `test` | `npm run test` | Runs unit/integration tests | Exit code 0 on success |

## Implementation Rules

1. **Naming**: Every workspace package MUST define `build`, `lint`, and `test` scripts.
2. **Idempotency**: Tasks SHOULD be idempotent where possible to leverage TurboRepo caching.
3. **Internal Dependencies**: Packages MUST use the workspace protocol (e.g., `"dependency": "workspace:*"`).
4. **Configuration**: Use the shared `@archkit/tsconfig` and `@archkit/eslint-config` as bases to maintain consistency.
