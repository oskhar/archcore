# Feature Specification: scs-hybrid--inventory-service

**Feature Branch**: `015-scs-hybrid--inventory-service`
**Created**: 2026-03-29
**Status**: Draft
**Input**: User description: "Implement inventory microservice in the hybrid architecture"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Inventory Management (Priority: P1)

As a developer/user, I want to manage product inventory in the hybrid system so that I can track stock levels for the POS system.

**Why this priority**: Inventory is a core domain and depends on the product catalog.

**Independent Test**:
1. Adjust stock for a product via the `api-gateway`.
2. Retrieve the current stock for a product by ID via the `api-gateway`.
3. Verify that an event is published to Kafka when stock is adjusted.
4. Verify that the inventory service correctly handles "ProductCreated" events from Kafka to initialize inventory records (optional but good for consistency).

**Acceptance Scenarios**:

1. **Given** a valid product ID and delta, **When** I send a POST request to `/inventory/adjust` on the `api-gateway`, **Then** the inventory is updated in the `archkit_inventory` database and returned.
2. **Given** an existing inventory record, **When** I send a GET request to `/inventory/:productId` on the `api-gateway`, **Then** I receive the current stock level.
3. **Given** an adjustment for a non-existent product, **When** I send the request, **Then** I receive an error (if the service validates against product service, or it might just create the record if we allow lazy initialization). *Let's stick to validation if possible or lazy creation.*

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow adjusting stock for a specific product using a delta value.
- **FR-002**: System MUST retrieve the current stock level for a specific product.
- **FR-003**: System MUST validate inventory data using Zod.
- **FR-004**: System MUST persist inventory data in isolated MySQL (`archkit_inventory`) using TypeORM.
- **FR-005**: System MUST provide a REST API via `api-gateway` that proxies to `inventory-service`.
- **FR-006**: System MUST use UUIDs for inventory records.
- **FR-007**: Inventory entity MUST inherit from `BaseEntity`.
- **FR-008**: `inventory-service` MUST use NestJS CQRS for internal commands and queries.
- **FR-009**: `inventory-service` MUST publish Kafka events on inventory changes.
- **FR-010**: `inventory-service` SHOULD listen for product creation events to initialize stock (optional).

### Key Entities *(include if feature involves data)*

- **Inventory**:
  - `id`: UUID (Primary Key)
  - `productId`: UUID (Unique Foreign Key-like index)
  - `quantity`: integer
  - `createdAt`: datetime (from BaseEntity)
  - `updatedAt`: datetime (from BaseEntity)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: API endpoints for Adjust and Read (Single) are fully functional via the `api-gateway`.
- **SC-002**: Data is correctly persisted and retrieved from the isolated `archkit_inventory` database.
- **SC-003**: Request validation correctly rejects invalid inventory data.
- **SC-004**: Kafka events are correctly published on inventory changes.
- **SC-005**: SCS metrics are recorded.

## Assumptions

- Isolated database `archkit_inventory` is already available (from `scs-hybrid--setup-database`).
- Kafka infrastructure is running (Redpanda).
- `api-gateway` is configured to route traffic to `inventory-service`.
- `BaseEntity` is available for inheritance.
