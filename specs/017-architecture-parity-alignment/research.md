# Research: OpenAPI Documentation

## Extracted API Details

### 1. Endpoints and Status Codes

- **Product Domain**:
  - `POST /products`: 201 Created (Success), 400 Bad Request (Validation failure).
  - `GET /products`: 200 OK (Success, Array of Products).
  - `GET /products/:id`: 200 OK (Success), 404 Not Found (Missing ID).
  - `PATCH /products/:id`: 200 OK (Success), 400 Bad Request (Validation failure), 404 Not Found (Missing ID).
  - `DELETE /products/:id`: 204 No Content (Success), 404 Not Found (Missing ID).

- **Sales Domain**:
  - `POST /sales/transaction`: 201 Created (Success), 400 Bad Request (Validation failure, insufficient stock, or missing product).
  - `GET /sales/transactions/:id`: 200 OK (Success), 404 Not Found (Missing ID).

- **Inventory Domain**:
  - `POST /inventory/adjust`: 201 Created (Success), 400 Bad Request (Validation failure).
  - `GET /inventory/:productId`: 200 OK (Success).

- **Diagnostic Domain**:
  - `GET /health`: 200 OK (Success).
  - `GET /diagnostics/ping`: 200 OK (Success).

### 2. Data Models (Zod source of truth)

- **Product**:
  - `name`: string (min 1, max 255)
  - `price`: number (positive)
- **Sales Transaction**:
  - `items`: array of objects `{ productId: UUID, quantity: positive integer }` (min 1)
- **Inventory Adjustment**:
  - `productId`: UUID
  - `delta`: integer

### 3. Error Responses

Standard NestJS error format used in both architectures:
```json
{
  "statusCode": number,
  "message": string,
  "error": string (optional),
  "errors": array (for validation failures)
}
```

## Decisions

- **Decision 1**: Manual generation of OpenAPI YAML to ensure absolute control and accuracy without adding runtime dependencies.
- **Decision 2**: Use `js-yaml` to serialize the YAML for consistency if using a generation script.
- **Decision 3**: Documentation must include specific Zod-derived constraints (min/max/positive).
- **Decision 4**: Grouping all endpoints by tags: `Product`, `Sales`, `Inventory`, `Diagnostics`.

## Alternatives Considered

- **Alternative 1: @nestjs/swagger**: Automated generation from decorators.
  - *Rejected because*: Requires extensive decorator addition to all DTOs and Controllers in both architectures, potentially cluttering the code and violating the principle of minimal shared code for the sake of the experiment.
- **Alternative 2: Postman Collection**:
  - *Rejected because*: Less standard than OpenAPI and harder to use for automated testing of response scenarios in CI/CD pipelines.
