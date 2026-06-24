# Quickstart: scs-baseline--sales-domain

## Prerequisites
- Product domain implemented (`005-scs-baseline--product-domain`)
- Inventory domain implemented (`006-inventory-domain`)
- MySQL database running (via Docker)

## Implementation Steps
1. Create `SalesTransaction` and `SalesItem` entities in `apps/monolith/src/sales/entities/`.
2. Create `SalesModule`, `SalesService`, and `SalesController`.
3. Register entities in `SalesModule`.
4. Implement `createTransaction` in `SalesService` using TypeORM transaction.
5. In the transaction:
   - Calculate total price.
   - Reduce stock for each item using `InventoryService.adjustStock`.
   - Create `SalesTransaction` and `SalesItem`s.
6. Implement endpoints in `SalesController` with Zod validation.

## Verification
- Run unit tests: `npm test src/sales`
- Run E2E tests: `npm run test:e2e -- test/sales.e2e-spec.ts`
- Verify database state: `SELECT * FROM sales_transaction; SELECT * FROM sales_item;`
