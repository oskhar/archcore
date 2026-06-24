# Research: Production Docker and DB-per-Service Isolation

## 1. Multi-Stage Docker Builds for NestJS
- **Decision**: Use a three-stage build: `builder` (node:20-alpine), `runtime` (node:20-alpine), and `final` (distroless or minimal alpine).
- **Rationale**: The builder stage installs development dependencies and compiles TypeScript. The runtime stage only includes production dependencies. The final stage copies the compiled `dist/` and `node_modules/` to a clean, minimal image.
- **Alternatives considered**: 
  - **Single-stage build**: Rejected because it results in large image sizes (1GB+) and includes insecure build-time tools.

## 2. Database-per-Service Isolation in Docker Compose
- **Decision**: Define multiple MySQL service containers in the hybrid `docker-compose.yml`, each with its own volume mapping and isolated network.
- **Rationale**: Ensures that Product, Inventory, and Sales domains have independent storage lifecycles. If one database fails, others are unaffected.
- **Alternatives considered**: 
  - **Single MySQL instance with separate schemas**: Rejected because it doesn't provide physical isolation and still shares the same connection pool and memory.

## 3. Environment-Based Configuration
- **Decision**: Use `.env` files for local development and Docker Secrets (or environment variables) for production configurations.
- **Rationale**: Security best practice to separate code from configuration.
- **Alternatives considered**: 
  - **Hardcoded config**: Rejected for obvious security and flexibility reasons.

## 4. Health Checks and Recovery
- **Decision**: Implement `HEALTHCHECK` instructions in Dockerfiles using `curl` or custom scripts to verify service availability.
- **Rationale**: Enables Docker Compose and other orchestrators to automatically restart failed containers, meeting the <10s recovery goal.
- **Alternatives considered**: 
  - **Reliance on OS process signal**: Incomplete as it doesn't detect application-level deadlocks.
