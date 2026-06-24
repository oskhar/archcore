# REST API Gateway Contract: Products

## Base URL: `http://localhost:3000/products`

### 1. Create Product
- **Method**: `POST`
- **Path**: `/`
- **Request Body**:
  ```json
  {
    "name": "string",
    "price": "number"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "id": "uuid",
    "name": "string",
    "price": "number",
    "createdAt": "date",
    "updatedAt": "date"
  }
  ```

### 2. Get Product By ID
- **Method**: `GET`
- **Path**: `/:id`
- **Response**: `200 OK`
  ```json
  {
    "id": "uuid",
    "name": "string",
    "price": "number",
    "createdAt": "date",
    "updatedAt": "date"
  }
  ```

### 3. List All Products
- **Method**: `GET`
- **Path**: `/`
- **Response**: `200 OK`
  ```json
  [
    {
      "id": "uuid",
      "name": "string",
      "price": "number",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
  ```

### 4. Update Product
- **Method**: `PATCH`
- **Path**: `/:id`
- **Request Body**:
  ```json
  {
    "name": "string (optional)",
    "price": "number (optional)"
  }
  ```
- **Response**: `200 OK`

### 5. Delete Product
- **Method**: `DELETE`
- **Path**: `/:id`
- **Response**: `204 No Content`
