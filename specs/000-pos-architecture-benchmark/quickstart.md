# Quickstart: POS Architecture Complexity Benchmark

## Environment Setup
1. **Infrastructure**:
   ```bash
   docker-compose -f infrastructure/docker/docker-compose.yml up -d
   ```
   This will start MySQL and Kafka.

2. **Monorepo Setup**:
   ```bash
   npm install
   ```

## Running the Implementations

### Monolith
```bash
npm run start:monolith
```
Access at `http://localhost:3000`.

### Hybrid
```bash
# Start all hybrid services using TurboRepo
npm run start:hybrid
```
Access the API Gateway at `http://localhost:4000`.

## Metrics Collection
To record metrics for an SCS branch:
1. Ensure your branch name follows the Constitution (e.g., `scs-baseline--product-domain`).
2. After making commits, run:
   ```bash
   ./scripts/metrics/collect.sh --branch <branch-name>
   ```
3. To view a summary:
   ```bash
   ./scripts/metrics/report.sh
   ```

## Development Workflow
- Follow the mandated SCS sequence in the Constitution.
- Ensure all business logic remains identical across `apps/monolith/` and `apps/hybrid/`.
- Use `packages/shared-schema` for all Zod validation definitions.
