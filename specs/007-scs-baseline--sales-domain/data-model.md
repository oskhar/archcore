# Data Model: Sales Domain

## Entities

### SalesTransaction
- `id`: UUID (Primary Key)
- `totalPrice`: Decimal(10,2)
- `status`: Enum (COMPLETED, FAILED)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### SalesItem
- `id`: UUID (Primary Key)
- `transactionId`: UUID (Foreign Key -> SalesTransaction)
- `productId`: UUID (Foreign Key -> Product)
- `quantity`: Integer
- `unitPrice`: Decimal(10,2) (Price at time of sale)

## Relationships
- `SalesItem.transactionId` (N:1) `SalesTransaction.id`
- `SalesItem.productId` (N:1) `Product.id`

## Validation Rules (Zod)
- `items`: array of (productId: UUID, quantity: positive integer)
- `items` must not be empty.
