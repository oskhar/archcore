# Data Model: Product Domain

## Entities

### `Product`

Represents a core catalog item in the POS system. Inherits common properties from `BaseEntity`.

| Field | Type | Constraint | Description |
|---|---|---|---|
| `id` | UUID | PK, Auto-gen | Unique product identifier. |
| `name` | string | NOT NULL, max 255 | Product name. |
| `price` | decimal(10,2) | NOT NULL, > 0 | Unit price. |
| `createdAt` | datetime | NOT NULL, Auto-gen | Audit: Creation timestamp. |
| `updatedAt` | datetime | NOT NULL, Auto-update | Audit: Last modification timestamp. |

## Schema (SQL Equivalent)

```sql
CREATE TABLE `products` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;
```

## Validation Rules (Zod)

- `name`: Must be a string with minimum 1 and maximum 255 characters.
- `price`: Must be a positive number.

## Relationships

- This entity currently has no relationships to other domains in the monolith baseline.
