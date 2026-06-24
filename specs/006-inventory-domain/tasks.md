# Tasks: scs-baseline--inventory-domain

**Feature Branch**: `006-inventory-domain` | **Date**: 2026-03-25 | **Spec**: `/specs/006-inventory-domain/spec.md`
**Status**: Draft | **Plan**: `/specs/006-inventory-domain/plan.md`

## Summary

Implement the Inventory domain in the monolith baseline architecture, enabling stock adjustment and retrieval for products using NestJS, TypeORM, and Zod.

## Implementation Strategy

We will implement the inventory domain following the standard NestJS feature module pattern. We'll start by registering the module, then define the data model and validation, followed by the service logic and controller endpoints. We'll prioritize User Story 1 (Stock Adjustment) as the core MVP.

- **MVP Phase**: User Story 1 (Stock Adjustment) - complete end-to-end functionality for stock management.

## Phase 1: Setup

- [X] T001 Register InventoryModule in `apps/monolith/src/app.module.ts`

## Phase 2: Foundational

- [X] T002 [P] Create Inventory entity in `apps/monolith/src/inventory/entities/inventory.entity.ts`
- [X] T003 [P] Create Zod schema in `apps/monolith/src/inventory/dto/inventory.schema.ts`
- [X] T004 [P] Create DTOs from schema in `apps/monolith/src/inventory/dto/adjust-stock.dto.ts`

## Phase 3: User Story 1 - Stock Adjustment (Priority: P1)

Goal: Enable stock adjustment and retrieval for products.
Independent Test: Adjust stock for an existing product and verify the new quantity via GET endpoint.

- [X] T005 [P] [US1] Create unit tests for InventoryService in `apps/monolith/src/inventory/inventory.service.spec.ts`
- [X] T006 [US1] Implement InventoryService logic in `apps/monolith/src/inventory/inventory.service.ts`
- [X] T007 [P] [US1] Create unit tests for InventoryController in `apps/monolith/src/inventory/inventory.controller.spec.ts`
- [X] T008 [US1] Implement InventoryController endpoints in `apps/monolith/src/inventory/inventory.controller.ts`
- [X] T009 [US1] Implement InventoryModule and register entity in `apps/monolith/src/inventory/inventory.module.ts`
- [X] T010 [US1] Create E2E test for inventory adjustment in `apps/monolith/test/inventory.e2e-spec.ts`

## Phase 4: Polish & Cross-cutting Concerns

- [X] T011 Verify error handling for non-existent products in `apps/monolith/src/inventory/inventory.service.ts`
- [X] T012 Confirm compliance with SCS metrics requirements.

## Dependencies

- [US1] depends on [Foundational] tasks.
- [Foundational] tasks depend on [Setup] (T001).

## Parallel Execution Examples

- **Foundational Parallel**: T002 (Entity) and T003/T004 (DTOs) can be developed simultaneously.
- **Testing Parallel**: T005 (Service Tests) and T007 (Controller Tests) can be drafted before implementation.
