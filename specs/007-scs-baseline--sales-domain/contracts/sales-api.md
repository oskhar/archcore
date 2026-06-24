# API Contract: Sales (Monolith)

## Endpoints

### POST /sales/transaction
Execute a new sales transaction.

**Request Payload**:
```json
{
  "items": [
    { "productId": "uuid", "quantity": 2 },
    { "productId": "uuid", "quantity": 1 }
  ]
}
```

**Response**:
- `201 Created`: Transaction recorded successfully.
```json
{
  "id": "uuid",
  "totalPrice": 29.97,
  "status": "COMPLETED",
  "items": [
    { "productId": "uuid", "quantity": 2, "unitPrice": 10.00 },
    { "productId": "uuid", "quantity": 1, "unitPrice": 9.97 }
  ],
  "createdAt": "2026-03-25T12:00:00Z"
}
```

- `400 Bad Request`: Validation failure (empty items, invalid ID).
- `404 Not Found`: One or more products do not exist.

### GET /sales/transactions/:id
Retrieve a specific sales transaction.

**Response**:
- `200 OK`: Transaction details.
- `404 Not Found`: Transaction ID not found.
