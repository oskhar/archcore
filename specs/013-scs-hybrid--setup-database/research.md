# Research: SCS Hybrid Database Setup

## Decisions

### 1. Docker Compose Structure
- **Decision**: Define three separate MySQL services in `infrastructure/docker/docker-compose.yml`: `mysql-product`, `mysql-inventory`, and `mysql-sales`.
- **Rationale**: Provides strict physical isolation as required by the "Hybrid Architecture" constraints in the Constitution.
- **Alternatives Considered**: 
    - Single MySQL instance with multiple databases: Rejected because the constitution implies independent instances ("isolated per service").
    - Using MariaDB: Rejected to maintain consistency with the existing MySQL 8.0 usage in `infrastructure/docker/docker-compose.yml`.

### 2. Port Mapping and Connectivity
- **Decision**: 
    - `mysql-product`: Port `3306` (Internal) -> `3307` (Host)
    - `mysql-inventory`: Port `3306` (Internal) -> `3308` (Host)
    - `mysql-sales`: Port `3306` (Internal) -> `3309` (Host)
- **Rationale**: Avoids port conflicts on the host machine while allowing services to connect via `localhost` (if running locally) or service names (if running in Docker).
- **Alternatives Considered**: Using a single port with different database names (Rejected due to isolation requirements).

### 3. Service Configuration (TypeORM)
- **Decision**: Use `@nestjs/config` and `TypeOrmModule.forRootAsync` in each service's `AppModule`.
- **Rationale**: Enables clean, environment-based configuration and supports the hybrid architecture's need for service-specific settings.
- **Alternatives Considered**: Hardcoded configuration (Rejected for lack of flexibility).

### 4. Database Initialization
- **Decision**: Use `MYSQL_DATABASE`, `MYSQL_USER`, and `MYSQL_PASSWORD` environment variables in `docker-compose.yml` for automatic database and user creation.
- **Rationale**: Simplest and most reliable way to ensure each instance has its primary database ready upon startup.
