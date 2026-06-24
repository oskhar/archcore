# Implementation Plan: SCS Naming Compliance for Production Docker

**Branch**: `003-fix-scs-naming` | **Date**: 2026-03-25 | **Spec**: `/specs/003-fix-scs-naming/spec.md`
**Input**: Feature specification from `/specs/003-fix-scs-naming/spec.md`

## Summary

This feature corrects a critical Constitution violation by renaming the non-compliant branch `scs-hybrid--production-docker` to `scs-hybrid--production-docker`. The technical approach involves performing a Git branch rename, updating all metadata strings in documentation, and renaming the feature specification directory to maintain consistency across the project.

## Technical Context

**Language/Version**: Bash / Git  
**Primary Dependencies**: Git, Speckit CLI, `commitizen` (`cz-customizable` suggested)  
**Storage**: N/A (Repository Metadata)  
**Testing**: Regex-based branch validation, `grep` search across documentation  
**Target Platform**: Linux / Git Repository (Remote: `git@github.com:oskhar/archkit.git`)  
**Project Type**: Infrastructure / Maintenance  
**Performance Goals**: Atomic, SCS-compliant commits  
**Constraints**: Rename must preserve history; references in `GEMINI.md` must be updated; **`git cz` mandatory for all commits.**  
**Scale/Scope**: 1 branch, ~10 documentation files, 1 configuration file (`.czrc`)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **✅ Experiment Integrity**: Corrects metadata to enable accurate metric collection (Principle V).
- **✅ SCS Discipline**: This is a dedicated SCS branch for fixing naming (`003-fix-scs-naming`).
- **✅ Architecture Parity**: Does not affect the business logic of either architecture.
- **✅ Vertical Slice Domain Ownership**: Domain boundaries remain unchanged.
- **✅ Measurability**: Enables automated metric tracking by using the mandated prefix and `commitizen`.

## Project Structure

### Documentation (this feature)

```text
specs/003-fix-scs-naming/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A for this feature)
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
infrastructure/          # Existing directories
specs/
└── scs-hybrid--production-docker/  # Renamed from scs-hybrid--production-docker
GEMINI.md                # Project context file
```

**Structure Decision**: The primary changes are in the `specs/` and Git metadata. A new feature directory `specs/003-fix-scs-naming/` is created temporarily to manage this rename.

## Complexity Tracking

*No constitution violations detected.*
