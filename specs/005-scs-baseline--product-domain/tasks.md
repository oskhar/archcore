# Tasks: scs-baseline--product-domain

**Input**: Design documents from `/specs/005-scs-baseline--product-domain/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: The tasks below include test tasks as requested in `spec.md` and `quickstart.md`.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for the product domain

- [X] T001 Create `apps/monolith/src/product` directory structure (dto, entities)
- [X] T002 [P] Create initial `apps/monolith/src/product/product.module.ts` (empty)
- [X] T003 [P] Register `ProductModule` in `apps/monolith/src/app.module.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 [P] Create `Product` entity in `apps/monolith/src/product/entities/product.entity.ts` inheriting from `BaseEntity`
- [X] T005 [P] Implement Zod validation schema for Product in `apps/monolith/src/product/dto/product.schema.ts`
- [X] T006 [P] Define `CreateProductDto` and `UpdateProductDto` in `apps/monolith/src/product/dto/` using Zod schemas

**Checkpoint**: Foundation ready - product entity and validation are defined.

---

## Phase 3: User Story 1 - Product CRUD (Priority: P1) 🎯 MVP

**Goal**: Implement full CRUD operations for the Product domain in the monolith.

**Independent Test**: Successfully execute the example request in `quickstart.md` and verify database persistence.

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T007 [P] [US1] Create unit tests for `ProductService` in `apps/monolith/src/product/product.service.spec.ts`
- [X] T008 [P] [US1] Create integration tests for `ProductController` in `apps/monolith/src/product/product.controller.spec.ts`

### Implementation for User Story 1

- [X] T009 [US1] Implement `ProductService` for basic CRUD operations in `apps/monolith/src/product/product.service.ts`
- [X] T010 [US1] Implement `ProductController` with REST endpoints in `apps/monolith/src/product/product.controller.ts`
- [X] T011 [US1] Configure `TypeOrmModule.forFeature([Product])` in `apps/monolith/src/product/product.module.ts`
- [X] T012 [US1] Integrate Zod validation pipe in `ProductController` endpoints
- [X] T013 [US1] Verify API endpoints via `npm test src/product` as specified in `quickstart.md`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T014 [P] Update `apps/monolith/README.md` with Product API documentation
- [X] T015 [P] Ensure all files follow project linting/formatting rules (`npm run lint`)
- [X] T016 Run `quickstart.md` validation to ensure full compliance with requirements

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS US1.
- **User Stories (Phase 3)**: Depends on Foundational phase completion.
- **Polish (Final Phase)**: Depends on US1 completion.

### Parallel Opportunities

- T002 and T003 can be done in parallel.
- T004, T005, and T006 can be done in parallel.
- T007 and T008 can be done in parallel.
- T014 and T015 can be done in parallel.

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Create unit tests for ProductService in apps/monolith/src/product/product.service.spec.ts"
Task: "Create integration tests for ProductController in apps/monolith/src/product/product.controller.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Run `npm test src/product` and verify manual CRUD.

### Incremental Delivery

1. Setup + Foundational → Foundation ready.
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!).
3. Polish and final documentation.

---

## Notes

- Every task is focused on the `apps/monolith` scope.
- `BaseEntity` is used for audit columns as per `data-model.md`.
- `decimal(10,2)` is used for price as per `research.md`.
- All DTOs MUST use Zod for validation to maintain architecture parity.
