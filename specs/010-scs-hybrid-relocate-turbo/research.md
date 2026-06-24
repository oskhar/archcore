# Research: Relocate Hybrid TurboRepo

## Summary
Research focused on the impact of moving the hybrid monorepo root from the project root to `apps/hybrid/`.

## Decisions

### 1. Relocation Target
- **Decision**: Move the entire contents of `hybrid/` to `apps/hybrid/`.
- **Rationale**: The user wants to "undo setup-turbo in root directory" and place it in `apps/hybrid`. This aligns the hybrid architecture implementation with the existing `apps/monolith` structure.
- **Alternatives Considered**: Keeping it in the root (rejected as per user instruction).

### 2. Configuration Impact
- **Decision**: No major changes required for `turbo.json` and `package.json` internal paths, as the internal structure of the `hybrid` monorepo (its own `apps/` and `packages/`) is being moved together.
- **Rationale**: The `workspaces` in `hybrid/package.json` point to `apps/*` and `packages/*`, which are children of the `hybrid` folder. These relative paths remain correct when the whole folder is moved.

### 3. Cleanup
- **Decision**: Fully delete the root `hybrid/` folder after relocation.
- **Rationale**: Direct user requirement.

## Research Tasks Completed
- [x] Verify that `apps/` exists in the repository root.
- [x] Assess if `turbo.json` or `package.json` need path updates.
- [x] Review the effect on the `009-scs-hybrid-setup-turbo` plan and state.
