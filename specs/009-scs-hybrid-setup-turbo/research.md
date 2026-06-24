# Research: TurboRepo Setup for Hybrid Architecture

## Summary
Research focused on setting up an isolated TurboRepo environment within the `hybrid/` subdirectory to manage microservices without impacting the existing `monolith/` architecture.

## Decisions

### 1. TurboRepo Isolation
- **Decision**: Initialize TurboRepo and NPM Workspaces within the `hybrid/` folder.
- **Rationale**: The `spec.md` explicitly calls for isolation between the monolith and hybrid architectures. Placing the Turbo configuration and workspace root at `hybrid/` ensures that `apps/monolith/` remains outside the Turbo graph, avoiding unintended dependencies or shared state between architectures.
- **Alternatives Considered**: Root-level TurboRepo (rejected as it would violate architecture isolation principles).

### 2. Workspace Manager
- **Decision**: Use NPM Workspaces.
- **Rationale**: Aligns with the project's current use of NPM and the assumption in the feature specification. NPM Workspaces (available since v7) provide the necessary lifecycle management for internal dependencies.
- **Alternatives Considered**: PNPM (faster but adds new tooling dependency not currently in the stack).

### 3. Task Pipeline (turbo.json)
- **Decision**: Define a basic pipeline for `build`, `lint`, and `test`.
- **Rationale**:
    - `build`: Depends on `^build` (upstream dependencies) to ensure libraries are built before services.
    - `test`, `lint`: Can run in parallel with no dependencies.
    - Caching: All tasks will have caching enabled by default.

### 4. Shared Configurations
- **Decision**: Create internal packages for shared configuration.
- **Rationale**: Ensures SC-003 is met (100% of microservices share at least one base configuration file).
- **Packages**:
    - `@archkit/tsconfig`: Base TypeScript configurations.
    - `@archkit/eslint-config`: Shared ESLint rules.

## Research Tasks Completed
- [x] Verify TurboRepo version and availability via `npx`.
- [x] Confirm NPM Workspace syntax for `package.json`.
- [x] Determine folder structure for `apps/` and `packages/`.
