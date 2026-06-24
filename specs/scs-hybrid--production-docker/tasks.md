# Tasks: Production Docker and DB-per-Service Isolation

**Input**: Design documents from `/specs/scs-hybrid--production-docker/`
**Prerequisites**: plan.md, spec.md, data-model.md

## Phase 1: Setup (Project Initialization)

**Purpose**: Initialize directory structure and operational scripts.

- [ ] T001 Create `infrastructure/docker` and `infrastructure/database` directories
- [ ] T002 [P] Create image build script in `scripts/ops/build-images.sh` and health check script in `scripts/ops/check-health.sh`

## Phase 2: Foundational (Health Monitoring)

**Purpose**: Implement standardized health check contracts required for Docker orchestration.

- [ ] T003 Implement health check controller in `src/health/health.controller.ts` (Monolith)
- [ ] T004 [P] Implement health check logic in `apps/product-service/src/health/` (Hybrid - pattern to be applied to all services)
- [ ] T005 Setup shared production `.env.example` with DB isolation and Kafka variables

## Phase 3: User Story 1 - Isolated Microservice Scaling (Priority: P1)

**Goal**: Implement database-per-service isolation for the hybrid architecture.

**Independent Test**: Take the Product database offline and verify that Inventory and Sales services remain functional.

- [ ] T006 [US1] Create domain-specific SQL initialization scripts in `infrastructure/database/init/` (product.sql, inventory.sql, sales.sql)
- [ ] T007 [US1] Configure three isolated MySQL services in `infrastructure/docker/hybrid/docker-compose.yml`
- [ ] T008 [US1] Update `apps/product-service` configuration to connect to `product-db`
- [ ] T009 [US1] Update `apps/inventory-service` configuration to connect to `inventory-db`
- [ ] T010 [US1] Update `apps/sales-service` configuration to connect to `sales-db`

## Phase 4: User Story 2 - Hardened Production Deployment (Priority: P2)

**Goal**: Create production-grade Docker setup for both architectures.

**Independent Test**: Verify production image sizes are under 500 MB and contain no build tools.

- [ ] T011 [US2] Create multi-stage `Dockerfile.prod` for Monolith in `infrastructure/docker/monolith/Dockerfile.prod`
- [ ] T012 [P] [US2] Create multi-stage `Dockerfile.prod` for Hybrid Product service in `infrastructure/docker/hybrid/product/Dockerfile.prod`
- [ ] T013 [P] [US2] Create multi-stage `Dockerfile.prod` for Hybrid Inventory service in `infrastructure/docker/hybrid/inventory/Dockerfile.prod`
- [ ] T014 [P] [US2] Create multi-stage `Dockerfile.prod` for Hybrid Sales service in `infrastructure/docker/hybrid/sales/Dockerfile.prod`
- [ ] T015 [P] [US2] Create multi-stage `Dockerfile.prod` for Hybrid API Gateway in `infrastructure/docker/hybrid/gateway/Dockerfile.prod`
- [ ] T016 [US2] Implement Docker `HEALTHCHECK` instructions in all production Dockerfiles
- [ ] T017 [US2] Setup production `docker-compose.yml` for Monolith in `infrastructure/docker/monolith/docker-compose.yml`

## Phase 5: User Story 3 - Architectural Parity Verification (Priority: P3)

**Goal**: Ensure business logic remains consistent across infrastructure changes.

**Independent Test**: Run a cross-architecture integration test suite against both Docker deployments.

- [ ] T018 [US3] Create integration test suite for cross-architecture parity in `tests/integration/parity/`
- [ ] T019 [US3] Implement automation to execute parity tests against both Monolith and Hybrid Docker stacks

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T020 Implement log rotation configuration in `infrastructure/docker/common/logging.yml`
- [ ] T021 Configure persistent volume mapping for all database services in production Compose files
- [ ] T022 Finalize `quickstart.md` with production deployment and isolation verification steps

## Implementation Strategy

1. **MVP (Phase 3)**: Establish database isolation for the hybrid stack first, as it is the most critical architectural change.
2. **Infrastructure Hardening (Phase 4)**: Transition to multi-stage builds and hardened production Dockerfiles.
3. **Verification (Phase 5)**: Confirm logic parity between the two hardened environments.

## Dependencies

- Phase 1 & 2 are prerequisites for all subsequent phases.
- User Story 1 (DB Isolation) must be verified before finalizing production Dockerfiles in User Story 2.
- Parity verification (User Story 3) requires both production stacks to be deployable.

## Parallel Execution Examples

- **Foundational**: T003 and T004 can be implemented in parallel across the two architectures.
- **Production Hardening**: T011, T012, T013, T014, and T015 (multi-stage builds) are independent and can be executed in parallel.
