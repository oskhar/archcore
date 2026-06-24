# Tasks: OpenAPI Documentation

**Input**: Design documents from `/specs/017-architecture-parity-alignment/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Tests are NOT requested in the specification; validation will be performed via YAML validation and Swagger Editor checks as per quickstart.md.

**Organization**: Tasks are grouped by user story (Domain) to enable independent documentation and validation of each domain increment.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (no dependencies within the same file or logical section)
- **[Story]**: Which user story/domain this task belongs to (US1: Product, US2: Sales, US3: Inventory, US4: Diagnostics)
- All documentation target `docs/openapi.yaml`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create `docs/openapi.yaml` with OpenAPI 3.0.0 header and basic structure (info, servers, tags)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core components shared across all domains

**⚠️ CRITICAL**: No domain documentation can begin until common schemas are defined

- [x] T002 Define Standard Error Response schema in `docs/openapi.yaml` components/schemas

**Checkpoint**: Foundation ready - domain documentation can now begin

---

## Phase 3: User Story 1 - Product Domain (Priority: P1) 🎯 MVP

**Goal**: Document all Product endpoints and models with Zod-based constraints

**Independent Test**: Verify `GET /products` and `POST /products` pass validation in Swagger Editor

### Implementation for User Story 1

- [x] T003 [P] [US1] Define Product and CreateProductDto schemas with constraints (min, max, positive) in `docs/openapi.yaml`
- [x] T004 [P] [US1] Define UpdateProductDto schema in `docs/openapi.yaml`
- [x] T005 [US1] Document `GET /products` (200) and `POST /products` (201, 400) endpoints in `docs/openapi.yaml`
- [x] T006 [US1] Document `GET /products/{id}` (200, 404), `PATCH /products/{id}` (200, 400, 404), and `DELETE /products/{id}` (204, 404) in `docs/openapi.yaml`

**Checkpoint**: Product domain documentation is complete and testable

---

## Phase 4: User Story 2 - Sales Domain (Priority: P1)

**Goal**: Document Sales transactions and models

**Independent Test**: Verify `POST /sales/transaction` passes validation in Swagger Editor

### Implementation for User Story 2

- [x] T007 [P] [US2] Define SalesItem and SalesTransaction schemas in `docs/openapi.yaml`
- [x] T008 [P] [US2] Define CreateTransactionDto schema in `docs/openapi.yaml`
- [x] T009 [US2] Document `POST /sales/transaction` (201, 400) endpoint in `docs/openapi.yaml`
- [x] T010 [US2] Document `GET /sales/transactions/{id}` (200, 404) endpoint in `docs/openapi.yaml`

**Checkpoint**: Sales domain documentation is complete and testable

---

## Phase 5: User Story 3 - Inventory Domain (Priority: P2)

**Goal**: Document Inventory adjustments and balance checks

**Independent Test**: Verify `POST /inventory/adjust` passes validation in Swagger Editor

### Implementation for User Story 3

- [x] T011 [P] [US3] Define InventoryBalance and AdjustStockDto schemas in `docs/openapi.yaml`
- [x] T012 [US3] Document `POST /inventory/adjust` (201, 400) endpoint in `docs/openapi.yaml`
- [x] T013 [US3] Document `GET /inventory/{productId}` (200) endpoint in `docs/openapi.yaml`

**Checkpoint**: Inventory domain documentation is complete and testable

---

## Phase 6: User Story 4 - Diagnostics Domain (Priority: P3)

**Goal**: Document utility health and ping endpoints

**Independent Test**: Verify health endpoints pass validation in Swagger Editor

### Implementation for User Story 4

- [x] T014 [US4] Document `GET /health` and `GET /diagnostics/ping` (200) in `docs/openapi.yaml`

**Checkpoint**: All domains are now documented

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Global validation and consistency checks

- [x] T015 [P] Validate `docs/openapi.yaml` against OpenAPI 3.0 specification using an external validator
- [x] T016 Ensure all response scenarios (200, 201, 204, 400, 404, 500) identified in research.md are fully documented
- [x] T017 Run `quickstart.md` validation steps

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on T001
- **User Stories (Phase 3+)**: All depend on Phase 2 completion
- **Polish (Final Phase)**: Depends on all domain phases completion

### Parallel Opportunities

- T003, T004 (Product schemas) can be done in parallel
- T007, T008 (Sales schemas) can be done in parallel
- T011 (Inventory schemas) can be done in parallel
- Once Phase 2 is complete, US1, US2, US3, and US4 can be documented in parallel if handled by different editors

---

## Parallel Example: Product Domain Schemas

```bash
# Define all Product domain schemas together
Task: "Define Product and CreateProductDto schemas in docs/openapi.yaml"
Task: "Define UpdateProductDto schema in docs/openapi.yaml"
```

---

## Implementation Strategy

### MVP First (Product & Sales)

1. Complete Setup and Foundational phases.
2. Complete User Story 1 (Product).
3. Complete User Story 2 (Sales).
4. **STOP and VALIDATE**: Verify core business API documentation in Swagger Editor.

### Incremental Delivery

1. Add Inventory Domain (US3).
2. Add Diagnostics Domain (US4).
3. Run final validation (Phase 7).

---

## Notes

- All tasks target the same file `docs/openapi.yaml`. Parallelism [P] refers to logical independence within the YAML structure.
- Zod constraints (min, max, format) MUST be translated to OpenAPI equivalents (minLength, maxLength, format, minimum).
- Error responses must follow the standard NestJS format as defined in T002.
