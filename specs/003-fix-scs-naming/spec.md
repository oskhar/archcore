# Feature Specification: SCS Naming Compliance for Production Docker

**Feature Branch**: `003-fix-scs-naming`  
**Created**: 2026-03-25  
**Status**: Draft  
**Input**: User description: "Rename branch/references to match scs-baseline--production-docker and scs-hybrid--production-docker (or similar compliant pattern)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Automated Metric Collection (Priority: P1)

As an Experiment Lead, I want all feature branches to follow the `scs-[arch]--[feature]` naming convention so that automated scripts can correctly categorize commits and measure development complexity as required by Principle V of the Constitution.

**Why this priority**:
Compliance with the Constitution is non-negotiable and critical for the integrity of the experiment's data collection.

**Independent Test**:
Can be tested by running a validation script that checks the current branch name against the regex `^scs-(baseline|hybrid)--[a-z0-9-]+$`.

**Acceptance Scenarios**:

1. **Given** the current branch is `scs-hybrid--production-docker`, **When** the renaming process is complete, **Then** the branch name matches the mandated pattern.
2. **Given** the feature documentation (spec.md, plan.md), **When** inspected, **Then** all internal references to the branch name reflect the new compliant name.

---

### User Story 2 - Documentation Consistency (Priority: P2)

As a Developer, I want all specification and plan documents to reference the correct, compliant branch names so that there is no confusion when navigating the codebase.

**Why this priority**:
Ensures that the documentation remains a "source of truth" and aligns with the actual repository state.

**Independent Test**:
Perform a grep search for the old branch name (`scs-hybrid--production-docker`) across the `specs/` directory and ensure zero results.

**Acceptance Scenarios**:

1. **Given** a specification file, **When** the "Feature Branch" field is checked, **Then** it contains the compliant name.

## Edge Cases

- **Cross-Architecture Branches**: If a single feature (like Docker hardening) affects both architectures, how should it be named? (Assumption: Split into two branches or use a specific "baseline" vs "hybrid" suffix).
- **Existing Git History**: How to handle existing commits on the non-compliant branch? (Assumption: Rename the branch in-place or create new compliant branches).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST rename the `scs-hybrid--production-docker` branch to a compliant name (e.g., `scs-hybrid--production-docker` or as split).
- **FR-002**: System MUST update all `spec.md`, `plan.md`, and `tasks.md` files in the feature directory to use the new branch name.
- **FR-003**: System MUST update the `GEMINI.md` file (project context) to reflect the new branch name.
- **FR-004**: System MUST ensure that the new branch name follows the pattern: `scs-[arch]--[feature-slug]`.

### Key Entities *(include if feature involves data)*

- **Branch Name**: The string identifier for the Git branch, strictly governed by the Constitution.
- **SCS (Smallest Change Set)**: The unit of work being renamed.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of branch-related identifiers in the codebase match the Constitution's naming rules.
- **SC-002**: Automated validation scripts (if any) pass with zero naming violations for this feature.
- **SC-003**: Zero references to the old `002-` prefix remain in active documentation.

## Assumptions

- **SCS Split**: It is assumed that the work in `scs-hybrid--production-docker` will be categorized under the appropriate architecture prefix (e.g., `scs-hybrid--...`).
- **In-place Renaming**: The preferred method is renaming the existing branch to preserve commit history, unless a split is required by the Constitution.
- **Feature Identifier**: The slug `production-docker` is a suitable replacement for the descriptive part of the name.
