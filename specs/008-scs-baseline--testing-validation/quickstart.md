# Quickstart: 008-scs-baseline--testing-validation

## 1. Environment Setup

Ensure MariaDB is running and accessible with the credentials in `.env.example`.
The test database `archkit_monolith_test` will be automatically created or updated.

## 2. Running E2E Tests

To run E2E tests and see request/response logs:

```bash
cd apps/monolith
npm run test:e2e
```

## 3. Observability

E2E tests will output all incoming requests and outgoing responses in the following format:

```text
[REQUEST] POST /products
Body: {
  "name": "Test Product",
  "price": 10.5
}
[RESPONSE] 201
Body: {
  "id": 1,
  "name": "Test Product",
  "price": 10.5
}
```

## 4. Resolving Parallelism Issues

If you encounter `Table already exists` or `Deadlock` errors, ensure tests are running sequentially:

```bash
npm run test:e2e -- --runInBand
```

(The `package.json` script has been updated to include `--runInBand` by default).
