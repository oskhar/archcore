# Tasks: Setup NestJS for Hybrid Microservices

**Input**: Design documents from `/specs/011-scs-hybrid-setup-nestjs/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Verification tasks include CQRS command handling and health check endpoint validation.

**Organization**: Tasks are grouped by user story (US1) to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the base microservice structure within the hybrid monorepo.

- [X] T001 [US1] Initialize `product-service` in `apps/hybrid/apps/product-service/` using `npx nest new`
- [X] T002 [US1] Remove unnecessary boilerplate files (app.controller.spec.ts, app.service.ts) from `apps/hybrid/apps/product-service/src/`
- [X] T003 [P] [US1] Update `apps/hybrid/apps/product-service/tsconfig.json` to extend `@archkit/tsconfig`
- [X] T004 [P] [US1] Update `apps/hybrid/apps/product-service/eslint.config.mjs` to extend `@archkit/eslint-config`
- [X] T005 [US1] Install dependencies `@nestjs/cqrs`, `zod`, `@nestjs/typeorm`, `typeorm`, `mysql2` in `apps/hybrid/apps/product-service/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish core patterns (CQRS and Validation) required for hybrid services.

- [X] T006 [US1] Create the domain-driven directory structure (`domain/`, `application/`, `infrastructure/`, `interface/`) in `apps/hybrid/apps/product-service/src/`
- [X] T007 [US1] Implement `ZodValidationPipe` in `apps/hybrid/apps/product-service/src/interface/common/pipes/zod-validation.pipe.ts` (replicate monolith parity)
- [X] T008 [US1] Configure `CqrsModule` in `apps/hybrid/apps/product-service/src/app.module.ts`

**Checkpoint**: Foundation ready - the service is structured and ready for domain logic.

---

## Phase 3: User Story 1 - Base NestJS Microservice (Priority: P1) 🎯 MVP

**Goal**: Verify the NestJS + CQRS baseline with a functional command and health check.

**Independent Test**: Execute `GET /health` and verify architecture is `"hybrid"` and CQRS is enabled.

### Implementation for User Story 1

- [X] T009 [US1] Implement `HealthController` in `apps/hybrid/apps/product-service/src/interface/health.controller.ts` per contract
- [X] T010 [P] [US1] Define `PingCommand` in `apps/hybrid/apps/product-service/src/application/ping/ping.command.ts`
- [X] T011 [P] [US1] Implement `PingHandler` in `apps/hybrid/apps/product-service/src/application/ping/ping.handler.ts`
- [X] T012 [US1] Add `PingHandler` to `providers` in `apps/hybrid/apps/product-service/src/app.module.ts`
- [X] T013 [US1] Implement `PingController` in `apps/hybrid/apps/product-service/src/interface/ping.controller.ts` to dispatch `PingCommand`
- [X] T014 [US1] Verify `npx turbo build --filter=product-service` completes successfully from `apps/hybrid/` root

**Checkpoint**: User Story 1 is functional - NestJS microservice baseline with CQRS is verified.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and documentation updates.

- [X] T015 [P] Verify `product-service` follows the directory structure defined in `data-model.md`
- [X] T016 [P] Update `apps/hybrid/README.md` with instructions for running the newly created service
- [X] T017 Run final verification of the `/health` endpoint across the hybrid stack

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 completion.
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion.
- **Polish (Phase 4)**: Depends on all previous phases.

### Parallel Opportunities

- T003 and T004 in Phase 1.
- T010 and T011 in Phase 3.
- T015 and T016 in Phase 4.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

The primary goal is to have a functional NestJS service that can handle a CQRS command and respond to a health check.

### Incremental Delivery

1. Initialize service and clean up boilerplate.
2. Apply shared monorepo configurations.
3. Establish DDD structure and CQRS module.
4. Implement and verify the health check and a sample ping command.
