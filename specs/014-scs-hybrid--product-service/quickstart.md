# Quickstart: scs-hybrid--product-service

## 1. Start Infrastructure
Ensure Docker is running and start the required services:
```bash
docker-compose -f infrastructure/docker/docker-compose.yml up -d mysql-product redpanda
```

## 2. Start Hybrid Applications
Run all services in development mode:
```bash
npm run start:dev --prefix apps/hybrid
```

## 3. Verify Product Service
You can use `curl` to verify the CRUD operations via the `api-gateway` (default port 3000):

### Create a Product
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Hybrid Product", "price": 99.99}'
```

### List All Products
```bash
curl http://localhost:3000/products
```

### Get Product by ID
```bash
curl http://localhost:3000/products/[UUID]
```

### Update a Product
```bash
curl -X PATCH http://localhost:3000/products/[UUID] \
  -H "Content-Type: application/json" \
  -d '{"price": 89.99}'
```

### Delete a Product
```bash
curl -X DELETE http://localhost:3000/products/[UUID]
```
