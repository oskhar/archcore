# Tasks: scs-hybrid--product-service

**Input**: Design documents from `/specs/014-scs-hybrid--product-service/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/

**Tests**: Test tasks are included as verification steps for each user story phase.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 [P] Ensure all dependencies are present (@nestjs/cqrs, @nestjs/microservices, kafkajs, zod) in apps/hybrid/apps/product-service/package.json
- [X] T002 Configure Kafka Microservice in apps/hybrid/apps/product-service/src/main.ts
- [X] T003 [P] Setup ZodValidationPipe for input validation in apps/hybrid/apps/product-service/src/interface/common/pipes/zod-validation.pipe.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Create BaseEntity with audit columns (id, createdAt, updatedAt) in apps/hybrid/apps/product-service/src/domain/base.entity.ts
- [X] T005 [P] Setup Kafka client module for event publishing in apps/hybrid/apps/product-service/src/infrastructure/kafka.module.ts
- [X] T006 Configure TypeORM with mysql-product connection in apps/hybrid/apps/product-service/src/app.module.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Product CRUD (Priority: P1) 🎯 MVP

**Goal**: Enable creation, retrieval, update, and deletion of products with Kafka event notifications.

**Independent Test**: Perform CRUD via api-gateway and verify persistence in mysql-product and events in redpanda.

### Implementation for User Story 1

- [X] T007 [P] [US1] Define Product entity in apps/hybrid/apps/product-service/src/domain/product.entity.ts
- [X] T008 [P] [US1] Define CreateProductCommand and handler in apps/hybrid/apps/product-service/src/application/product/commands/create-product.handler.ts
- [X] T009 [P] [US1] Define UpdateProductCommand and handler in apps/hybrid/apps/product-service/src/application/product/commands/update-product.handler.ts
- [X] T010 [P] [US1] Define DeleteProductCommand and handler in apps/hybrid/apps/product-service/src/application/product/commands/delete-product.handler.ts
- [X] T011 [P] [US1] Define GetProductByIdQuery and handler in apps/hybrid/apps/product-service/src/application/product/queries/get-product-by-id.handler.ts
- [X] T012 [P] [US1] Define GetAllProductsQuery and handler in apps/hybrid/apps/product-service/src/application/product/queries/get-all-products.handler.ts
- [X] T013 [US1] Implement ProductController with REST endpoints in apps/hybrid/apps/product-service/src/interface/product.controller.ts
- [X] T014 [US1] Register CQRS handlers and Entity in apps/hybrid/apps/product-service/src/app.module.ts
- [X] T015 [US1] Update api-gateway to route /products requests to product-service in apps/hybrid/apps/api-gateway/src/app.module.ts and products.controller.ts

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T016 [P] Add Zod schemas for Product validation in apps/hybrid/apps/product-service/src/domain/product.schema.ts
- [X] T017 Implement basic error handling and logging in apps/hybrid/apps/product-service/src/interface/product.controller.ts
- [X] T018 Run verification tests from quickstart.md using curl to confirm end-to-end functionality

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on User Story 1 completion

### Parallel Opportunities

- T001, T003 can run in parallel
- T005, T007-T012 can run in parallel within their phases
- Once Foundation (Phase 2) is complete, all story implementation tasks can proceed in parallel (if staffed)

---

## Parallel Example: User Story 1

```bash
# Handlers can be developed independently:
Task: "Define CreateProductCommand and handler in apps/hybrid/apps/product-service/src/application/product/commands/create-product.handler.ts"
Task: "Define GetProductByIdQuery and handler in apps/hybrid/apps/product-service/src/application/product/queries/get-product-by-id.handler.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (The core feature)
4. **STOP and VALIDATE**: Test User Story 1 via api-gateway
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational -> Foundation ready
2. Add User Story 1 -> Test independently -> Deploy/Demo (MVP!)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
