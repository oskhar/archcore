# Feature Specification: scs-baseline--product-domain

**Feature Branch**: `005-scs-baseline--product-domain`
**Created**: 2026-03-25
**Status**: Draft
**Input**: User description: "Implement product management (CRUD item) in the monolith baseline architecture"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Product CRUD (Priority: P1)

As a developer/user, I want to manage products in the monolith system so that I can have a core catalog of items for the POS system.

**Why this priority**: Product domain is the foundation for inventory and sales.

**Independent Test**:
1. Create a product via API.
2. Retrieve the created product by ID.
3. Update the product details.
4. List all products.
5. Delete a product (optional but good for CRUD).

**Acceptance Scenarios**:

1. **Given** a valid product payload (name, price), **When** I send a POST request to `/products`, **Then** the product is saved to the database and returned with a UUID.
2. **Given** an existing product, **When** I send a GET request to `/products/:id`, **Then** I receive the product details.
3. **Given** an existing product, **When** I send a PUT/PATCH request to `/products/:id` with new data, **Then** the product is updated in the database.
4. **Given** several products exist, **When** I send a GET request to `/products`, **Then** I receive a list of all products.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow creating a product with name and price.
- **FR-002**: System MUST validate product data using Zod (as per constitution).
- **FR-003**: System MUST persist product data in MySQL using TypeORM.
- **FR-004**: System MUST provide a REST API for product CRUD operations.
- **FR-005**: System MUST use UUIDs for product identification.
- **FR-006**: Product entity MUST inherit from `BaseEntity` (audit columns).

### Key Entities *(include if feature involves data)*

- **Product**:
  - `id`: UUID (Primary Key)
  - `name`: string
  - `price`: decimal/number
  - `createdAt`: datetime (from BaseEntity)
  - `updatedAt`: datetime (from BaseEntity)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: API endpoints for Create, Read (Single/List), Update, and Delete are fully functional.
- **SC-002**: Data is correctly persisted and retrieved from the MySQL database.
- **SC-003**: Request validation correctly rejects invalid product data.
- **SC-004**: SCS metrics (files changed, LOC, etc.) are recorded for this implementation.

## Assumptions

- Database schema is already initialized (via `scs-baseline--setup-database`).
- `BaseEntity` is available for inheritance.
- Standard NestJS project structure is used.
