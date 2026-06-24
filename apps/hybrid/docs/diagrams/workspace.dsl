workspace "Archkit Hybrid Microservices System" "Sistem POS berbasis microservices hybrid dengan event streaming via Apache Kafka." {

    configuration {
        scope softwaresystem
    }

    model {

        # ── Actors ────────────────────────────────────────────────────────────
        cashier = person "Kasir / Operator POS" "Melakukan transaksi penjualan dan mengelola produk & inventori." {
            tags "Person"
        }
        admin = person "Admin" "Mengelola data produk dan memantau performa sistem." {
            tags "Person"
        }

        httpClient = softwareSystem "HTTP Client / API Consumer" "Klien eksternal (Postman, frontend, Artillery)." {
            tags "External System"
        }

        # ── Hybrid System ─────────────────────────────────────────────────────
        hybrid = softwareSystem "Archkit Hybrid Microservices System" "Sistem POS microservices dengan Kafka event streaming dan database isolasi per service." {

            # ── Containers ────────────────────────────────────────────────────
            apiGateway = container "API Gateway" "Entry point tunggal; mem-proxy HTTP request ke service yang sesuai via HttpService (keep-alive)." "NestJS / TypeScript / Port 3000" {
                tags "Server-side Application"
            }

            kafka = container "Apache Kafka" "Platform event streaming untuk komunikasi asinkron antar service." "Kafka / Redpanda" {
                tags "Queue"
            }

            productDb = container "Product DB" "Database isolasi Product Service. Tabel: products." "MySQL 8.0 / archkit_product / Port 3307" {
                tags "Database"
            }

            inventoryDb = container "Inventory DB" "Database isolasi Inventory Service. Tabel: inventory." "MySQL 8.0 / archkit_inventory / Port 3308" {
                tags "Database"
            }

            salesDb = container "Sales DB" "Database isolasi Sales Service. Tabel: sales_transactions, sales_items, product_cache." "MySQL 8.0 / archkit_sales / Port 3309" {
                tags "Database"
            }

            # ── Product Service ───────────────────────────────────────────────
            productService = container "Product Service" "Mengelola CRUD produk via pola CQRS dan mempublish event perubahan ke Kafka." "NestJS + CQRS / TypeScript / Port 3001" {
                tags "Server-side Application"

                productController = component "ProductController" "REST handler CRUD /products. Mendelegasikan ke CommandBus/QueryBus." "NestJS Controller @Controller('products')"

                commandBus = component "CommandBus" "Mendispatch create/update/delete command ke handler yang sesuai." "@nestjs/cqrs CommandBus"

                queryBus = component "QueryBus" "Mendispatch query ke GetProductsHandler / GetProductByIdHandler." "@nestjs/cqrs QueryBus"

                createProductHandler = component "CreateProductHandler" "Simpan produk baru ke DB, emit product.created ke Kafka (fire-and-forget)." "@CommandHandler(CreateProductCommand)"

                updateProductHandler = component "UpdateProductHandler" "Update produk di DB, emit product.updated ke Kafka." "@CommandHandler(UpdateProductCommand)"

                deleteProductHandler = component "DeleteProductHandler" "Hapus produk dari DB, emit product.deleted ke Kafka." "@CommandHandler(DeleteProductCommand)"

                getProductsHandler = component "GetProductsHandler" "Ambil semua produk dari DB via TypeORM." "@QueryHandler(GetProductsQuery)"

                getProductByIdHandler = component "GetProductByIdHandler" "Ambil satu produk by UUID; throw NotFoundException jika tidak ada." "@QueryHandler(GetProductByIdQuery)"

                productEntity = component "Product Entity" "ORM entity tabel products: id, name, price, description, category, createdAt, updatedAt." "@Entity('products') / TypeORM"

                productRepository = component "TypeORM Repository<Product>" "CRUD operations langsung ke MySQL via @InjectRepository." "TypeORM Repository"

                productProducer = component "ProductProducer" "Kafka producer; methods emitProductCreated/Updated/Deleted (fire-and-forget)." "@Injectable() / OnModuleInit"

                productKafkaModule = component "KafkaModule" "Registrasi ClientKafka; consumer group: product-consumer." "NestJS Module"

                productHealthController = component "HealthController (Product)" "GET /health — liveness probe." "@Controller('health')"
            }

            # ── Inventory Service ─────────────────────────────────────────────
            inventoryService = container "Inventory Service" "Mengelola stok inventori; menerima event Kafka untuk menjaga konsistensi eventual." "NestJS + CQRS / TypeScript / Port 3002" {
                tags "Server-side Application"

                inventoryController = component "InventoryController" "REST handler POST /inventory/adjust dan GET /inventory/:productId." "NestJS Controller @Controller('inventory')"

                invCommandBus = component "CommandBus" "Mendispatch AdjustStockCommand ke AdjustStockHandler." "@nestjs/cqrs CommandBus"

                invQueryBus = component "QueryBus" "Mendispatch GetStockQuery ke GetStockHandler." "@nestjs/cqrs QueryBus"

                adjustStockHandler = component "AdjustStockHandler" "Update stok via InventoryRepository, lalu emit inventory.updated ke Kafka." "@CommandHandler(AdjustStockCommand)"

                getStockHandler = component "GetStockHandler" "Ambil data stok by productId dari InventoryRepository." "@QueryHandler(GetStockQuery)"

                productEventConsumer = component "ProductEventConsumer" "Kafka consumer; inisialisasi/hapus inventory record saat product.created/deleted." "@Controller() / @MessagePattern"

                salesEventConsumer = component "SalesEventConsumer" "Kafka consumer; kurangi stok saat sales.transaction-completed (eventual consistency)." "@Controller() / @MessagePattern"

                inventoryProducer = component "InventoryProducer" "Kafka producer; emitInventoryUpdated setelah adjustStock berhasil." "@Injectable() / OnModuleInit"

                inventoryRepository = component "InventoryRepository" "Custom repo: findByProductId, create, adjustStock (atomic), deleteByProductId." "@Injectable() Custom Repository"

                inventoryEntity = component "Inventory Entity" "ORM entity tabel inventory: id, productId (unique), quantity, lastSyncAt." "@Entity('inventory') / TypeORM"

                inventoryKafkaModule = component "KafkaModule" "Registrasi ClientKafka; consumer group: inventory-consumer." "NestJS Module"

                inventoryHealthController = component "HealthController (Inventory)" "GET /health — liveness probe." "@Controller('health')"
            }

            # ── Sales Service ─────────────────────────────────────────────────
            salesService = container "Sales Service" "Mengelola transaksi penjualan; menggunakan in-memory product cache untuk O(1) harga lookup." "NestJS + CQRS / TypeScript / Port 3003" {
                tags "Server-side Application"

                salesController = component "SalesController" "REST handler POST /sales/transaction dan GET /sales/transactions/:id." "NestJS Controller @Controller('sales')"

                salesCommandBus = component "CommandBus" "Mendispatch CreateSaleCommand ke CreateSaleHandler." "@nestjs/cqrs CommandBus"

                salesQueryBus = component "QueryBus" "Mendispatch GetSaleQuery ke GetSaleHandler." "@nestjs/cqrs QueryBus"

                createSaleHandler = component "CreateSaleHandler" "O(1) lookup via ProductCacheService (fallback ke DB jika cache miss), simpan transaksi, emit sales.transaction-completed." "@CommandHandler(CreateSaleCommand)"

                getSaleHandler = component "GetSaleHandler" "Ambil SalesTransaction by UUID beserta relasi items." "@QueryHandler(GetSaleQuery)"

                salesProductEventConsumer = component "ProductEventConsumer (Sales)" "Kafka consumer; sinkronisasi cache produk (created/updated/deleted) ke DB dan in-memory." "@Controller() / @MessagePattern"

                productCacheService = component "ProductCacheService" "In-memory Map<id, {id,name,price}>; warm-up dari product_cache table saat startup." "@Injectable() In-Memory Cache"

                salesRepository = component "SalesRepository" "Custom repo; createTransaction (atomik insert transaksi + items), findById (eager load)." "@Injectable() Custom Repository"

                salesProducer = component "SalesProducer" "Kafka producer; emitSaleCompleted (fire-and-forget) setelah transaksi tersimpan." "@Injectable() / OnModuleInit"

                salesTransactionEntity = component "SalesTransaction Entity" "ORM entity: id, totalPrice, status (COMPLETED/FAILED); OneToMany ke SalesItem." "@Entity('sales_transactions') / TypeORM"

                salesItemEntity = component "SalesItem Entity" "ORM entity: id, transactionId, productId, quantity, unitPrice." "@Entity('sales_items') / TypeORM"

                productCacheEntity = component "ProductCache Entity" "Persistent cache untuk warm-up setelah restart; diperbarui via Kafka events." "@Entity('product_cache') / TypeORM"

                salesKafkaModule = component "KafkaModule" "Registrasi ClientKafka; consumer group: sales-consumer." "NestJS Module"

                salesHealthController = component "HealthController (Sales)" "GET /health — liveness probe." "@Controller('health')"
            }
        }

        # ── Relationships — Level 1 (System Context) ─────────────────────────
        cashier    -> hybrid    "Menggunakan untuk transaksi penjualan dan pengelolaan produk"
        admin      -> hybrid    "Mengelola data produk dan memantau performa sistem"
        httpClient -> hybrid    "Mengirim HTTP Requests" "REST/JSON"

        # ── Relationships — Level 2 (Container) ──────────────────────────────
        cashier    -> apiGateway "Mengirim HTTP requests melalui HTTP Client"
        admin      -> apiGateway "Mengirim HTTP requests melalui HTTP Client"
        httpClient -> apiGateway "HTTP Requests" "REST/JSON, Port 3000"

        apiGateway -> productService   "HTTP Proxy" "REST/JSON via HttpService (keep-alive)"
        apiGateway -> inventoryService "HTTP Proxy" "REST/JSON via HttpService (keep-alive)"
        apiGateway -> salesService     "HTTP Proxy" "REST/JSON via HttpService (keep-alive)"

        productService   -> kafka "Publish events" "product.created, product.updated, product.deleted"
        salesService     -> kafka "Publish events" "sales.transaction-completed"
        inventoryService -> kafka "Publish events" "inventory.updated"

        inventoryService -> kafka "Consume events" "product.created, product.deleted, sales.transaction-completed"
        salesService     -> kafka "Consume events" "product.created, product.updated, product.deleted"

        productService   -> productDb   "Read/Write" "TypeORM / mysql2"
        inventoryService -> inventoryDb "Read/Write" "TypeORM / mysql2"
        salesService     -> salesDb     "Read/Write" "TypeORM / mysql2"

        # ── Relationships — Product Service (Level 3) ─────────────────────────
        apiGateway            -> productController     "HTTP Requests" "REST/JSON"
        productController     -> commandBus            "Execute commands (write ops)"
        productController     -> queryBus              "Execute queries (read ops)"
        commandBus            -> createProductHandler  "CreateProductCommand"
        commandBus            -> updateProductHandler  "UpdateProductCommand"
        commandBus            -> deleteProductHandler  "DeleteProductCommand"
        queryBus              -> getProductsHandler    "GetProductsQuery"
        queryBus              -> getProductByIdHandler "GetProductByIdQuery"
        createProductHandler  -> productRepository     "repository.save()"
        updateProductHandler  -> productRepository     "repository.save()"
        deleteProductHandler  -> productRepository     "repository.delete()"
        getProductsHandler    -> productRepository     "repository.find()"
        getProductByIdHandler -> productRepository     "repository.findOne()"
        createProductHandler  -> productProducer       "emitProductCreated"
        updateProductHandler  -> productProducer       "emitProductUpdated"
        deleteProductHandler  -> productProducer       "emitProductDeleted"
        productRepository     -> productEntity         "Memetakan ke/dari"
        productRepository     -> productDb             "SQL Queries" "TypeORM / mysql2"
        productProducer       -> productKafkaModule    "Menggunakan ClientKafka"
        productKafkaModule    -> kafka                 "Publish events" "product.created, product.updated, product.deleted"

        # ── Relationships — Inventory Service (Level 3) ────────────────────────
        apiGateway              -> inventoryController  "HTTP Requests" "REST/JSON"
        inventoryController     -> invCommandBus        "AdjustStockCommand"
        inventoryController     -> invQueryBus          "GetStockQuery"
        invCommandBus           -> adjustStockHandler   "AdjustStockCommand"
        invQueryBus             -> getStockHandler      "GetStockQuery"
        adjustStockHandler      -> inventoryRepository  "adjustStock(productId, delta)"
        adjustStockHandler      -> inventoryProducer    "emitInventoryUpdated (fire-and-forget)"
        getStockHandler         -> inventoryRepository  "findByProductId(productId)"
        kafka                   -> productEventConsumer "Consume: product.created, product.deleted" "Kafka MessagePattern"
        kafka                   -> salesEventConsumer   "Consume: sales.transaction-completed" "Kafka MessagePattern"
        productEventConsumer    -> inventoryRepository  "create / deleteByProductId"
        salesEventConsumer      -> inventoryRepository  "adjustStock (kurangi stok)"
        inventoryProducer       -> inventoryKafkaModule "Menggunakan ClientKafka"
        inventoryKafkaModule    -> kafka                "Publish: inventory.updated"
        inventoryRepository     -> inventoryEntity      "Memetakan ke/dari"
        inventoryRepository     -> inventoryDb          "SQL Queries" "TypeORM / mysql2"

        # ── Relationships — Sales Service (Level 3) ───────────────────────────
        apiGateway                -> salesController          "HTTP Requests" "REST/JSON"
        salesController           -> salesCommandBus          "CreateSaleCommand"
        salesController           -> salesQueryBus            "GetSaleQuery"
        salesCommandBus           -> createSaleHandler        "CreateSaleCommand"
        salesQueryBus             -> getSaleHandler           "GetSaleQuery"
        createSaleHandler         -> productCacheService      "get(productId) - O(1) hot path lookup"
        createSaleHandler         -> productCacheEntity       "fallback DB query jika cache miss"
        createSaleHandler         -> salesRepository          "createTransaction(totalPrice, items)"
        createSaleHandler         -> salesProducer            "emitSaleCompleted (fire-and-forget)"
        getSaleHandler            -> salesRepository          "findById(id)"
        kafka                     -> salesProductEventConsumer "Consume: product.created/updated/deleted" "Kafka MessagePattern"
        salesProductEventConsumer -> productCacheEntity       "save/delete ke DB cache"
        salesProductEventConsumer -> productCacheService      "set/delete in-memory cache"
        salesProducer             -> salesKafkaModule         "Menggunakan ClientKafka"
        salesKafkaModule          -> kafka                    "Publish: sales.transaction-completed"
        salesRepository           -> salesTransactionEntity   "Memetakan ke/dari"
        salesRepository           -> salesItemEntity          "Memetakan ke/dari"
        salesRepository           -> salesDb                  "SQL Queries" "TypeORM / mysql2"
        productCacheEntity        -> salesDb                  "Read/Write product_cache table" "TypeORM / mysql2"
        productCacheService       -> productCacheEntity       "Warm-up saat startup"
    }

    views {

        # ── C4 Level 1 — System Context ───────────────────────────────────────
        systemContext hybrid "C4-Level1-SystemContext-Hybrid" "C4 Level 1 - System Context: Archkit Hybrid Microservices System" {
            include *
            autoLayout tb
        }

        # ── C4 Level 2 — Container Diagram ────────────────────────────────────
        container hybrid "C4-Level2-Container-Hybrid" "C4 Level 2 - Container Diagram: Archkit Hybrid Microservices System" {
            include *
            autoLayout tb
        }

        # ── C4 Level 3 — Product Service ─────────────────────────────────────
        component productService "C4-Level3-Component-Product-Service" "C4 Level 3 - Component Diagram: Product Service (Hybrid)" {
            include apiGateway productController commandBus queryBus createProductHandler updateProductHandler deleteProductHandler getProductsHandler getProductByIdHandler productEntity productRepository productProducer productKafkaModule productDb kafka
            autoLayout tb
        }

        # ── C4 Level 3 — Inventory Service ────────────────────────────────────
        component inventoryService "C4-Level3-Component-Inventory-Service" "C4 Level 3 - Component Diagram: Inventory Service (Hybrid)" {
            include apiGateway inventoryController invCommandBus invQueryBus adjustStockHandler getStockHandler productEventConsumer salesEventConsumer inventoryProducer inventoryRepository inventoryEntity inventoryKafkaModule inventoryDb kafka
            autoLayout tb
        }

        # ── C4 Level 3 — Sales Service ────────────────────────────────────────
        component salesService "C4-Level3-Component-Sales-Service" "C4 Level 3 - Component Diagram: Sales Service (Hybrid)" {
            include apiGateway salesController salesCommandBus salesQueryBus createSaleHandler getSaleHandler salesProductEventConsumer productCacheService salesRepository salesProducer salesTransactionEntity salesItemEntity productCacheEntity salesKafkaModule salesDb kafka
            autoLayout tb
        }

        # ── Styles ────────────────────────────────────────────────────────────
        styles {

            # ── Elements ──────────────────────────────────────────────────────
            element "Amazon Web Services S3 Bucket" {
                shape Bucket
            }
            element "Amazon Web Services Simple Email Service" {
                color #bf101d
                stroke #bf101d
            }
            element "ATM" {
                color #8411bd
                stroke #8411bd
            }
            element "Bank Staff" {
                color #1a849c
                stroke #1a849c
            }
            element "Boundary" {
                strokeWidth 5
            }
            element "Component" {
                color #1168bd
                shape Component
                stroke #1168bd
            }
            element "Container" {
                color #1168bd
                stroke #1168bd
            }
            element "Core Banking System" {
                color #ed8609
                stroke #ed8609
            }
            element "Customer" {
                color #297e06
                stroke #297e06
            }
            element "Deployment Node" {
                strokeWidth 3
            }
            element "Directory" {
                shape Folder
            }
            element "Element" {
                shape RoundedBox
                strokeWidth 7
            }
            element "Group" {
                strokeWidth 5
            }
            element "Infrastructure Node" {
                shape Ellipse
            }
            element "Internet Banking System" {
                color #1168bd
                stroke #1168bd
            }
            element "Person" {
                fontSize 22
                shape Person
            }
            element "Relational Database Schema" {
                shape Cylinder
            }
            element "Server-side Application" {
                shape Shell
            }
            element "Single-page Application" {
                shape WebBrowser
            }

            # ── Relationships ─────────────────────────────────────────────────
            relationship "Relationship" {
                thickness 4
                width 300
            }
            relationship "via Private Network Connection" {
                style Solid
            }
        }

        # ── Configuration Properties ──────────────────────────────────────────
        properties {
            "plantuml.format" "svg"
            "structurizr.boundaryPadding" "50"
            "plantuml.url" "https://plantuml.com/plantuml"
            "structurizr.deploymentNodePadding" "50"
            "plantuml.inline" "true"
            "structurizr.groupPadding" "50"
            "structurizr.sort" "created"
            "structurizr.metadata" "false"
        }
    }
}
