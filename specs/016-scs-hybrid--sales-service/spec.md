# Feature Specification: scs-hybrid--sales-service

**Feature Branch**: `016-scs-hybrid--sales-service`
**Created**: 2026-03-29
**Status**: Draft
**Input**: User description: "Implement sales microservice in the hybrid architecture"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create Sale Transaction (Priority: P1)

As a POS operator, I want to record a sales transaction with multiple products so that I can track sales and automatically trigger inventory reduction via events.

**Why this priority**: Core business capability for the POS system.

**Independent Test**:
1. Create a few products via `api-gateway` (which should trigger Kafka events).
2. Create a sale via `api-gateway` with multiple items.
3. Verify the transaction is recorded in the `archkit_sales` database.
4. Verify that a `SaleCompleted` event is published to Kafka.
5. (Integration) Verify the inventory service reduces stock upon receiving the event.

**Acceptance Scenarios**:

1. **Given** valid product IDs and quantities, **When** I send a POST request to `/sales/transaction` on the `api-gateway`, **Then** a new transaction is saved to the `archkit_sales` database and returned with a UUID.
2. **Given** a successful transaction creation, **When** the transaction is finalized, **Then** a `SaleCompleted` event is emitted to Kafka.
3. **Given** an invalid product ID (not found in local cache), **When** I attempt to create a transaction, **Then** I receive a 400 Bad Request error.

### User Story 2 - Retrieve Transaction (Priority: P2)

As a POS manager, I want to view the details of a past transaction so that I can verify sales records.

**Why this priority**: Needed for audit and verification.

**Independent Test**:
1. Execute a transaction via the `api-gateway`.
2. Retrieve the transaction by ID via the `api-gateway`.
3. Verify all items and the total price match the original transaction.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow creating a sales transaction with a list of items.
- **FR-002**: System MUST use isolated MySQL database (`archkit_sales`) for transaction persistence.
- **FR-003**: System MUST use NestJS CQRS for internal commands and queries.
- **FR-004**: System MUST publish Kafka events (`SaleCompleted`) upon successful transaction creation.
- **FR-005**: System MUST maintain a local cache of products (IDs and prices) by listening to Kafka events from the product service.
- **FR-006**: System MUST validate transaction data using Zod.
- **FR-007**: Entities MUST inherit from `BaseEntity`.
- **FR-008**: System MUST provide a REST API via `api-gateway` that proxies to `sales-service`.

### Key Entities *(include if feature involves data)*

- **SalesTransaction**:
  - `id`: UUID
  - `totalPrice`: decimal
  - `status`: Enum (COMPLETED, FAILED)
  - `createdAt`: datetime
  - `updatedAt`: datetime

- **SalesItem**:
  - `id`: UUID
  - `transactionId`: UUID
  - `productId`: UUID
  - `quantity`: integer
  - `unitPrice`: decimal

- **ProductCache** (Local copy for sales logic):
  - `id`: UUID
  - `price`: decimal
  - `name`: string

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: API endpoints for `/sales/transaction` and `/sales/transactions/:id` are functional via `api-gateway`.
- **SC-002**: `SaleCompleted` events are published to Kafka for downstream consumption.
- **SC-003**: Sales data is isolated in the `archkit_sales` database.
- **SC-004**: SCS metrics are recorded for the implementation.

## Assumptions

- Isolated database `archkit_sales` is available.
- Kafka infrastructure is running.
- Product service is emitting events.
- `api-gateway` is configured to route traffic.
