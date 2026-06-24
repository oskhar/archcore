# Tasks: POS Architecture Complexity Benchmark

**Input**: Design documents from `/specs/000-pos-architecture-benchmark/`
**Prerequisites**: plan.md, spec.md, data-model.md, constitution.md
**Orchestration Branch**: `scs-global--development-planing`

## Phase 1: Setup & Foundational (Infrastructure)
**Purpose**: Baseline for metrics and core infrastructure. 

### SCS: Setup Turbo & Foundational Tooling (`scs-hybrid--setup-turbo`)
- [ ] T001 Initialize monorepo structure (`apps/`, `packages/`, `infrastructure/`, `scripts/`)
- [ ] T002 Initialize root `package.json`, `tsconfig.json`, and `turbo.json`
- [ ] T003 [P] Setup ESLint + Prettier root configuration
- [ ] T004 [P] Setup shared Zod schemas in `packages/shared-schema/`
- [ ] T005 [P] Setup shared domain types in `packages/shared-domain/`

### SCS: Metrics Implementation (`scs-global--metrics-setup`)
- [ ] T006 Implement git hooks to enforce atomic commits and no-squash policy in `scripts/git-hooks/`
- [ ] T007 Implement metrics collection script (JSON+CSV output) in `scripts/metrics/collect.sh`
- [ ] T008 Implement lead-time calculation logic in `scripts/metrics/analyze.sh`
- [ ] T009 Implement metrics reporting script in `scripts/metrics/report.sh`

## Phase 2: Baseline (Monolith) Implementation

### SCS: Setup NestJS & Database (`scs-baseline--setup-nestjs`, `scs-baseline--setup-database`)
- [ ] T010 Initialize Monolith NestJS app in `apps/monolith/`
- [ ] T011 [P] Setup base TypeORM configuration for Monolith in `apps/monolith/src/config/`
- [ ] T012 Setup Docker Compose for MySQL in `infrastructure/docker/docker-compose.yml`

### SCS: Product Domain (`scs-baseline--product-domain`)
- [ ] T013 [US1] Create Product entity and repository (Monolith) in `apps/monolith/src/product/product.entity.ts`
- [ ] T014 [US1] Implement Product service and controller (Monolith) in `apps/monolith/src/product/`

### SCS: Inventory Domain (`scs-baseline--inventory-domain`)
- [ ] T015 [US2] Create Inventory entity with audit log logic (Monolith) in `apps/monolith/src/inventory/inventory.entity.ts`
- [ ] T016 [US2] Implement Inventory service with negative stock warning (Monolith) in `apps/monolith/src/inventory/`

### SCS: Sales Domain (`scs-baseline--sales-domain`)
- [ ] T017 [US3] Create SalesTransaction and SalesItem entities (Monolith) in `apps/monolith/src/sales/`
- [ ] T018 [US3] Implement Sales service with "Last write wins" logic (Monolith) in `apps/monolith/src/sales/`

## Phase 3: Hybrid Architecture Implementation

### SCS: Setup Kafka & Database (`scs-hybrid--setup-kafka`, `scs-hybrid--setup-database`)
- [ ] T019 Setup Kafka cluster and topics strategy in `infrastructure/kafka/`
- [ ] T020 [P] Setup Hybrid API Gateway in `apps/hybrid/apps/api-gateway/`

### SCS: Product Service (`scs-hybrid--product-service`)
- [ ] T021 [US1] Initialize Hybrid Product service in `apps/hybrid/apps/product-service/`
- [ ] T022 [P] [US1] Create Product entity and CQRS commands (Hybrid) in `apps/hybrid/apps/product-service/src/`
- [ ] T023 [US1] Implement Kafka producer for Product events (Hybrid) in `apps/hybrid/apps/product-service/src/`
- [ ] T024 [US1] Implement Product endpoints in API Gateway (`apps/hybrid/apps/api-gateway/`)

### SCS: Inventory Service (`scs-hybrid--inventory-service`)
- [ ] T025 [US2] Initialize Hybrid Inventory service in `apps/hybrid/apps/inventory-service/`
- [ ] T026 [P] [US2] Create Inventory entity and CQRS commands (Hybrid)
- [ ] T027 [US2] Implement Kafka consumer for Product events in Inventory service (Hybrid)
- [ ] T028 [US2] Implement StockAdjusted event and negative stock warning logic (Hybrid)

### SCS: Sales Service (`scs-hybrid--sales-service`)
- [ ] T029 [US3] Initialize Hybrid Sales service in `apps/hybrid/apps/sales-service/`
- [ ] T030 [P] [US3] Create Sales entities and CQRS Event Sourcing logic (Hybrid)
- [ ] T031 [US3] Implement Kafka consumer for Inventory events in Sales service (Hybrid)
- [ ] T032 [US3] Implement TransactionCompleted event (Hybrid)

## Phase 4: Reliability & Hybrid Infrastructure

### SCS: Reliability & Error Handling (`scs-hybrid--reliability`)
- [ ] T033 [US4] Implement 503 fallback and retry logic for inter-service communication (Hybrid)
- [ ] T034 [US4] Setup Dead Letter Queue (DLQ) consumer for failed event reprocessing in `infrastructure/kafka/`
- [ ] T035 [US4] Validate event reliability and consistency across services

## Phase 5: Final Validation & Metrics
- [ ] T036 [P] [US5] Verify that no squashed commits exist in the experiment history
- [ ] T037 [US5] Run final metrics report (JSON+CSV) across all `scs-*` branches
- [ ] T038 [P] Validate architectural parity (identical business logic) in `quickstart.md`

## Implementation Strategy
1. **Orchestration**: All specification and task management occurs on `scs-global--development-planing`.
2. **SCS Branching**: Each task block corresponds to a mandatory SCS branch as defined in the Constitution.
3. **Metrics-First**: Metrics infra (Phase 1) MUST be completed before any implementation.

## Dependencies
- Phase 1 must be completed before starting Baseline or Hybrid.
- Baseline and Hybrid can be implemented in parallel phases once foundational work is done.
- Within an architecture, Product → Inventory → Sales dependency must be respected.

## Parallel Execution Examples
- **Setup**: Monorepo (T001-T003) and Metrics (T006-T009) can run in parallel.
- **Implementation**: Baseline and Hybrid services for the same domain can be developed simultaneously by separate agents on their respective SCS branches.
