# API Contract: Product Service

## Endpoints

### POST /products
Creates a new product.

**Request Payload**:
```json
{
  "sku": "PROD-001",
  "name": "Widget A",
  "price": 19.99
}
```

**Response**:
- `201 Created`: The product was successfully created.
- `400 Bad Request`: Validation failure (price < 0, SKU invalid).

### PUT /products/:id
Updates an existing product.

**Request Payload**:
```json
{
  "name": "Updated Widget A",
  "price": 24.99
}
```

**Response**:
- `200 OK`: The product was successfully updated.
- `404 Not Found`: Product ID does not exist.

### GET /products
Returns a list of all products.

**Response**:
- `200 OK`: Array of products.
```json
[
  { "id": "uuid", "sku": "...", "name": "...", "price": ... }
]
```
