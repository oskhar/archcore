# Data Model: Production Docker and DB-per-Service Isolation

## Container Architecture

### Monolith Container
- **Service Name**: `monolith-pos`
- **Base Image**: `node:20-alpine`
- **Volume**: `/var/lib/mysql`
- **Dependencies**: `monolith-db`

### Hybrid Microservice Containers
- **Product Service**: `hybrid-product` -> `product-db`
- **Inventory Service**: `hybrid-inventory` -> `inventory-db`
- **Sales Service**: `hybrid-sales` -> `sales-db`
- **API Gateway**: `api-gateway`

## Storage Isolation Model

### Hybrid Databases
1. **Product DB**: Port 33061 (Internal only), Unique root password
2. **Inventory DB**: Port 33062 (Internal only), Unique root password
3. **Sales DB**: Port 33063 (Internal only), Unique root password

## Configuration Entities

### Environment Variables (Required for all services)
- `NODE_ENV`: production
- `DB_HOST`: [service-specific]
- `DB_PORT`: 3306
- `DB_USER`: [service-specific]
- `DB_PASSWORD`: [secret]
- `KAFKA_BROKER`: kafka:9092 (hybrid only)
