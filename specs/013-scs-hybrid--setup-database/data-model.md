# Data Model: SCS Hybrid Database Setup

## Databases

### 1. Product Database (`archkit_product`)
- **Service**: `mysql-product`
- **Port**: `3307` (Host) -> `3306` (Internal)
- **Role**: Stores all product management data.

### 2. Inventory Database (`archkit_inventory`)
- **Service**: `mysql-inventory`
- **Port**: `3308` (Host) -> `3306` (Internal)
- **Role**: Stores all stock management data.

### 3. Sales Database (`archkit_sales`)
- **Service**: `mysql-sales`
- **Port**: `3309` (Host) -> `3306` (Internal)
- **Role**: Stores all transaction processing data.

## Rules
- **Physical Isolation**: Each domain has its own dedicated MySQL container.
- **No Shared Access**: Each service connects only to its assigned database instance.
- **No Cross-Database Foreign Keys**: Referential integrity must be managed at the application level through events (as per Kafka configuration in other SCS).
