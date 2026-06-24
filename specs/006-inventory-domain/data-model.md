# Data Model: Inventory Domain

## Entities

### Inventory
- `id`: UUID (Primary Key)
- `productId`: UUID (Unique Foreign Key -> Product)
- `quantity`: Integer (Default: 0)
- `createdAt`: DateTime
- `updatedAt`: DateTime

## Relationships
- `Inventory.productId` (1:1) `Product.id`

## Validation Rules (Zod)
- `productId`: UUID string
- `delta`: Integer (can be negative)
