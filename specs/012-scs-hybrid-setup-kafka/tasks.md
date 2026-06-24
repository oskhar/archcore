# Tasks: Setup Kafka for Hybrid Architecture

**Input**: Design documents from `/specs/012-scs-hybrid-setup-kafka/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Cross-service message verification via Kafka and health check accessibility.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the infrastructure and build pipeline prerequisites.

- [X] T001 Add Redpanda (Kafka-compatible) service to `infrastructure/docker/docker-compose.yml`
- [X] T002 Update `apps/hybrid/turbo.json` with `start:dev` task configuration including `dependsOn: ["^dev"]` and update root `package.json`
- [X] T003 [P] Add `kafkajs` and `@nestjs/microservices` to shared dependencies if applicable or plan for individual install

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Initialize the remaining microservices required for the hybrid stack.

- [X] T004 [P] Initialize `api-gateway` in `apps/hybrid/apps/api-gateway/` using the hybrid baseline
- [X] T005 [P] Initialize `inventory-service` in `apps/hybrid/apps/inventory-service/` using the hybrid baseline
- [X] T006 [P] Initialize `sales-service` in `apps/hybrid/apps/sales-service/` using the hybrid baseline
- [X] T007 [P] Apply shared configs (tsconfig, eslint) to `api-gateway` in `apps/hybrid/apps/api-gateway/`
- [X] T008 [P] Apply shared configs (tsconfig, eslint) to `inventory-service` in `apps/hybrid/apps/inventory-service/`
- [X] T009 [P] Apply shared configs (tsconfig, eslint) to `sales-service` in `apps/hybrid/apps/sales-service/`

**Checkpoint**: Core services initialized - ready for stack management and communication setup.

---

## Phase 3: User Story 2 - Full Hybrid Stack Management (Priority: P1) 🎯 MVP

**Goal**: Ensure all 4 microservices start successfully and are reachable.

**Independent Test**: Run `npm run start:dev` and verify 4 successful health check responses.

### Implementation for User Story 2

- [X] T010 [US2] Configure unique port 3000 in `apps/hybrid/apps/api-gateway/src/main.ts`
- [X] T011 [US2] Configure unique port 3002 in `apps/hybrid/apps/inventory-service/src/main.ts`
- [X] T012 [US2] Configure unique port 3003 in `apps/hybrid/apps/sales-service/src/main.ts`
- [X] T013 [P] [US2] Implement health check endpoint in `apps/hybrid/apps/api-gateway/src/interface/health.controller.ts`
- [X] T014 [P] [US2] Implement health check endpoint in `apps/hybrid/apps/inventory-service/src/interface/health.controller.ts`
- [X] T015 [P] [US2] Implement health check endpoint in `apps/hybrid/apps/sales-service/src/interface/health.controller.ts`
- [X] T016 [US2] Verify all 4 services start successfully via `npm run start:dev` from `apps/hybrid/`

**Checkpoint**: Stack management verified - all services are operational.

---

## Phase 4: User Story 1 - Event-Driven Communication with Kafka (Priority: P1)

**Goal**: Implement Kafka transport and verify cross-service messaging.

**Independent Test**: Verify connectivity event logged in `inventory-service` after triggering gateway diagnostic.

### Implementation for User Story 1

- [X] T017 [US1] Install `kafkajs` and `@nestjs/microservices` in all 4 hybrid microservices
- [X] T018 [US1] Configure Kafka Microservice listener in `apps/hybrid/apps/api-gateway/src/main.ts`
- [X] T019 [US1] Configure Kafka Microservice listener in `apps/hybrid/apps/product-service/src/main.ts`
- [X] T020 [US1] Configure Kafka Microservice listener in `apps/hybrid/apps/inventory-service/src/main.ts`
- [X] T021 [US1] Configure Kafka Microservice listener in `apps/hybrid/apps/sales-service/src/main.ts`
- [X] T022 [US1] Implement `DiagnosticsController` producer in `apps/hybrid/apps/api-gateway/src/interface/diagnostics.controller.ts`
- [X] T023 [US1] Implement `ConnectivityController` consumer in `apps/hybrid/apps/inventory-service/src/interface/connectivity.controller.ts`
- [X] T024 [US1] Verify successful message exchange via logs during `npm run start:dev`

**Checkpoint**: Kafka communication verified - hybrid architecture transport layer is functional.

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Final documentation and clean up.

- [X] T025 [P] Update `apps/hybrid/README.md` with Kafka infrastructure instructions
- [X] T026 [P] Ensure all health checks correctly report `"kafka": true` features status
- [X] T027 Run full stack validation using `quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion.
- **User Stories (Phase 3 & 4)**: All depend on Foundational phase completion.
  - Phase 3 (Stack Management) should be completed before Phase 4 (Kafka Communication) to ensure services are running.
- **Polish (Final Phase)**: Depends on all user stories being complete.

### Parallel Opportunities

- Initialization of the 3 new services (T004, T005, T006).
- Implementation of health checks (T013, T014, T015).
- Kafka installation across services (T017 can be done in parallel via workspace command).

---

## Implementation Strategy

### MVP First (User Story 2 Only)

Focus on getting all services initialized and running together in the TurboRepo pipeline.

### Incremental Delivery

1. Setup Redpanda and Turbo pipeline.
2. Bootstrap remaining services.
3. Verify the full stack starts and responds to HTTP requests.
4. Integrate Kafka transport and verify the first cross-service event.
