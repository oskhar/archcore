# Tasks: scs-baseline--sales-domain

**Feature Branch**: `007-scs-baseline--sales-domain` | **Date**: 2026-03-25 | **Spec**: `/specs/007-scs-baseline--sales-domain/spec.md`
**Status**: Draft | **Plan**: `/specs/007-scs-baseline--sales-domain/plan.md`

## Summary

Implement the Sales domain in the monolith baseline architecture, enabling transaction recording and automatic inventory reduction using NestJS, TypeORM, and Zod.

## Implementation Strategy

We will follow the modular monolith pattern, implementing the Sales domain as a dedicated feature module. The implementation will start with the database entities and validation schemas, followed by the service layer where the core transactional logic (including cross-domain calls to Product and Inventory) resides. Finally, we will expose the functionality via a REST API and verify it with E2E tests.

- **MVP Phase**: User Story 1 (Create Sale Transaction) - essential for POS functionality.

## Phase 1: Setup

- [X] T001 Create SalesModule and register it in `apps/monolith/src/app.module.ts`

## Phase 2: Foundational

- [X] T002 [P] Create SalesTransaction entity in `apps/monolith/src/sales/entities/sales-transaction.entity.ts`
- [X] T003 [P] Create SalesItem entity in `apps/monolith/src/sales/entities/sales-item.entity.ts`
- [X] T004 [P] Create Sales validation schema in `apps/monolith/src/sales/dto/sales.schema.ts`
- [X] T005 [P] Create CreateTransactionDto in `apps/monolith/src/sales/dto/create-transaction.dto.ts`

## Phase 3: User Story 1 - Create Sale Transaction (Priority: P1)

Goal: Record a sales transaction and automatically reduce inventory.
Independent Test: Execute a POST request to `/sales/transaction` and verify stock reduction in the database.

- [X] T006 [US1] Implement core transaction logic in `apps/monolith/src/sales/sales.service.ts`
- [X] T007 [US1] Implement POST /sales/transaction endpoint in `apps/monolith/src/sales/sales.controller.ts`
- [X] T008 [US1] Register dependencies and entities in `apps/monolith/src/sales/sales.module.ts`
- [X] T009 [US1] Create E2E test for transaction creation in `apps/monolith/test/sales.e2e-spec.ts`

## Phase 4: User Story 2 - Retrieve Transaction (Priority: P2)

Goal: View the details of a past transaction.
Independent Test: Retrieve a previously created transaction via GET `/sales/transactions/:id`.

- [X] T010 [US2] Implement transaction retrieval logic in `apps/monolith/src/sales/sales.service.ts`
- [X] T011 [US2] Implement GET /sales/transactions/:id endpoint in `apps/monolith/src/sales/sales.controller.ts`
- [X] T012 [US2] Add E2E test for transaction retrieval in `apps/monolith/test/sales.e2e-spec.ts`

## Phase 5: Polish & Cross-cutting Concerns

- [X] T013 Verify error handling for invalid products and insufficient stock in `apps/monolith/src/sales/sales.service.ts`
- [X] T014 Run final linting and formatting check for all new files in `apps/monolith/src/sales/`

## Dependencies

- [US1] depends on [Foundational] (T002-T005)
- [US2] depends on [US1] (for transaction data)

## Parallel Execution Examples

- **Foundational Parallel**: T002, T003, T004, and T005 can be implemented simultaneously as they define the data contract.
- **Story Parallel**: While [US2] logically depends on data from [US1], the controller and service methods can be drafted in parallel if the contract is stable.
