# Feature Specification: Relocate Hybrid TurboRepo

**Feature Branch**: `010-scs-hybrid-relocate-turbo`
**Created**: 2026-03-26
**Status**: Draft
**Input**: User description: "undo setup-turbo in root directory, delete ./hybrid and create ./apps/hybrid"

## User Scenarios & Testing

### User Story 1 - Relocated Monorepo (Priority: P1)

As a Developer, I want the hybrid architecture monorepo to be located within `apps/hybrid/` instead of the repository root so that the root remains clean and architecture implementations are consistently nested.

**Independent Test**:
Verify that `apps/hybrid/turbo.json` and `apps/hybrid/package.json` exist and that TurboRepo commands work from the new directory.

**Acceptance Scenarios**:

1. **Given** the current root-level `hybrid/` directory, **When** I move its contents to `apps/hybrid/`, **Then** the root `hybrid/` directory is removed.
2. **Given** the relocated structure, **When** I run `npm run build` from `apps/hybrid/`, **Then** TurboRepo correctly orchestrates the build for services within that subdirectory.

## Requirements

- **FR-001**: Move all contents of the current `hybrid/` folder to `apps/hybrid/`.
- **FR-002**: Update any internal paths or configurations that might rely on the relative location.
- **FR-003**: Ensure the `packageManager` field and workspaces in `apps/hybrid/package.json` still point correctly to `apps/*` and `packages/*` relative to the new root.

## Success Criteria

- **SC-001**: `hybrid/` folder at the root is deleted.
- **SC-002**: `apps/hybrid/` contains the full TurboRepo setup.
- **SC-003**: `npx turbo build` works from `apps/hybrid/`.
