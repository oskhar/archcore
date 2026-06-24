# Quickstart: scs-baseline--inventory-domain

## Prerequisites
- MySQL running (via Docker)
- Product domain implemented (`005-scs-baseline--product-domain`)

## Implementation Steps
1. Create `Inventory` entity in `apps/monolith/src/inventory/entities/`.
2. Create `InventoryModule`, `InventoryService`, and `InventoryController`.
3. Register `Inventory` entity in `AppModule` or `InventoryModule`.
4. Implement `adjustStock` and `getQuantity` in `InventoryService`.
5. Implement endpoints in `InventoryController`.
6. Add Zod validation for the adjustment payload.

## Verification
- Run unit tests: `npm test src/inventory`
- Run E2E tests for inventory adjustment.
- Verify in database: `SELECT * FROM inventory;`
