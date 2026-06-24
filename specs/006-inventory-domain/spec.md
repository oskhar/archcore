# Feature Specification: scs-baseline--inventory-domain

**Feature Branch**: `006-inventory-domain`
**Created**: 2026-03-25
**Status**: Draft
**Input**: User description: "Implement stock management (inventory) in the monolith baseline architecture"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Stock Adjustment (Priority: P1)

As a developer/user, I want to adjust stock levels for products so that I can track current inventory levels.

**Why this priority**: Essential for POS operations (sales reduce stock).

**Independent Test**:
1. Create a product (dependency).
2. Adjust stock for that product (e.g., set to 10).
3. Retrieve current stock for the product.
4. Adjust stock again (e.g., reduce by 5).
5. Verify current stock is 5.

**Acceptance Scenarios**:

1. **Given** a valid product ID and a delta (positive or negative), **When** I send a POST request to `/inventory/adjust`, **Then** the inventory record is updated (created if it doesn't exist).
2. **Given** an existing inventory record, **When** I send a GET request to `/inventory/:productId`, **Then** I receive the current quantity.
3. **Given** a non-existent product ID, **When** I attempt to adjust stock, **Then** I receive a 400 Bad Request error.
4. **Given** an adjustment that results in negative stock, **When** I send the adjustment, **Then** the stock is updated and a warning is returned in the response (optional but recommended per benchmark spec).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow adjusting stock for a specific product using a delta value.
- **FR-002**: System MUST retrieve the current stock level for a specific product.
- **FR-003**: System MUST validate that the product exists before adjusting stock.
- **FR-004**: System MUST persist inventory data in MySQL using TypeORM.
- **FR-005**: System MUST use UUIDs for inventory records.
- **FR-006**: Inventory entity MUST inherit from `BaseEntity`.
- **FR-007**: Inventory MUST be tracked per product (one-to-one or one-to-many relationship depending on design; here simple one-to-one per product is sufficient).

### Key Entities *(include if feature involves data)*

- **Inventory**:
  - `id`: UUID (Primary Key)
  - `productId`: UUID (Unique Foreign Key -> Product)
  - `quantity`: integer
  - `createdAt`: datetime (from BaseEntity)
  - `updatedAt`: datetime (from BaseEntity)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: API endpoints for `/inventory/adjust` and `/inventory/:productId` are fully functional.
- **SC-002**: Data is correctly persisted and retrieved from the MySQL database.
- **SC-003**: Adjusting stock for non-existent products is correctly handled with an error.
- **SC-004**: SCS metrics are recorded for this implementation.

## Assumptions

- Product domain is already implemented (`005-scs-baseline--product-domain`).
- Database schema is initialized.
- `BaseEntity` is available.
