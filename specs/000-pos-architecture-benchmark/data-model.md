# Data Model: POS Architecture Complexity Benchmark

## Entities

### Product
- `id`: UUID (Primary Key)
- `sku`: String (Unique)
- `name`: String
- `price`: Decimal (Scale 2)
- `createdAt`: DateTime
- `updatedAt`: DateTime

**Validation Rules**: 
- `price` must be >= 0.
- `sku` is required and must follow `[A-Z0-9-]{3,10}` format.

### Inventory
- `id`: UUID (Primary Key)
- `productId`: UUID (Foreign Key -> Product)
- `quantity`: Integer
- `lastUpdated`: DateTime

**Validation Rules**:
- `quantity` can be negative (per clarified spec: "Allow with warning/audit log").
- `productId` must exist in the Product table.

### SalesTransaction
- `id`: UUID (Primary Key)
- `totalPrice`: Decimal (Scale 2)
- `status`: Enum (PENDING, COMPLETED, FAILED)
- `timestamp`: DateTime

### SalesItem (Sub-entity)
- `id`: UUID (Primary Key)
- `transactionId`: UUID (Foreign Key -> SalesTransaction)
- `productId`: UUID (Foreign Key -> Product)
- `quantity`: Integer
- `unitPrice`: Decimal (Scale 2)

## Hybrid Architecture Events

### Topic: `product.events`
- `ProductCreated`: { id, sku, name, price, timestamp }
- `ProductUpdated`: { id, sku, name, price, timestamp }

### Topic: `inventory.events`
- `StockAdjusted`: { productId, delta, newQuantity, timestamp }
- `StockWarning`: { productId, message, timestamp } (Used for negative stock or concurrent conflict)

### Topic: `sales.events`
- `TransactionStarted`: { id, timestamp }
- `TransactionCompleted`: { id, items: [{productId, quantity}], totalPrice, timestamp }
- `TransactionFailed`: { id, reason, timestamp }
