# Quickstart: Setup NestJS Hybrid Microservice

## Overview
This feature establishes the standardized NestJS + CQRS baseline for hybrid microservices.

## Setup a New Service

### 1. Initialize Workspace
From `apps/hybrid/apps/`:
```bash
# Example: Create product-service
npx nest new product-service --package-manager npm
```

### 2. Configure Monorepo Parity
- Update `tsconfig.json` to extend `@archkit/tsconfig`.
- Update `eslint.config.mjs` to extend `@archkit/eslint-config`.
- Add internal dependencies: `@nestjs/cqrs`, `zod`.

### 3. Implement Base Pipes
- Copy `ZodValidationPipe` to `src/common/pipes/`.
- Ensure standardized `BadRequestException` is thrown on validation errors.

## Running the Service
From `apps/hybrid/`:
```bash
# Build the service via Turbo
npx turbo build --filter=product-service

# Start the service
cd apps/product-service && npm run start:dev
```

## Verifying CQRS
1. Create a simple `PingCommand` and `PingHandler`.
2. Dispatch via `CommandBus` in a controller.
3. Verify the handler executes and returns the expected result.
