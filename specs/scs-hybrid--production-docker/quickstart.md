# Quickstart: Production Docker and DB-per-Service Isolation

## Building Production Images
1. **Monolith**:
   ```bash
   docker build -t monolith-pos:latest -f infrastructure/docker/monolith/Dockerfile.prod .
   ```
2. **Hybrid**:
   ```bash
   docker compose -f infrastructure/docker/hybrid/docker-compose.yml build
   ```

## Running the Stack
1. **Monolith**:
   ```bash
   docker compose -f infrastructure/docker/monolith/docker-compose.yml up -d
   ```
2. **Hybrid**:
   ```bash
   docker compose -f infrastructure/docker/hybrid/docker-compose.yml up -d
   ```

## Verifying Isolation
1. **Health Checks**:
   ```bash
   docker ps --filter "health=healthy"
   ```
2. **Storage Isolation**:
   Verify that each hybrid service has its own database instance by running:
   ```bash
   docker compose -f infrastructure/docker/hybrid/docker-compose.yml exec product-db mysql -u root -p -e "SHOW DATABASES;"
   ```

## Image Size Validation
Ensure production images are under 500 MB:
```bash
docker images | grep -E "monolith-pos|hybrid-"
```
