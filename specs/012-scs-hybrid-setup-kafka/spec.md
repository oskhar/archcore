# Feature Specification: Setup Kafka for Hybrid Architecture

**Feature Branch**: `012-scs-hybrid-setup-kafka`
**Created**: 2026-03-26
**Status**: Draft
**Input**: User description: "implement scs-hybrid--setup-kafka with schema apps is api-gateway, product-service, inventory-service, and sales-service, make sure that nestjs running well in all application, you can seting up turbo start:dev dependOn ^dev"

## User Scenarios & Testing

### User Story 1 - Event-Driven Communication with Kafka (Priority: P1)

As a Developer, I want to use Kafka as the primary transport for communication between microservices so that I can implement an event-driven architecture as required by the project constitution.

**Independent Test**:
A message sent from one service (e.g., `product-service`) is received and logged by another service (e.g., `inventory-service`) via a Kafka topic.

### User Story 2 - Full Hybrid Stack Management (Priority: P1)

As a Developer, I want all core hybrid microservices (`api-gateway`, `product-service`, `inventory-service`, `sales-service`) to be functional and managed by TurboRepo so that I can start the entire development environment with a single command.

**Independent Test**:
Run `npm run dev` from `apps/hybrid/` and verify that all 4 services start successfully and their health checks are reachable.

## Requirements

- **FR-001**: Initialize `api-gateway`, `inventory-service`, and `sales-service` using the NestJS hybrid baseline.
- **FR-002**: Configure Kafka microservice transport in all services.
- **FR-003**: Update `apps/hybrid/turbo.json` to define `dev` task with `dependsOn: ["^dev"]`.
- **FR-004**: Implement a base Kafka producer/consumer pattern in each service.
- **FR-005**: Ensure all services respond to the standardized `/health` check.

## Success Criteria

- **SC-001**: 4 microservices exist in `apps/hybrid/apps/` and start successfully.
- **SC-002**: `npx turbo dev` starts all services in the correct order.
- **SC-003**: Successful message exchange verified between at least two services via Kafka.
