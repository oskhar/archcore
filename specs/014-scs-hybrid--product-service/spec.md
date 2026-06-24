# Feature Specification: scs-hybrid--product-service

**Feature Branch**: `014-scs-hybrid--product-service`
**Created**: 2026-03-27
**Status**: Draft
**Input**: User description: "Implement product microservice (CRUD item) in the hybrid architecture"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Product CRUD (Priority: P1)

As a developer/user, I want to manage products in the hybrid system so that I can have a core catalog of items for the POS system.

**Why this priority**: Product domain is the foundation for inventory and sales.

**Independent Test**:
1. Create a product via the `api-gateway`.
2. Retrieve the created product by ID via the `api-gateway`.
3. Update the product details via the `api-gateway`.
4. List all products via the `api-gateway`.
5. Delete a product via the `api-gateway`.
6. Verify that an event is published to Kafka when a product is created/updated (for future inventory/sales consumption).

**Acceptance Scenarios**:

1. **Given** a valid product payload (name, price), **When** I send a POST request to `/products` on the `api-gateway`, **Then** the product is saved to the `archkit_product` database and returned with a UUID.
2. **Given** an existing product, **When** I send a GET request to `/products/:id` on the `api-gateway`, **Then** I receive the product details.
3. **Given** an existing product, **When** I send a PUT/PATCH request to `/products/:id` with new data on the `api-gateway`, **Then** the product is updated in the database.
4. **Given** several products exist, **When** I send a GET request to `/products` on the `api-gateway`, **Then** I receive a list of all products.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow creating a product with name and price.
- **FR-002**: System MUST validate product data using Zod (as per constitution).
- **FR-003**: System MUST persist product data in isolated MySQL (`archkit_product`) using TypeORM.
- **FR-004**: System MUST provide a REST API via `api-gateway` that proxies to `product-service`.
- **FR-005**: System MUST use UUIDs for product identification.
- **FR-006**: Product entity MUST inherit from `BaseEntity` (audit columns).
- **FR-007**: `product-service` MUST use NestJS CQRS for internal commands and queries.
- **FR-008**: `product-service` MUST publish Kafka events on product creation/update.

### Key Entities *(include if feature involves data)*

- **Product**:
  - `id`: UUID (Primary Key)
  - `name`: string
  - `price`: decimal/number
  - `createdAt`: datetime (from BaseEntity)
  - `updatedAt`: datetime (from BaseEntity)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: API endpoints for Create, Read (Single/List), Update, and Delete are fully functional via the `api-gateway`.
- **SC-002**: Data is correctly persisted and retrieved from the isolated `archkit_product` database.
- **SC-003**: Request validation correctly rejects invalid product data.
- **SC-004**: Kafka events are correctly published on product changes.
- **SC-005**: SCS metrics are recorded.

## Assumptions

- Isolated database `archkit_product` is already available (from `scs-hybrid--setup-database`).
- Kafka infrastructure is running (Redpanda).
- `api-gateway` is configured to route traffic to `product-service`.
- `BaseEntity` is available for inheritance.
