# Tasks: POS Architecture Complexity Benchmark

**Input**: Design documents from `/specs/000-pos-architecture-benchmark/`
**Prerequisites**: plan.md, spec.md


## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize monorepo and baseline tooling

* [ ] T001 Create monorepo structure (`apps/`, `packages/`, `infrastructure/`, `scripts/`)
* [ ] T002 Initialize root `package.json`, `tsconfig.json`, and workspace config
* [ ] T003 [P] Setup ESLint + Prettier config in root
* [ ] T004 [P] Setup TurboRepo config (`turbo.json`)
* [ ] T005 Setup base Docker config for MySQL and Kafka in `infrastructure/docker/`


## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infra for both architectures + metrics tracking

* [ ] T006 Setup MySQL schema base in `infrastructure/database/`
* [ ] T007 [P] Setup migration system (TypeORM config)
* [ ] T008 [P] Setup shared schema (Zod) in `packages/shared-schema/`
* [ ] T009 Setup shared domain types in `packages/shared-domain/`
* [ ] T010 Setup git hooks for metrics in `scripts/git-hooks/`
* [ ] T011 Implement metrics collector script in `scripts/metrics/collect.sh`
* [ ] T012 Implement metrics analyzer in `scripts/metrics/analyze.sh`
* [ ] T013 Setup logging and error handling baseline

**Checkpoint**: Semua SCS sudah bisa diukur


## Phase 3: User Story 1 - Product Domain (Priority: P1) 🎯 MVP

**Goal**: Implement product domain in both architectures

**Independent Test**:

* Create product
* Update product
* List product


### Implementation for Monolith (Baseline)

* [ ] T014 [US1] Initialize NestJS app in `apps/monolith-pos/`
* [ ] T015 [P] [US1] Create Product entity in `apps/monolith-pos/src/product/product.entity.ts`
* [ ] T016 [P] [US1] Create Product DTO (Zod) in `apps/monolith-pos/src/product/product.dto.ts`
* [ ] T017 [US1] Implement Product service in `apps/monolith-pos/src/product/product.service.ts`
* [ ] T018 [US1] Implement Product controller in `apps/monolith-pos/src/product/product.controller.ts`
* [ ] T019 [US1] Integrate with database (TypeORM config)


### Implementation for Hybrid

* [ ] T020 [US1] Initialize service in `apps/hybrid-product/`
* [ ] T021 [P] [US1] Create Product entity in `apps/hybrid-product/src/product.entity.ts`
* [ ] T022 [P] [US1] Create Product DTO (Zod)
* [ ] T023 [US1] Setup CQRS command for create/update product
* [ ] T024 [US1] Setup event for product created/updated
* [ ] T025 [US1] Integrate Kafka producer in product service
* [ ] T026 [US1] Setup query handler for product read
* [ ] T027 [US1] Integrate database


**Checkpoint**: Product domain fully working in both architectures


## Phase 4: User Story 2 - Inventory Domain (Priority: P2)

**Goal**: Implement stock management

**Independent Test**:

* Assign stock
* Update stock
* Query stock


### Monolith

* [ ] T028 [P] [US2] Create Inventory entity in `apps/monolith-pos/src/inventory/inventory.entity.ts`
* [ ] T029 [P] [US2] Create Inventory DTO
* [ ] T030 [US2] Implement Inventory service
* [ ] T031 [US2] Implement Inventory controller
* [ ] T032 [US2] Integrate with Product module


### Hybrid

* [ ] T033 [US2] Initialize service in `apps/hybrid-inventory/`
* [ ] T034 [P] [US2] Create Inventory entity
* [ ] T035 [P] [US2] Create Inventory DTO
* [ ] T036 [US2] Subscribe to Product events (Kafka consumer)
* [ ] T037 [US2] Implement CQRS commands for stock update
* [ ] T038 [US2] Emit inventory events
* [ ] T039 [US2] Setup query handler
* [ ] T040 [US2] Integrate database


**Checkpoint**: Inventory works independently


## Phase 5: User Story 3 - Sales Domain (Priority: P3)

**Goal**: Implement transaction system

**Independent Test**:

* Create transaction
* Reduce stock
* Record sales


### Monolith

* [ ] T041 [P] [US3] Create Sales entity in `apps/monolith-pos/src/sales/sales.entity.ts`
* [ ] T042 [P] [US3] Create Sales DTO
* [ ] T043 [US3] Implement Sales service
* [ ] T044 [US3] Implement Sales controller
* [ ] T045 [US3] Integrate with Inventory module


### Hybrid

* [ ] T046 [US3] Initialize service in `apps/hybrid-sales/`
* [ ] T047 [P] [US3] Create Sales entity
* [ ] T048 [P] [US3] Create Sales DTO
* [ ] T049 [US3] Implement CQRS command for transaction
* [ ] T050 [US3] Consume inventory events
* [ ] T051 [US3] Emit sales events
* [ ] T052 [US3] Setup query handler
* [ ] T053 [US3] Integrate database


**Checkpoint**: Full POS flow works


## Phase 6: User Story 4 - Hybrid Infrastructure (Priority: P1)

**Goal**: Ensure hybrid infra is stable and measurable

**Independent Test**:

* Event flows across services

* No message loss

* [ ] T054 [US4] Setup Kafka cluster in `infrastructure/kafka/`

* [ ] T055 [US4] Configure topic strategy

* [ ] T056 [US4] Implement base event contract in `packages/shared-domain/`

* [ ] T057 [US4] Setup retry + error handling for Kafka consumers

* [ ] T058 [US4] Validate event flow across services


## Phase 7: User Story 5 - Metrics Tracking (Priority: P1)

**Goal**: Capture development complexity

**Independent Test**:

* Metrics generated per branch

* [ ] T059 [US5] Implement git hook to capture commit timestamp

* [ ] T060 [US5] Track files changed via `git diff`

* [ ] T061 [US5] Track LOC delta

* [ ] T062 [US5] Track commit frequency

* [ ] T063 [US5] Generate report per SCS branch


## Phase 8: Polish & Validation

* [ ] T064 [P] Validate metrics consistency across branches
* [ ] T065 Ensure no cross-domain leakage
* [ ] T066 Validate parity between architectures
* [ ] T067 Run full experiment simulation
* [ ] T068 Document findings in `/docs/`


# Dependencies & Execution Order

### Critical Path

1. Phase 1 → Setup repo
2. Phase 2 → Metrics + infra
3. Phase 3 → Product (MVP)
4. Phase 4 → Inventory
5. Phase 5 → Sales
6. Phase 6 → Hybrid infra stabilization
7. Phase 7 → Metrics validation
