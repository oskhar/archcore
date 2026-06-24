workspace "Archkit Monolith POS System" "Sistem POS monolitik Archkit yang mengelola Product, Inventory, dan Sales dalam satu proses tunggal." {

    configuration {
        scope softwaresystem
    }

    model {

        # ── Actors ────────────────────────────────────────────────────────────
        cashier = person "Kasir / Operator POS" "Melakukan transaksi penjualan dan mengelola produk & inventori." {
            tags "Person"
        }
        admin = person "Admin" "Mengelola data produk dan memantau stok inventori." {
            tags "Person"
        }

        httpClient = softwareSystem "HTTP Client / API Consumer" "Klien eksternal (Postman, frontend, Artillery) yang berinteraksi via REST API." {
            tags "External System"
        }

        # ── Monolith System ───────────────────────────────────────────────────
        monolith = softwareSystem "Archkit Monolith Application" "Aplikasi NestJS monolitik yang mengelola Product, Inventory, dan Sales dalam satu proses." {

            nestjsApp = container "NestJS Application" "Aplikasi monolitik yang mengelola Product, Inventory, dan Sales. Berjalan pada port 3000." "NestJS / TypeScript / Node.js 20+" {
                tags "Server-side Application"

                # ── Product Module ─────────────────────────────────────────
                productController = component "ProductController" "REST handler CRUD /products (POST, GET, GET/:id, PATCH/:id, DELETE/:id)." "NestJS Controller @Controller('products')"

                zodPipeProduct = component "ZodValidationPipe (Product)" "Validasi body request via Zod Schema pada POST dan PATCH." "NestJS Pipe / Zod 3.x"

                productSchema = component "ProductSchema" "Definisi aturan validasi: CreateProductSchema dan UpdateProductSchema (partial)." "Zod Schema / product.schema.ts"

                productService = component "ProductService" "Business logic produk: create, findAll, findOne, update, remove." "NestJS Service @Injectable()"

                productEntity = component "Product Entity" "ORM entity tabel products: id, name, price, description, category, createdAt, updatedAt." "@Entity('products') / TypeORM"

                productRepository = component "ProductRepository" "TypeORM repository via @InjectRepository(Product); operasi find, save, update, delete." "TypeORM Repository<Product>"

                # ── Inventory Module ───────────────────────────────────────
                inventoryController = component "InventoryController" "REST handler POST /inventory/adjust dan GET /inventory/:productId." "NestJS Controller @Controller('inventory')"

                zodPipeInventory = component "ZodValidationPipe (Inventory)" "Validasi body adjustStock via AdjustStockSchema." "NestJS Pipe / Zod 3.x"

                inventorySchema = component "AdjustStockSchema" "Validasi: productId (UUID), delta (number, bisa negatif)." "Zod Schema"

                inventoryService = component "InventoryService" "Business logic stok: adjustStock (dengan optional EntityManager untuk transaksi atomik) dan getQuantity." "NestJS Service @Injectable()"

                inventoryEntity = component "Inventory Entity" "ORM entity tabel inventory: id, productId (unique FK), quantity, lastSyncAt." "@Entity('inventory') / TypeORM"

                inventoryRepository = component "InventoryRepository" "Akses database: find, save, increment (atomic), update lastSyncAt." "TypeORM Repository<Inventory>"

                # ── Sales Module ───────────────────────────────────────────
                salesController = component "SalesController" "REST handler POST /sales/transaction dan GET /sales/transactions/:id." "NestJS Controller @Controller('sales')"

                zodPipeSales = component "ZodValidationPipe (Sales)" "Validasi body createTransaction via CreateTransactionSchema." "NestJS Pipe / Zod 3.x"

                salesSchema = component "CreateTransactionSchema" "Validasi: items[] (productId UUID, quantity int positif)." "Zod Schema"

                salesService = component "SalesService" "Business logic transaksi ACID via DataSource: validasi produk, kalkulasi harga, kurangi stok, simpan transaksi & items." "NestJS Service @Injectable()"

                salesTransactionEntity = component "SalesTransaction Entity" "ORM entity: id, totalPrice, status (COMPLETED/FAILED); OneToMany ke SalesItem." "@Entity('sales_transactions') / TypeORM"

                salesItemEntity = component "SalesItem Entity" "ORM entity: id, transactionId, productId, quantity, unitPrice." "@Entity('sales_items') / TypeORM"

                transactionRepository = component "SalesTransactionRepository" "findOne dengan eager loading relasi items." "TypeORM Repository<SalesTransaction>"

                itemRepository = component "SalesItemRepository" "Digunakan dalam konteks DB transaction via manager.create/save." "TypeORM Repository<SalesItem>"

                datasource = component "DataSource" "Membungkus createTransaction dalam satu ACID transaction; rollback otomatis jika gagal." "TypeORM DataSource"
            }

            mysqlDb = container "MySQL Database" "Database tunggal bersama: products, inventory, sales_transactions, sales_items." "MySQL 8.0 / archkit_monolith" {
                tags "Database"
            }
        }

        # ── Relationships — Level 1 (System Context) ─────────────────────────
        cashier    -> monolith   "Menggunakan untuk transaksi penjualan dan pengelolaan produk"
        admin      -> monolith   "Mengelola data produk dan memantau sistem"
        httpClient -> monolith   "Mengirim HTTP Requests" "REST/JSON"

        # ── Relationships — Level 2 (Container) ──────────────────────────────
        cashier    -> nestjsApp  "Mengirim HTTP requests melalui HTTP Client"
        admin      -> nestjsApp  "Mengirim HTTP requests melalui HTTP Client"
        httpClient -> nestjsApp  "Mengirim HTTP Requests" "REST / HTTP / JSON, Port 3000"
        nestjsApp  -> mysqlDb    "Membaca & Menulis data" "TypeORM / mysql2 / TCP, Port 3306"

        # ── Relationships — Product Module (Level 3) ──────────────────────────
        httpClient          -> productController  "HTTP Requests" "REST/JSON"
        productController   -> zodPipeProduct     "Validasi body melalui" "POST/PATCH"
        zodPipeProduct      -> productSchema      "Menggunakan schema"
        productController   -> productService     "Mendelegasikan logika bisnis"
        productService      -> productRepository  "CRUD operations"
        productRepository   -> productEntity      "Memetakan ke/dari"
        productRepository   -> mysqlDb            "SQL Queries" "TypeORM / mysql2"

        # ── Relationships — Inventory Module (Level 3) ────────────────────────
        httpClient          -> inventoryController  "HTTP Requests" "REST/JSON"
        inventoryController -> zodPipeInventory     "Validasi body" "POST /adjust"
        zodPipeInventory    -> inventorySchema      "Menggunakan schema"
        inventoryController -> inventoryService     "Mendelegasikan logika bisnis"
        inventoryService    -> inventoryRepository  "CRUD + atomic increment"
        inventoryService    -> productService       "findOne(productId) - verifikasi produk"
        inventoryRepository -> inventoryEntity      "Memetakan ke/dari"
        inventoryRepository -> mysqlDb              "SQL Queries" "TypeORM / mysql2"

        # ── Relationships — Sales Module (Level 3) ────────────────────────────
        httpClient            -> salesController        "HTTP Requests" "REST/JSON"
        salesController       -> zodPipeSales           "Validasi body" "POST /transaction"
        zodPipeSales          -> salesSchema            "Menggunakan schema"
        salesController       -> salesService           "Mendelegasikan logika bisnis"
        salesService          -> datasource             "Wrap semua operasi dalam ACID DB transaction"
        salesService          -> productService         "findOne: validasi produk & ambil harga"
        salesService          -> inventoryService       "adjustStock(dto, manager): kurangi stok"
        salesService          -> transactionRepository  "findOne + eager load relations"
        datasource            -> transactionRepository  "manager.create/save SalesTransaction"
        datasource            -> itemRepository         "manager.create/save SalesItem"
        transactionRepository -> salesTransactionEntity "Memetakan ke/dari"
        itemRepository        -> salesItemEntity        "Memetakan ke/dari"
        transactionRepository -> mysqlDb                "SQL Queries" "TypeORM / mysql2"
        itemRepository        -> mysqlDb                "SQL Queries" "TypeORM / mysql2"
    }

    views {

        # ── C4 Level 1 — System Context ───────────────────────────────────────
        systemContext monolith "SystemContext" "C4 Level 1 - System Context: Archkit Monolith POS System" {
            include *
            autoLayout tb
        }

        # ── C4 Level 2 — Container Diagram ────────────────────────────────────
        container monolith "C4-Level2-Container-Monolith" "C4 Level 2 - Container Diagram: Archkit Monolith POS System" {
            include *
            autoLayout tb
        }

        # ── C4 Level 3 — Product Module ───────────────────────────────────────
        component nestjsApp "C4-Level3-Component-Product-Module" "C4 Level 3 - Component Diagram: Product Module (Monolith)" {
            include productController zodPipeProduct productSchema productService productEntity productRepository mysqlDb httpClient
            autoLayout tb
        }

        # ── C4 Level 3 — Inventory Module ─────────────────────────────────────
        component nestjsApp "C4-Level3-Component-Inventory-Module" "C4 Level 3 - Component Diagram: Inventory Module (Monolith)" {
            include inventoryController zodPipeInventory inventorySchema inventoryService inventoryEntity inventoryRepository productService mysqlDb httpClient
            autoLayout tb
        }

        # ── C4 Level 3 — Sales Module ─────────────────────────────────────────
        component nestjsApp "C4-Level3-Component-Sales-Module" "C4 Level 3 - Component Diagram: Sales Module (Monolith)" {
            include salesController zodPipeSales salesSchema salesService datasource transactionRepository itemRepository salesTransactionEntity salesItemEntity productService inventoryService mysqlDb httpClient
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
