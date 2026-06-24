# Data Model: scs-hybrid--product-service

## Entity: Product
- **ID**: `UUID` (Primary Key)
- **Name**: `string`
- **Price**: `decimal`
- **Created At**: `datetime`
- **Updated At**: `datetime`

## Constraints
- **Validation**:
    - `name`: Required, non-empty, string.
    - `price`: Required, numeric, non-negative.

## CQRS Components
- **Commands**:
    - `CreateProductCommand`: `name`, `price`
    - `UpdateProductCommand`: `id`, `name`, `price`
    - `DeleteProductCommand`: `id`
- **Queries**:
    - `GetProductByIdQuery`: `id`
    - `GetAllProductsQuery`: (empty)

## Domain Events (Kafka)
- **Topic**: `product-events`
- **Events**:
    - `ProductCreated`: Full state of the new product.
    - `ProductUpdated`: Updated state of the product.
    - `ProductDeleted`: ID of the deleted product.
