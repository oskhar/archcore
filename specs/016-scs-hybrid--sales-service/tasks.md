# Tasks: scs-hybrid--sales-service

**Feature**: `scs-hybrid--sales-service` | **Date**: 2026-03-29
**Status**: Completed | **MVP Scope**: User Story 1 (Full Sales Transaction with Kafka Emission)

## Implementation Strategy

We will implement the sales service following the hybrid architecture's CQRS and event-driven patterns. A critical component is the local `ProductCache`, which will be populated by listening to Kafka events from the product service.

1. **Setup**: Initialize the service directory and dependencies.
2. **Foundational**: Configure TypeORM, Kafka, and the `ProductCache` mechanism.
3. **User Story 1 (Create Sale)**: Implement the core transaction logic, total price calculation, and event emission.
4. **User Story 2 (Retrieve Sale)**: Implement transaction lookup.
5. **Polish**: Final integration with API Gateway and metrics.

## Phase 1: Setup

- [X] T001 Initialize sales-service directory and package.json with NestJS 11 dependencies in `apps/hybrid/apps/sales-service`
- [X] T002 Configure tsconfig.json and nest-cli.json for the new service in `apps/hybrid/apps/sales-service`
- [X] T003 [P] Create the basic folder structure (application, domain, infrastructure, interface) in `apps/hybrid/apps/sales-service/src`

## Phase 2: Foundational

- [X] T004 [P] Implement SalesTransaction entity in `apps/hybrid/apps/sales-service/src/domain/entities/sales-transaction.entity.ts`
- [X] T005 [P] Implement SalesItem entity in `apps/hybrid/apps/sales-service/src/domain/entities/sales-item.entity.ts`
- [X] T006 [P] Implement ProductCache entity in `apps/hybrid/apps/sales-service/src/domain/entities/product-cache.entity.ts`
- [X] T007 Configure TypeORM with the isolated `archkit_sales` database in `apps/hybrid/apps/sales-service/src/app.module.ts`
- [X] T008 [P] Initialize Kafka module for event-driven communication in `apps/hybrid/apps/sales-service/src/infrastructure/kafka/kafka.module.ts`
- [X] T009 Implement ProductEventConsumer to sync ProductCache from Kafka in `apps/hybrid/apps/sales-service/src/infrastructure/kafka/product-event.consumer.ts`

## Phase 3: User Story 1 - Create Sale Transaction

**Story Goal**: Record a POS sale and trigger inventory reduction via Kafka.
**Independent Test**: POST /sales/transaction and verify DB record + Kafka emission.

- [X] T010 [P] [US1] Create CreateSaleDto with Zod validation in `apps/hybrid/apps/sales-service/src/interface/dtos/create-sale.dto.ts`
- [X] T011 [US1] Implement CreateSaleCommand and Handler in `apps/hybrid/apps/sales-service/src/application/commands/create-sale.handler.ts`
- [X] T012 [US1] Implement SalesRepository for atomic transaction and item persistence in `apps/hybrid/apps/sales-service/src/infrastructure/repositories/sales.repository.ts`
- [X] T013 [US1] Implement Kafka producer for SaleCompleted event emission in `apps/hybrid/apps/sales-service/src/application/commands/create-sale.handler.ts`
- [X] T014 [US1] Implement SalesController with POST /transaction endpoint in `apps/hybrid/apps/sales-service/src/interface/controllers/sales.controller.ts`
- [X] T015 [US1] Add Sales proxy to API Gateway in `apps/hybrid/apps/api-gateway/src/interface/sales.controller.ts`
- [X] T016 [US1] Create integration tests for sale creation and event emission in `apps/hybrid/apps/sales-service/test/sales.e2e-spec.ts`

## Phase 4: User Story 2 - Retrieve Transaction

**Story Goal**: View details of a past transaction.
**Independent Test**: GET /sales/transactions/:id returns the correct payload.

- [X] T017 [P] [US2] Implement GetSaleQuery and Handler in `apps/hybrid/apps/sales-service/src/application/queries/get-sale.handler.ts`
- [X] T018 [US2] Add GET /transactions/:id endpoint to SalesController in `apps/hybrid/apps/sales-service/src/interface/controllers/sales.controller.ts`
- [X] T019 [US2] Update API Gateway with GET transaction proxy in `apps/hybrid/apps/api-gateway/src/interface/sales.controller.ts`

## Phase 5: Polish & Cross-Cutting

- [X] T020 [P] Implement health checks and connectivity diagnostics in `apps/hybrid/apps/sales-service/src/interface/controllers/health.controller.ts`
- [X] T021 Record SCS metrics for the completed sales microservice implementation
- [X] T022 [P] Final linting and formatting across the sales service codebase

## Dependencies & Parallelism

- **Phase 2 (T009)** is a PREREQUISITE for **Phase 3 (US1)** logic (ProductCache is needed).
- **Phase 3 (US1)** is a PREREQUISITE for **Phase 4 (US2)** for testing.
- **Parallelizable [P]**: Entities (T004-T006), DTOs (T010), Health checks (T020).

**Parallel Execution Examples (US1)**:
- Developer A: T010 (DTO), T011 (Command), T014 (Controller)
- Developer B: T012 (Repository), T013 (Producer)
