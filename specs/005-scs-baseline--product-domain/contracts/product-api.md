# Contract: Product API

## Base Path: `/products`

### POST `/products`
Create a new product.

**Request Payload:**
```json
{
  "name": "string",
  "price": "number"
}
```
- `name`: string, 1-255 characters.
- `price`: positive number.

**Response (201 Created):**
```json
{
  "id": "uuid",
  "name": "string",
  "price": "number",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

---

### GET `/products`
List all products.

**Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "name": "string",
    "price": "number",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
]
```

---

### GET `/products/:id`
Retrieve a product by ID.

**Response (200 OK):**
```json
{
  "id": "uuid",
  "name": "string",
  "price": "number",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```
**Response (404 Not Found):**
```json
{
  "message": "Product with ID \"id\" not found"
}
```

---

### PATCH `/products/:id`
Update an existing product.

**Request Payload:**
```json
{
  "name": "string",
  "price": "number"
}
```
- Fields are optional.

**Response (200 OK):**
```json
{
  "id": "uuid",
  "name": "string",
  "price": "number",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

---

### DELETE `/products/:id`
Remove a product by ID.

**Response (200 OK)**
- No body content.

**Response (404 Not Found):**
```json
{
  "message": "Product with ID \"id\" not found"
}
```
