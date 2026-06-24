# Research: Product Domain (Monolith)

## Technical Stack Decisions

- **Framework**: NestJS 11
  - **Rationale**: Chosen for its robust modular architecture, TypeScript support, and widespread industry adoption in the Node.js ecosystem.
- **ORM**: TypeORM 0.3.28
  - **Rationale**: Project standard for the monolith architecture, offering seamless integration with NestJS and support for Data Mapper pattern.
- **Validation**: Zod 4.3
  - **Rationale**: Enforced by project constitution for type-safe schema validation, replacing standard class-validator/class-transformer for consistent validation across services.
- **Database**: MySQL 8.0
  - **Rationale**: Selected for reliable relational data storage, matching the project's production-grade environment constraints.

## Technical Patterns

- **UUID Strategy**: Use `PrimaryGeneratedColumn('uuid')` from TypeORM to ensure globally unique identifiers for products, as per requirement FR-005.
- **Audit Columns**: Inheritance from `BaseEntity` to provide `id`, `createdAt`, and `updatedAt` for all domain entities, ensuring consistency and simplified auditing.
- **Decimal Precision**: `decimal(10, 2)` for prices to avoid floating-point arithmetic errors common with standard `number` types.

## Best Practices Found

- Use `z.infer` for DTO types to ensure single source of truth for validation and typing.
- Implement a global or pipe-level `ZodValidationPipe` to decouple validation logic from controllers.
- Ensure the `ProductModule` exports the `ProductService` for potential cross-domain use cases (e.g., inventory or sales).
