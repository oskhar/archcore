# Tasks: Setup TurboRepo for Hybrid Architecture

**Input**: Design documents from `/specs/009-scs-hybrid-setup-turbo/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Infrastructure validation tasks are included to verify the monorepo setup.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for the hybrid monorepo.

- [ ] T001 Create the `hybrid/` root directory and initial subdirectories `apps/` and `packages/`.
- [ ] T002 Initialize `hybrid/package.json` with the name `@archkit/hybrid-root` and `packageManager` field.
- [ ] T003 [P] Create `hybrid/.gitignore` with Node.js and TurboRepo patterns.
- [ ] T004 [P] Create `hybrid/README.md` with monorepo usage instructions.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core TurboRepo and Workspace configuration that MUST be complete before user stories.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T005 Configure `hybrid/turbo.json` with `build`, `test`, `lint`, and `dev` pipelines.
- [ ] T006 Define `workspaces` in `hybrid/package.json` to include `apps/*` and `packages/*`.
- [ ] T007 Add root-level scripts for `build`, `test`, and `lint` in `hybrid/package.json` that delegate to `turbo`.

**Checkpoint**: Foundation ready - TurboRepo is configured and workspaces are defined.

---

## Phase 3: User Story 1 - Monorepo Management (Priority: P1) 🎯 MVP

**Goal**: Manage multiple microservices within a single repository using TurboRepo for efficient orchestration.

**Independent Test**: Create a placeholder app and verify `npx turbo build` orchestrates the task and caches the result.

### Implementation for User Story 1

- [ ] T008 [P] [US1] Create a placeholder service in `hybrid/apps/ping-service/` with a basic `package.json`.
- [ ] T009 [P] [US1] Create a dummy source file in `hybrid/apps/ping-service/src/index.ts`.
- [ ] T010 [US1] Verify first-run `npx turbo build` from `hybrid/` results in a cache miss.
- [ ] T011 [US1] Verify second-run `npx turbo build` from `hybrid/` results in a cache hit (FULL TURBO).

**Checkpoint**: User Story 1 is functional - TurboRepo successfully manages and caches workspace tasks.

---

## Phase 4: User Story 2 - Shared Build Configuration (Priority: P2)

**Goal**: Define shared build, lint, and test configurations to maintain consistent quality standards.

**Independent Test**: Verify that the placeholder service can use shared configurations from `packages/`.

### Implementation for User Story 2

- [ ] T012 [P] [US2] Create `@archkit/tsconfig` package in `hybrid/packages/tsconfig/` with `base.json` and `nestjs.json`.
- [ ] T013 [P] [US2] Create `@archkit/eslint-config` package in `hybrid/packages/eslint-config/` with `index.js`.
- [ ] T014 [US2] Update `hybrid/apps/ping-service/package.json` to include shared configs as devDependencies (using `workspace:*`).
- [ ] T015 [US2] Verify `npx turbo lint` and `npx turbo test` work across the monorepo using the shared infrastructure.

**Checkpoint**: User Story 2 is functional - shared configurations are successfully used across workspaces.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and cleanup.

- [ ] T016 [P] Verify final directory structure matches `plan.md`.
- [ ] T017 Run `npx turbo build lint test` one last time to ensure everything is cached and passing.
- [ ] T018 [P] Update `specs/009-scs-hybrid-setup-turbo/tasks.md` to mark all tasks as complete.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1.
- **User Story 1 (Phase 3)**: Depends on Phase 2.
- **User Story 2 (Phase 4)**: Depends on Phase 3 (needs the placeholder app from US1 to verify shared configs).
- **Polish (Phase 5)**: Depends on all previous phases.

### Parallel Opportunities

- T003 and T004 in Phase 1.
- T008 and T009 in Phase 3.
- T012 and T013 in Phase 4.
- T016 and T018 in Phase 5.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

Focus on getting the `hybrid/` directory initialized and TurboRepo building a single app with caching.

### Incremental Delivery

1. Foundation (Phase 1 & 2)
2. Basic Monorepo Orchestration (Phase 3 - US1)
3. Shared Standards (Phase 4 - US2)
4. Final Validation (Phase 5)
