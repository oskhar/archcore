# Tasks: scs-hybrid--inventory-service

**Feature**: `scs-hybrid--inventory-service` | **Date**: 2026-03-29
**Status**: Completed | **MVP Scope**: User Story 1 (Full Inventory Management)

## Implementation Strategy

We will implement the inventory service following the hybrid architecture's CQRS and event-driven patterns. The service will be built incrementally, starting with basic infrastructure and moving to full business logic.

1. **Setup**: Initialize the service directory and dependencies.
2. **Foundational**: Configure TypeORM, Kafka, and CQRS modules.
3. **User Story 1 (Inventory Management)**: Implement the core functionality (Adjust and Get Stock) using CQRS and Kafka.
4. **Polish**: Ensure metrics are recorded and integration with the API Gateway is complete.

## Phase 1: Setup

- [X] T001 Initialize inventory-service directory and package.json with NestJS 11 dependencies in `apps/hybrid/apps/inventory-service`
- [X] T002 Configure tsconfig.json and nest-cli.json for the new service in `apps/hybrid/apps/inventory-service`
- [X] T003 [P] Create the basic folder structure (application, domain, infrastructure, interface) in `apps/hybrid/apps/inventory-service/src`

## Phase 2: Foundational

- [X] T004 [P] Implement Inventory entity inheriting from BaseEntity in `apps/hybrid/apps/inventory-service/src/domain/entities/inventory.entity.ts`
- [X] T005 [P] Configure TypeORM with the isolated `archkit_inventory` database in `apps/hybrid/apps/inventory-service/src/app.module.ts`
- [X] T006 [P] Initialize Kafka client configuration for event-driven communication in `apps/hybrid/apps/inventory-service/src/infrastructure/kafka/kafka.module.ts`
- [X] T007 [P] Set up CQRS module boilerplate (CommandBus, QueryBus) in `apps/hybrid/apps/inventory-service/src/app.module.ts`

## Phase 3: User Story 1 - Inventory Management

**Story Goal**: Manage product inventory with stock adjustments and retrieval via the API Gateway.
**Independent Test**: Adjust stock via POST /inventory/adjust and verify via GET /inventory/:productId.

- [X] T008 [P] [US1] Create AdjustStockDto with Zod validation in `apps/hybrid/apps/inventory-service/src/interface/dtos/adjust-stock.dto.ts`
- [X] T009 [US1] Implement AdjustStockCommand and Handler in `apps/hybrid/apps/inventory-service/src/application/commands/adjust-stock.handler.ts`
- [X] T010 [US1] Implement GetStockQuery and Handler in `apps/hybrid/apps/inventory-service/src/application/queries/get-stock.query.ts`
- [X] T011 [US1] Implement InventoryRepository for atomic stock updates in `apps/hybrid/apps/inventory-service/src/infrastructure/repositories/inventory.repository.ts`
- [X] T012 [US1] Implement InventoryController with REST endpoints in `apps/hybrid/apps/inventory-service/src/interface/controllers/inventory.controller.ts`
- [X] T013 [US1] Implement Kafka producer to publish InventoryUpdated events in `apps/hybrid/apps/inventory-service/src/application/commands/adjust-stock.handler.ts`
- [X] T014 [US1] Implement Kafka consumer for ProductCreated events in `apps/hybrid/apps/inventory-service/src/infrastructure/kafka/product-event.consumer.ts`
- [X] T015 [US1] Add InventoryController to API Gateway for request proxying in `apps/hybrid/apps/api-gateway/src/interface/inventory.controller.ts`
- [X] T016 [US1] Create integration tests for stock adjustment and retrieval in `apps/hybrid/apps/inventory-service/test/inventory.e2e-spec.ts`

## Phase 4: Polish & Cross-Cutting

- [X] T017 [P] Implement health checks and connectivity diagnostics in `apps/hybrid/apps/inventory-service/src/interface/controllers/health.controller.ts`
- [X] T018 Record SCS metrics for the completed inventory microservice implementation
- [X] T019 [P] Final linting and formatting across the inventory service codebase

## Dependencies & Parallelism

- **Foundational (Phase 2)** MUST be complete before **User Story 1 (Phase 3)**.
- **T008-T014** can be implemented in parallel once Foundational is done.
- **T015 (Gateway)** depends on **T012 (Controller)**.
- **T016 (Tests)** depends on **T012 (Controller)**.

**Parallel Execution Examples (US1)**:
- Developer A: T008 (DTO), T009 (Command), T010 (Query)
- Developer B: T011 (Repository), T013 (Kafka Producer), T014 (Kafka Consumer)
