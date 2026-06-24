# Data Model: scs-hybrid--sales-service

## Sales Entities

### SalesTransaction

- `id`: UUID (Primary Key)
- `totalPrice`: Decimal(10, 2)
- `status`: Enum (COMPLETED, FAILED)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### SalesItem

- `id`: UUID (Primary Key)
- `transactionId`: UUID (Foreign Key -> SalesTransaction)
- `productId`: UUID (Reference to ProductCache)
- `quantity`: Integer
- `unitPrice`: Decimal(10, 2)

### ProductCache

- `id`: UUID (Primary Key - same as Product service)
- `name`: String
- `price`: Decimal(10, 2)

## Relationships

- `SalesTransaction` 1:N `SalesItem`
- `SalesItem` N:1 `ProductCache` (conceptual across services)

## Validation Rules

- `quantity` must be greater than 0.
- `productId` must exist in `ProductCache`.
- `totalPrice` must be the sum of `quantity * unitPrice` for all items.
