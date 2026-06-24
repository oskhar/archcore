# Tasks: 008-scs-baseline--testing-validation

**Branch**: `008-scs-baseline--testing-validation`
**Input**: Resolve error in npm run test:e2e and print all request and response in e2e testing.

## Implementation Strategy

We will first resolve the E2E test failures by enforcing sequential execution to avoid database race conditions. Then, we will implement a global interceptor to log all requests and responses during E2E tests. Finally, we will expand the test suite to cover all domains and scenarios as per the feature specification.

## Phase 1: Setup

- [X] T001 Verify MariaDB connectivity and ensure `archkit_monolith_test` can be created via `apps/monolith/create-test-db.js`

## Phase 2: Foundational (E2E Fix & Logging)

- [X] T002 Update E2E test script in `apps/monolith/package.json` to include `--runInBand` to resolve race conditions
- [X] T003 [P] Implement `LoggingInterceptor` class in `apps/monolith/test/test-helper.ts` for request/response observation
- [X] T004 Apply `LoggingInterceptor` globally to the test application in `apps/monolith/test/test-helper.ts`

## Phase 3: Comprehensive Test Suite [US1]

- [X] T005 [US1] Implement unit tests for Product domain in `apps/monolith/src/product/`
- [X] T006 [US1] Implement unit tests for Inventory domain in `apps/monolith/src/inventory/`
- [X] T007 [US1] Implement unit tests for Sales domain in `apps/monolith/src/sales/`
- [X] T008 [P] [US1] Expand E2E scenarios for Product CRUD in `apps/monolith/test/product.e2e-spec.ts`
- [X] T009 [P] [US1] Expand E2E scenarios for Inventory (stock consistency, negative stock) in `apps/monolith/test/inventory.e2e-spec.ts`
- [X] T010 [P] [US1] Expand E2E scenarios for Sales (full transaction flows, integration with inventory) in `apps/monolith/test/sales.e2e-spec.ts`
- [X] T011 [US1] Implement performance baseline test (1000 transactions) in `apps/monolith/test/performance.e2e-spec.ts`

## Phase 4: Polish & Validation

- [X] T012 Run full test suite with `npm run test:all` and verify request/response logs are present in output
- [X] T013 Verify 100% pass rate and >80% coverage for all domains
- [X] T014 Document performance baseline results in `specs/008-scs-baseline--testing-validation/contracts/validation-summary.md`

## Dependencies

1. **Foundational (Phase 2)** must be completed before **User Story 1 (Phase 3)** to ensure a stable testing environment.
2. **Polish (Phase 4)** depends on completion of all implementation tasks.

## Parallel Execution Examples

- **Product, Inventory, and Sales Unit Tests** (T005, T006, T007) can be implemented in parallel.
- **E2E Expansion tasks** (T008, T009, T010) can be implemented in parallel.
