# Data Model: scs-hybrid--inventory-service

## Inventory Entity

- `id`: UUID (Primary Key, automatically generated)
- `productId`: UUID (Unique Foreign Key reference to Product service)
- `quantity`: Integer (default 0)
- `createdAt`: DateTime (inherited from BaseEntity)
- `updatedAt`: DateTime (inherited from BaseEntity)

## Zod Validation Schemas

### AdjustStockDto

- `productId`: UUID (required)
- `delta`: Integer (required, non-zero)

## Relationships

- `Inventory` has a 1:1 conceptual relationship with `Product` (managed cross-service).
