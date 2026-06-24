# Tasks: SCS Hybrid Database Setup

**Input**: Design documents from `/specs/013-scs-hybrid--setup-database/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create documentation structure in specs/013-scs-hybrid--setup-database/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [X] T002 Update infrastructure/docker/docker-compose.yml with isolated mysql-product, mysql-inventory, and mysql-sales services

---

## Phase 3: User Story 1 - Isolated Databases (Priority: P1) 🎯 MVP

**Goal**: Each microservice connects to its own dedicated MySQL instance.

**Independent Test**: Start the infrastructure and each service, then verify in logs that they connect to different ports (3307, 3308, 3309).

### Implementation for User Story 1

- [X] T003 [P] [US1] Update environment variables in apps/hybrid/apps/product-service/.env for port 3307
- [X] T004 [P] [US1] Update environment variables in apps/hybrid/apps/inventory-service/.env for port 3308
- [X] T005 [P] [US1] Update environment variables in apps/hybrid/apps/sales-service/.env for port 3309
- [X] T006 [P] [US1] Configure TypeOrmModule in apps/hybrid/apps/product-service/src/app.module.ts using ConfigService
- [X] T007 [P] [US1] Configure TypeOrmModule in apps/hybrid/apps/inventory-service/src/app.module.ts using ConfigService
- [X] T008 [P] [US1] Configure TypeOrmModule in apps/hybrid/apps/sales-service/src/app.module.ts using ConfigService

**Checkpoint**: Each service should be able to connect to its own isolated database instance.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T009 Run quickstart.md validation steps to confirm all 3 services are connected to their respective databases
- [X] T010 [P] Documentation updates in specs/013-scs-hybrid--setup-database/

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup.
- **User Story 1 (Phase 3)**: Depends on Foundational (T002).
- **Polish (Final Phase)**: Depends on User Story 1 completion.

### Parallel Opportunities

- T003, T004, T005 (Environment variables) can be done in parallel.
- T006, T007, T008 (AppModule configuration) can be done in parallel.

---

## Parallel Example: User Story 1

```bash
# Update all .env files in parallel:
Task: "Update environment variables in apps/hybrid/apps/product-service/.env"
Task: "Update environment variables in apps/hybrid/apps/inventory-service/.env"
Task: "Update environment variables in apps/hybrid/apps/sales-service/.env"

# Configure TypeOrmModule in all services in parallel:
Task: "Configure TypeOrmModule in apps/hybrid/apps/product-service/src/app.module.ts"
Task: "Configure TypeOrmModule in apps/hybrid/apps/inventory-service/src/app.module.ts"
Task: "Configure TypeOrmModule in apps/hybrid/apps/sales-service/src/app.module.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Update `docker-compose.yml`.
2. Configure `product-service` and verify connectivity.
3. Repeat for `inventory-service` and `sales-service`.
4. Run full validation.
