# Research: Kafka Setup for Hybrid Architecture

## Summary
Research focused on integrating Kafka transport into the NestJS-based hybrid monorepo and optimizing the TurboRepo development workflow.

## Decisions

### 1. Kafka Infrastructure
- **Decision**: Use **Redpanda** via Docker Compose.
- **Rationale**: Redpanda is a Kafka-compatible streaming platform that is significantly lighter and easier to configure for local development (no Zookeeper required, single container).
- **Alternatives Considered**: Standard Apache Kafka (Bitnami image) - rejected due to higher resource usage and complexity.

### 2. NestJS Kafka Integration
- **Decision**: Use `@nestjs/microservices` with the `ClientsModule` and `MicroserviceOptions`.
- **Rationale**: Provides a native, decorator-driven approach to Kafka message handling (emit/subscribe) that aligns with NestJS best practices.
- **Implementation**:
    - Services will listen for Kafka events using `@MessagePattern` or `@EventPattern`.
    - Services will publish events using a Kafka client proxy.

### 3. TurboRepo Task Pipeline
- **Decision**: Define a `start:dev` script in each package and configure TurboRepo `dev` task.
- **Rationale**: The user specifically requested `dependsOn: ["^dev"]` for `start:dev`. This ensures that if a service depends on a shared library, the library's watch task starts before the service's.
- **Configuration**:
    ```json
    "dev": {
      "cache": false,
      "persistent": true,
      "dependsOn": ["^dev"]
    }
    ```

### 4. Service Port Mapping
- **Decision**: Assign unique ports to each microservice health check endpoint.
- **Rationale**: Necessary for local development to avoid port conflicts.
- **Ports**:
    - `api-gateway`: 3000
    - `product-service`: 3001
    - `inventory-service`: 3002
    - `sales-service`: 3003

## Research Tasks Completed
- [x] Compare Kafka vs Redpanda for local dev.
- [x] Define port mapping for the 4-service stack.
- [x] Verify TurboRepo `persistent` task requirements.
