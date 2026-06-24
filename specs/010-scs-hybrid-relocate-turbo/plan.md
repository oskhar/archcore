# Implementation Plan: Relocate Hybrid TurboRepo

**Branch**: `010-scs-hybrid-relocate-turbo` | **Date**: 2026-03-26 | **Spec**: [specs/010-scs-hybrid-relocate-turbo/spec.md](spec.md)
**Input**: "undo setup-turbo in root directory, delete ./hybrid and create ./apps/hybrid"

## Summary

Relocate the entire TurboRepo-powered hybrid architecture setup from the root `hybrid/` folder to `apps/hybrid/`. This preserves the monorepo structure but places it deeper within the project hierarchy to keep the root clean and maintain consistency with other architecture implementations.

## Technical Context

**Language/Version**: TypeScript 5.7 / Node.js 20+
**Primary Dependencies**: TurboRepo, NPM Workspaces
**Storage**: N/A
**Testing**: TurboRepo task orchestration in the new location.
**Target Platform**: Linux/Docker
**Project Type**: Monorepo/Infrastructure
**Performance Goals**: N/A
**Constraints**: Must maintain SCS discipline and experiment integrity.
**Scale/Scope**: Relocation of infrastructure files.

## Constitution Check

| Gate | Status | Rationale |
|------|--------|-----------|
| **Experiment Integrity** | PASS | Relocation does not change the functionality or complexity of the implementation, only its physical location. |
| **SCS Discipline** | PASS | This SCS is limited to the relocation of the hybrid monorepo structure. |
| **Architecture Parity** | PASS | Does not affect the comparison between architectures. |
| **Vertical Slice** | PASS | Structure remains the same, just moved. |
| **Measurable Complexity** | PASS | Relocation might slightly affect path complexity but is still measurable. |

## Project Structure

### Documentation (this feature)

```text
specs/010-scs-hybrid-relocate-turbo/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/
├── monolith/            # (Existing)
└── hybrid/              # (NEW LOCATION)
    ├── turbo.json
    ├── package.json
    ├── apps/            # Microservices
    └── packages/         # Shared configurations
```

**Structure Decision**: Move `hybrid/*` to `apps/hybrid/*`. The internal structure of the `hybrid` monorepo (its own `apps/` and `packages/` folders) will be preserved.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | | |
