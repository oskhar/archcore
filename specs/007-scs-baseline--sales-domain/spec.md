# Feature Specification: scs-baseline--sales-domain

**Feature Branch**: `007-scs-baseline--sales-domain`
**Created**: 2026-03-25
**Status**: Draft
**Input**: User description: "Implement sales transaction management in the monolith baseline architecture"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create Sale Transaction (Priority: P1)

As a POS operator, I want to record a sales transaction with multiple products so that I can track sales and automatically reduce inventory.

**Why this priority**: Core business capability for the POS system.

**Independent Test**:
1. Create a few products and add initial stock.
2. Create a transaction with multiple items.
3. Verify the transaction is recorded correctly.
4. Verify the inventory for those products is reduced accordingly.

**Acceptance Scenarios**:

1. **Given** valid product IDs and quantities, **When** I send a POST request to `/sales/transaction`, **Then** a new `SalesTransaction` is created, `SalesItem`s are created for each product, and inventory levels are updated.
2. **Given** an invalid product ID, **When** I attempt to create a transaction, **Then** I receive a 400 Bad Request error.
3. **Given** an empty items list, **When** I attempt to create a transaction, **Then** I receive a 400 Bad Request error.

### User Story 2 - Retrieve Transaction (Priority: P2)

As a POS manager, I want to view the details of a past transaction so that I can verify sales records.

**Why this priority**: Needed for audit and verification.

**Independent Test**:
1. Execute a transaction.
2. Retrieve the transaction by ID.
3. Verify all items and the total price match the original transaction.

**Acceptance Scenarios**:

1. **Given** an existing transaction ID, **When** I send a GET request to `/sales/transactions/:id`, **Then** I receive the transaction details including items and total price.
2. **Given** a non-existent transaction ID, **When** I send a GET request to `/sales/transactions/:id`, **Then** I receive a 404 Not Found error.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow creating a sales transaction with a list of items (productId and quantity).
- **FR-002**: System MUST calculate the total price of the transaction based on current product prices.
- **FR-003**: System MUST reduce inventory for each product in the transaction (using `InventoryService`).
- **FR-004**: System MUST validate transaction data using Zod.
- **FR-005**: System MUST persist transaction and items data in MySQL using TypeORM.
- **FR-006**: System MUST provide a REST API for transaction creation and retrieval.
- **FR-007**: Entities MUST inherit from `BaseEntity`.

### Key Entities *(include if feature involves data)*

- **SalesTransaction**:
  - `id`: UUID (Primary Key)
  - `totalPrice`: decimal
  - `status`: Enum (COMPLETED, FAILED)
  - `createdAt`: datetime (from BaseEntity)
  - `updatedAt`: datetime (from BaseEntity)

- **SalesItem**:
  - `id`: UUID (Primary Key)
  - `transactionId`: UUID (Foreign Key)
  - `productId`: UUID (Foreign Key)
  - `quantity`: integer
  - `unitPrice`: decimal (price at time of sale)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: API endpoints for creating transactions and retrieving transactions are fully functional.
- **SC-002**: Inventory is correctly reduced when a transaction is completed.
- **SC-003**: Transactions are persisted with correct total prices and item breakdowns.
- **SC-004**: Request validation correctly rejects invalid transaction data.

## Assumptions

- Product and Inventory domains are already implemented.
- Database schema is initialized.
- `BaseEntity` is available.
- For baseline monolith, stock reduction happens synchronously within the transaction.
