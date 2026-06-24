# Quickstart: SCS Hybrid Database Setup

## Prerequisites
- Docker and Docker Compose installed.
- Node.js 20+ and npm installed.

## 1. Start Infrastructure
Run the following command from the project root:
```bash
docker-compose -f infrastructure/docker/docker-compose.yml up -d mysql-product mysql-inventory mysql-sales
```

## 2. Environment Variables
Update the `.env` files for each microservice in `apps/hybrid/apps/`:

### `product-service` (.env)
```bash
DB_HOST=localhost
DB_PORT=3307
DB_USERNAME=archkit_user
DB_PASSWORD=archkit_password
DB_DATABASE=archkit_product
```

### `inventory-service` (.env)
```bash
DB_HOST=localhost
DB_PORT=3308
DB_USERNAME=archkit_user
DB_PASSWORD=archkit_password
DB_DATABASE=archkit_inventory
```

### `sales-service` (.env)
```bash
DB_HOST=localhost
DB_PORT=3309
DB_USERNAME=archkit_user
DB_PASSWORD=archkit_password
DB_DATABASE=archkit_sales
```

## 3. Verify Connectivity
Start the hybrid apps in dev mode:
```bash
npm run start:dev --prefix apps/hybrid
```
Verify the startup logs for each service to ensure successful TypeORM connection.
