# Quickstart: Product Domain (Monolith)

## Setup and Prerequisites

- Node.js 20+
- Docker (for MySQL)
- Standard monolith baseline installed.

## Running the Application

1.  **Start MySQL Infrastructure**:
    ```bash
    docker-compose -f infrastructure/docker/docker-compose.yml up -d
    ```

2.  **Start the Monolith**:
    ```bash
    cd apps/monolith
    npm run start:dev
    ```

## Verification

### Automated Tests
Run the unit tests for the product domain:
```bash
npm test apps/monolith/src/product
```

### Manual Verification (cURL)

**Create a product:**
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Coffee Beans", "price": 12.50}'
```

**List all products:**
```bash
curl http://localhost:3000/products
```

**Get product details (replace ID):**
```bash
curl http://localhost:3000/products/[UUID]
```

**Update product details (replace ID):**
```bash
curl -X PATCH http://localhost:3000/products/[UUID] \
  -H "Content-Type: application/json" \
  -d '{"price": 13.99}'
```

**Delete a product (replace ID):**
```bash
curl -X DELETE http://localhost:3000/products/[UUID]
```
