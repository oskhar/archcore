# Dokumentasi Lengkap Project ArchCore

Dokumen ini menjelaskan seluruh program, struktur, alur kerja, dan artefak penelitian dalam repository ArchCore. Tujuannya adalah membantu pembaca skripsi memahami apa yang dibangun, mengapa struktur repository dibuat demikian, bagaimana program berjalan, bagaimana eksperimen dilakukan, dan bagaimana hasil benchmark dihasilkan.

## 1. Identitas Project

| Aspek | Keterangan |
| --- | --- |
| Nama repository | `archcore` |
| Nama package root | `archkit-root` |
| Domain studi kasus | Backend aplikasi Point of Sale (POS) |
| Fokus penelitian | Evaluasi multi-dimensi arsitektur backend modern pada aplikasi data-intensive |
| Arsitektur pembanding | Monolith dan Hybrid/SCS |
| Bahasa utama | TypeScript |
| Runtime | Node.js |
| Framework backend | NestJS |
| Database | MySQL 8.0 |
| Message broker | Redpanda sebagai Kafka-compatible broker |
| Load testing | Artillery |
| Orkestrasi monorepo | npm workspaces dan TurboRepo |

Penelitian ini menggunakan aplikasi POS sebagai vertical slice yang cukup kecil untuk dikendalikan, tetapi tetap merepresentasikan karakteristik aplikasi data-intensive: data produk, stok, transaksi penjualan, perubahan inventori, dan sinkronisasi antar domain.

## 2. Tujuan Repository Dalam Penelitian

Repository ini berfungsi sebagai artefak pendukung skripsi. Artinya, repository tidak hanya berisi kode aplikasi, tetapi juga:

- implementasi backend monolith sebagai baseline;
- implementasi backend hybrid/SCS sebagai arsitektur eksperimen;
- kontrak API dan kontrak event;
- infrastruktur database dan broker;
- skenario load test;
- parser hasil eksperimen;
- generator laporan;
- diagram arsitektur;
- spesifikasi dan catatan keputusan implementasi;
- hasil benchmark mentah dan laporan hasil olahan.

Dengan struktur tersebut, pembaca skripsi dapat menelusuri hubungan antara teori, implementasi, prosedur eksperimen, data hasil eksperimen, dan laporan analisis.

## 3. Peta Repository

```text
archcore/
+-- apps/
|   +-- monolith/
|   +-- hybrid/
+-- docs/
+-- infrastructure/
|   +-- docker/
+-- laboratory/
|   +-- scenarios/
|   +-- src/
|   |   +-- engines/
|   |   +-- metrics/
|   |   +-- reporters/
|   |   +-- scripts/
|   +-- results/
|   +-- reports/
+-- reports/
+-- specs/
+-- package.json
+-- turbo.json
+-- readme.md
```

Penjelasan ringkas:

| Path | Isi | Peran penelitian |
| --- | --- | --- |
| `apps/monolith` | Backend POS monolith. | Baseline pembanding yang lebih sederhana dan terpusat. |
| `apps/hybrid` | Backend POS hybrid/SCS. | Arsitektur eksperimen dengan service terpisah dan event-driven synchronization. |
| `laboratory` | Load test, metrik, agregasi, laporan. | Mesin eksperimen dan penghasil data penelitian. |
| `infrastructure/docker` | Compose database, broker, aplikasi equal/scale. | Lingkungan reproduksi eksperimen. |
| `docs` | OpenAPI, proposal, dokumentasi project. | Dokumentasi kontrak dan konteks penelitian. |
| `reports` | Profil performa arsitektur. | Ringkasan hasil analitis tingkat repository. |
| `specs` | Spesifikasi iterasi dan task. | Traceability proses pengembangan. |

## 4. Konsep Domain POS

Vertical slice POS dalam repository ini terdiri dari tiga domain utama:

1. **Product**
   - Menyimpan master data produk.
   - Menyediakan operasi create, read, update, delete.
   - Menjadi sumber data referensi untuk inventory dan sales.

2. **Inventory**
   - Menyimpan jumlah stok per produk.
   - Mendukung penyesuaian stok positif atau negatif.
   - Pada hybrid, stok dapat dipengaruhi oleh event transaksi penjualan.

3. **Sales**
   - Membuat transaksi penjualan.
   - Menghitung total harga berdasarkan harga produk.
   - Menyimpan header transaksi dan item transaksi.
   - Pada hybrid, transaksi menghasilkan event untuk mengurangi stok inventory secara asynchronous.

Relasi bisnis sederhana:

```text
Product 1..1 -> Inventory
Product 1..n -> SalesItem
SalesTransaction 1..n -> SalesItem
```

Dalam monolith, relasi ini dijaga dalam satu aplikasi dan satu database. Dalam hybrid, relasi tersebut dipecah menjadi database dan service berbeda, sehingga konsistensi sebagian bergeser dari transaksi lokal menjadi sinkronisasi event.

## 5. Monorepo dan Script Root

File root `package.json` mendefinisikan workspace:

```json
{
  "workspaces": [
    "apps/monolith",
    "apps/hybrid",
    "laboratory"
  ]
}
```

Script root:

| Script | Fungsi |
| --- | --- |
| `npm run build` | Menjalankan `turbo build` untuk workspace. |
| `npm run lint` | Menjalankan `turbo lint`. |
| `npm run test` | Menjalankan `turbo test`. |
| `npm run format` | Format file TypeScript dengan Prettier. |
| `npm run start:monolith` | Menjalankan aplikasi monolith. |
| `npm run start:hybrid` | Menjalankan seluruh aplikasi hybrid melalui workspace hybrid. |

Root repository berperan sebagai pengendali workspace, bukan aplikasi runtime.

## 6. Arsitektur Monolith

### 6.1 Lokasi

Implementasi monolith berada di:

```text
apps/monolith/
```

### 6.2 Karakteristik

Monolith menggunakan satu proses NestJS dan satu database MySQL (`archkit_monolith`). Semua domain berada dalam aplikasi yang sama:

- `ProductModule`
- `InventoryModule`
- `SalesModule`
- `HealthController`
- `DiagnosticsController`

Entry point:

- `apps/monolith/src/main.ts`
- `apps/monolith/src/app.module.ts`

Port default:

```text
3000
```

### 6.3 Database Monolith

Konfigurasi database dibaca dari `apps/monolith/src/config/database.config.ts` dan `apps/monolith/src/config/data-source.ts`. Entity TypeORM yang digunakan:

| Entity | Tabel | Fungsi |
| --- | --- | --- |
| `Product` | `products` | Master data produk. |
| `Inventory` | `inventory` | Stok produk. |
| `SalesTransaction` | `sales_transactions` | Header transaksi penjualan. |
| `SalesItem` | `sales_items` | Item transaksi penjualan. |

Base entity menyediakan:

- `id` UUID;
- `createdAt`;
- `updatedAt`.

### 6.4 Modul Product Monolith

Lokasi:

```text
apps/monolith/src/product/
```

Komponen utama:

| File | Fungsi |
| --- | --- |
| `product.controller.ts` | HTTP controller `/products`. |
| `product.service.ts` | Business logic CRUD produk. |
| `entities/product.entity.ts` | Entity database produk. |
| `dto/product.schema.ts` | Skema validasi Zod. |
| `dto/product.dto.ts` | Type DTO dari skema Zod. |

Endpoint:

| Method | Path | Fungsi |
| --- | --- | --- |
| `POST` | `/products` | Membuat produk baru. |
| `GET` | `/products` | Mengambil seluruh produk. |
| `GET` | `/products/:id` | Mengambil produk berdasarkan UUID. |
| `PATCH` | `/products/:id` | Memperbarui sebagian atribut produk. |
| `DELETE` | `/products/:id` | Menghapus produk. |

Skema data produk:

| Field | Tipe | Aturan |
| --- | --- | --- |
| `name` | string | wajib, 1 sampai 255 karakter |
| `price` | number | wajib, positif |
| `description` | string | opsional |
| `category` | string | wajib, 1 sampai 50 karakter |

Alur create product:

```text
HTTP POST /products
-> ZodValidationPipe
-> ProductController.create()
-> ProductService.create()
-> TypeORM Repository.save()
-> row baru di tabel products
```

### 6.5 Modul Inventory Monolith

Lokasi:

```text
apps/monolith/src/inventory/
```

Komponen utama:

| File | Fungsi |
| --- | --- |
| `inventory.controller.ts` | HTTP controller `/inventory`. |
| `inventory.service.ts` | Business logic penyesuaian stok. |
| `entities/inventory.entity.ts` | Entity stok. |
| `dto/inventory.schema.ts` | Skema validasi Zod. |
| `dto/adjust-stock.dto.ts` | Type DTO. |

Endpoint:

| Method | Path | Fungsi |
| --- | --- | --- |
| `POST` | `/inventory/adjust` | Menambah atau mengurangi stok. |
| `GET` | `/inventory/:productId` | Mengambil jumlah stok produk. |

Skema request:

| Field | Tipe | Aturan |
| --- | --- | --- |
| `productId` | UUID string | wajib |
| `delta` | integer | wajib; positif untuk tambah stok, negatif untuk kurangi stok |

Perilaku penting:

- Service memverifikasi produk lewat `ProductService.findOne(productId)`.
- Jika inventory belum ada dan `delta` negatif, request ditolak dengan `BadRequestException`.
- Jika inventory belum ada dan `delta` positif, record inventory dibuat.
- Jika stok akhir menjadi negatif, request ditolak.
- Penyesuaian stok menggunakan `repo.increment()` dan update `lastSyncAt`.
- Method menerima optional `EntityManager`, sehingga sales transaction bisa mengubah stok dalam transaksi database yang sama.

### 6.6 Modul Sales Monolith

Lokasi:

```text
apps/monolith/src/sales/
```

Komponen utama:

| File | Fungsi |
| --- | --- |
| `sales.controller.ts` | HTTP controller `/sales`. |
| `sales.service.ts` | Business logic transaksi penjualan. |
| `entities/sales-transaction.entity.ts` | Header transaksi. |
| `entities/sales-item.entity.ts` | Item transaksi. |
| `dto/sales.schema.ts` | Skema validasi Zod. |
| `dto/create-transaction.dto.ts` | Type DTO. |

Endpoint:

| Method | Path | Fungsi |
| --- | --- | --- |
| `POST` | `/sales/transaction` | Membuat transaksi penjualan. |
| `GET` | `/sales/transactions/:id` | Mengambil transaksi beserta item. |

Skema request transaksi:

```json
{
  "items": [
    {
      "productId": "uuid",
      "quantity": 2
    }
  ]
}
```

Alur create transaction pada monolith:

```text
HTTP POST /sales/transaction
-> validasi Zod
-> dataSource.transaction()
   -> validasi setiap productId
   -> ambil harga produk
   -> hitung totalPrice
   -> kurangi inventory dengan EntityManager yang sama
   -> simpan SalesTransaction
   -> simpan SalesItem
-> commit transaksi
-> response transaksi dengan item
```

Implikasi arsitektural:

- Konsistensi product, inventory, dan sales dijaga secara synchronous dalam satu transaksi database.
- Latency transaksi bergantung pada jumlah item karena validasi produk dan pengurangan stok dilakukan berurutan.
- Kompleksitas operasional lebih rendah karena hanya ada satu service dan satu database.

## 7. Arsitektur Hybrid / SCS

### 7.1 Lokasi

Implementasi hybrid berada di:

```text
apps/hybrid/
```

Workspace internal:

```text
apps/hybrid/
+-- apps/
|   +-- api-gateway/
|   +-- product-service/
|   +-- inventory-service/
|   +-- sales-service/
|   +-- ping-service/
+-- packages/
    +-- contracts/
    +-- eslint-config/
    +-- tsconfig/
```

### 7.2 Karakteristik

Hybrid memecah domain POS menjadi beberapa proses:

| Service | Port default | Database | Tanggung jawab |
| --- | --- | --- | --- |
| `api-gateway` | `3000`, diekspos `4000` pada benchmark Docker | tidak punya DB | Entry point HTTP dan proxy ke service domain. |
| `product-service` | `3001` | `archkit_product` | CRUD produk dan publish event produk. |
| `inventory-service` | `3002` | `archkit_inventory` | Stok produk dan consumer event product/sales. |
| `sales-service` | `3003` | `archkit_sales` | Transaksi penjualan, cache produk, publish event sales. |
| `ping-service` | dummy service | tidak ada | Service placeholder untuk validasi workspace. |

Komunikasi hybrid terdiri dari:

- HTTP synchronous dari API Gateway ke service domain.
- Kafka/Redpanda asynchronous untuk sinkronisasi antar service.
- Database per service untuk pemisahan data.
- CQRS di service domain untuk memisahkan command dan query handler.

### 7.3 API Gateway

Lokasi:

```text
apps/hybrid/apps/api-gateway/
```

Komponen utama:

| File | Fungsi |
| --- | --- |
| `src/main.ts` | Bootstrap gateway, filter global, Kafka microservice. |
| `src/app.module.ts` | Registrasi controller, HTTP module, Kafka client. |
| `src/interface/products.controller.ts` | Proxy `/products` ke product-service. |
| `src/interface/inventory.controller.ts` | Proxy `/inventory` ke inventory-service. |
| `src/interface/sales.controller.ts` | Proxy `/sales` ke sales-service. |
| `src/common/filters/http-exception.filter.ts` | Normalisasi error HTTP. |
| `src/common/pipes/zod-validation.pipe.ts` | Validasi request DTO. |

Environment penting:

| Variable | Default | Fungsi |
| --- | --- | --- |
| `PORT` | `3000` | Port gateway. |
| `PRODUCT_SERVICE_URL` | `http://localhost:3001` | URL product-service. |
| `INVENTORY_SERVICE_URL` | `http://localhost:3002` | URL inventory-service. |
| `SALES_SERVICE_URL` | `http://localhost:3003` | URL sales-service. |
| `KAFKA_BROKERS` | `localhost:9092` | Broker Kafka/Redpanda. |

Optimasi gateway:

- HTTP keep-alive agent.
- `maxSockets` tinggi untuk burst concurrency.
- Timeout 8 detik agar request tidak menggantung terlalu lama.
- Logging production dibatasi ke `error` dan `warn`.
- Header `x-powered-by` dinonaktifkan.

Dalam benchmark Docker, monolith menggunakan port host `3000`, sedangkan hybrid gateway diekspos ke host `4000` agar keduanya bisa berjalan bersamaan.

### 7.4 Product Service

Lokasi:

```text
apps/hybrid/apps/product-service/
```

Tanggung jawab:

- Menjadi source of truth data produk.
- Menyediakan endpoint CRUD produk.
- Menerbitkan event `product.created`, `product.updated`, dan `product.deleted`.
- Menyediakan cache read in-memory untuk mengurangi query DB pada hot path.

Komponen utama:

| Komponen | Fungsi |
| --- | --- |
| `ProductController` | HTTP controller `/products`. |
| `CreateProductHandler` | Command handler create produk. |
| `UpdateProductHandler` | Command handler update produk. |
| `DeleteProductHandler` | Command handler delete produk. |
| `GetProductsHandler` | Query handler list produk. |
| `GetProductByIdHandler` | Query handler detail produk. |
| `ProductProducer` | Kafka producer event produk. |
| `ProductReadCacheService` | TTL cache untuk list dan detail produk. |
| `Product` entity | Tabel `products`. |

Alur create product:

```text
HTTP POST /products
-> ProductController
-> CommandBus.execute(CreateProductCommand)
-> CreateProductHandler
-> save Product ke MySQL product DB
-> invalidate list cache dan set by-id cache
-> emit product.created ke Kafka secara fire-and-forget
-> response HTTP dikembalikan tanpa menunggu consumer selesai
```

Cache product:

| Cache | TTL | Tujuan |
| --- | --- | --- |
| List cache `GET /products` | 3 detik | Menyerap burst read daftar produk. |
| By-ID cache `GET /products/:id` | 15 detik | Mengurangi repeated lookup produk yang sama. |

Trade-off:

- Cache memperbaiki throughput read.
- Pada mode scale dengan beberapa replica, setiap replica memiliki cache sendiri sehingga ada kemungkinan stale read sampai TTL selesai.
- Event produk dikirim fire-and-forget, sehingga service lain menerima update secara eventual consistency.

### 7.5 Inventory Service

Lokasi:

```text
apps/hybrid/apps/inventory-service/
```

Tanggung jawab:

- Menyimpan stok produk.
- Menyediakan endpoint adjust dan read stok.
- Membuat inventory kosong saat menerima `product.created`.
- Menghapus inventory saat menerima `product.deleted`.
- Mengurangi stok saat menerima `sales.transaction-completed`.
- Menerbitkan event `inventory.updated`.

Komponen utama:

| Komponen | Fungsi |
| --- | --- |
| `InventoryController` | HTTP controller `/inventory`. |
| `AdjustStockHandler` | Command handler penyesuaian stok. |
| `GetStockHandler` | Query handler read stok. |
| `InventoryRepository` | Repository khusus dengan raw SQL atomic upsert. |
| `InventoryReadCacheService` | TTL cache stok per productId. |
| `ProductEventConsumer` | Consumer event produk. |
| `SalesEventConsumer` | Consumer event transaksi sales. |
| `InventoryProducer` | Producer event inventory. |

Alur adjust stock langsung:

```text
HTTP POST /inventory/adjust
-> InventoryController
-> CommandBus.execute(AdjustStockCommand)
-> InventoryRepository.adjustStock()
   -> invalidate cache
   -> INSERT ... ON DUPLICATE KEY UPDATE quantity
   -> SELECT ulang inventory terbaru
   -> set cache
-> emit inventory.updated secara fire-and-forget
-> response inventory terbaru
```

Alur pengurangan stok akibat penjualan:

```text
sales-service menyimpan transaksi
-> sales-service emit sales.transaction-completed
-> inventory-service SalesEventConsumer menerima event
-> setiap item transaksi diproses dengan Promise.all()
-> InventoryRepository.adjustStockOnly(productId, -quantity)
-> stok berkurang secara asynchronous
```

Implikasi:

- Transaksi sales pada hybrid tidak menunggu inventory selesai dikurangi.
- Stok setelah transaksi bersifat eventually consistent.
- Ini menjadi salah satu sumber metrik arsitektural seperti consistency lag.

Optimasi repository inventory:

- Menggunakan atomic upsert `INSERT ... ON DUPLICATE KEY UPDATE`.
- Menghindari pola SELECT lalu SAVE yang rawan race condition.
- Menyediakan `adjustStockOnly()` untuk consumer event agar tidak perlu SELECT ulang ketika response tidak dibutuhkan.

### 7.6 Sales Service

Lokasi:

```text
apps/hybrid/apps/sales-service/
```

Tanggung jawab:

- Membuat transaksi penjualan.
- Menghitung total harga.
- Menyimpan header dan item transaksi.
- Menyimpan denormalized product cache untuk kebutuhan transaksi.
- Menerbitkan event `sales.transaction-completed`.
- Mengonsumsi event produk untuk menjaga `product_cache`.

Komponen utama:

| Komponen | Fungsi |
| --- | --- |
| `SalesController` | HTTP controller `/sales`. |
| `CreateSaleHandler` | Command handler create transaksi. |
| `GetSaleHandler` | Query handler read transaksi. |
| `SalesRepository` | Repository transaksi dengan query runner. |
| `ProductCacheService` | In-memory cache produk untuk hot path transaksi. |
| `SalesReadCacheService` | TTL cache transaksi. |
| `ProductEventConsumer` | Sinkronisasi product cache dari Kafka. |
| `SalesProducer` | Producer event sales. |

Alur create sale:

```text
HTTP POST /sales/transaction
-> SalesController
-> CommandBus.execute(CreateSaleCommand)
-> validasi quantity
-> cek ProductCacheService untuk setiap productId
-> jika cache miss, ambil semua miss dengan satu query IN
-> hitung total harga
-> SalesRepository.createTransaction()
   -> start transaction
   -> insert sales_transactions
   -> bulk insert sales_items
   -> commit
-> emit sales.transaction-completed secara fire-and-forget
-> response transaksi
```

Perbedaan kunci dibanding monolith:

- Sales service tidak melakukan join langsung ke tabel produk utama.
- Harga produk dibaca dari `product_cache`.
- Pengurangan inventory tidak dilakukan dalam transaksi database sales.
- Konsistensi inventory dicapai melalui event.

Cache sales:

| Cache | TTL | Tujuan |
| --- | --- | --- |
| Product in-memory cache | tidak berbasis TTL, diperbarui event dan warm-up DB | Menghindari DB lookup per item transaksi. |
| Sales transaction read cache | 60 detik | Aman karena transaksi dianggap immutable pada benchmark. |

### 7.7 Event Kafka

Topic/event yang digunakan:

| Event | Producer | Consumer | Fungsi |
| --- | --- | --- | --- |
| `product.created` | product-service | inventory-service, sales-service | Membuat inventory awal dan product cache. |
| `product.updated` | product-service | sales-service | Memperbarui product cache. |
| `product.deleted` | product-service | inventory-service, sales-service | Menghapus inventory dan product cache. |
| `sales.transaction-completed` | sales-service | inventory-service | Mengurangi stok setelah transaksi. |
| `inventory.updated` | inventory-service | belum menjadi dependency utama | Event observasi perubahan stok. |
| `health-ping` | api-gateway diagnostics | Kafka request-reply diagnostics | Validasi konektivitas Kafka. |

Pola pengiriman event:

- Producer menggunakan `ClientKafka.emit()`.
- Event dikirim fire-and-forget.
- HTTP response tidak menunggu event selesai diproses consumer.
- Keuntungan: latency command lebih rendah.
- Biaya: konsistensi antar service menjadi eventual.

## 8. Perbandingan Monolith dan Hybrid

| Dimensi | Monolith | Hybrid/SCS |
| --- | --- | --- |
| Proses aplikasi | Satu proses NestJS | Gateway + product + inventory + sales |
| Database | Satu MySQL | MySQL per service |
| Konsistensi transaksi sales-inventory | Synchronous dalam satu DB transaction | Asynchronous melalui event |
| Validasi produk pada sales | Langsung ke ProductService internal | Dari product cache di sales-service |
| Kompleksitas operasional | Lebih rendah | Lebih tinggi karena multi-service, broker, dan sinkronisasi |
| Potensi scale-out | Terbatas pada seluruh aplikasi | Bisa scale per service |
| Latency path sederhana | Umumnya lebih pendek | Ada hop gateway dan service |
| Failure mode | Terpusat | Tersebar, perlu observasi antar service |
| Cocok sebagai | Baseline | Arsitektur eksperimen |

## 9. Kontrak API

Kontrak API utama tersedia di:

```text
docs/openapi.yaml
docs/openapi/public/openapi.yaml
```

Endpoint utama sama pada monolith dan hybrid gateway:

| Method | Path | Deskripsi |
| --- | --- | --- |
| `GET` | `/health` | Status service. |
| `GET` | `/diagnostics/ping` | Diagnostik konektivitas. |
| `POST` | `/products` | Membuat produk. |
| `GET` | `/products` | Mengambil daftar produk. |
| `GET` | `/products/:id` | Mengambil produk berdasarkan ID. |
| `PATCH` | `/products/:id` | Memperbarui produk. |
| `DELETE` | `/products/:id` | Menghapus produk. |
| `POST` | `/inventory/adjust` | Menyesuaikan stok. |
| `GET` | `/inventory/:productId` | Mengambil stok produk. |
| `POST` | `/sales/transaction` | Membuat transaksi penjualan. |
| `GET` | `/sales/transactions/:id` | Mengambil transaksi. |

Catatan penting:

- Ada sedikit perbedaan skema product antara beberapa service hybrid. API gateway product DTO hanya mewajibkan `name` dan `price`, sedangkan monolith memiliki `category` dan `description`. Dalam skenario Artillery, request mengirim `category` dan `description`; Zod default akan mengabaikan field tambahan jika schema tidak strict.
- Pembaca yang ingin menilai kesetaraan kontrak perlu melihat `docs/openapi.yaml` dan source DTO secara bersamaan.

## 10. Validasi Request

Validasi request menggunakan Zod melalui `ZodValidationPipe`.

Lokasi pipe:

| Arsitektur | Path |
| --- | --- |
| Monolith | `apps/monolith/src/common/pipes/zod-validation.pipe.ts` |
| Hybrid API Gateway | `apps/hybrid/apps/api-gateway/src/common/pipes/zod-validation.pipe.ts` |
| Hybrid Inventory | `apps/hybrid/apps/inventory-service/src/interface/common/pipes/zod-validation.pipe.ts` |
| Hybrid Sales | `apps/hybrid/apps/sales-service/src/interface/common/pipes/zod-validation.pipe.ts` |
| Hybrid Product | Product controller belum memasang pipe pada controller domain, validasi utama terjadi di gateway. |

Fungsi validasi:

- Menolak request dengan tipe data salah.
- Memastikan UUID valid.
- Memastikan angka harga positif.
- Memastikan quantity transaksi positif.
- Memastikan array item transaksi tidak kosong.

## 11. Infrastruktur Docker

Lokasi:

```text
infrastructure/docker/
```

File penting:

| File | Fungsi |
| --- | --- |
| `docker-compose.yml` | Infrastruktur dasar: MySQL monolith, MySQL product, MySQL inventory, MySQL sales, Redpanda. |
| `docker-compose.monolith.yml` | Varian infra monolith dengan resource kecil. |
| `docker-compose.hybrid.yml` | Varian infra hybrid dengan tuning database dan Redpanda. |
| `docker-compose.apps.equal.yml` | Menjalankan aplikasi untuk benchmark equal resource. |
| `docker-compose.apps.scale.yml` | Menjalankan aplikasi untuk benchmark horizontal scale. |

Database dan port:

| Service | Database | Port host |
| --- | --- | --- |
| `mysql-monolith` | `archkit_monolith` | `3310` |
| `mysql-product` | `archkit_product` | `3307` |
| `mysql-inventory` | `archkit_inventory` | `3308` |
| `mysql-sales` | `archkit_sales` | `3309` |
| `redpanda` | Kafka-compatible broker | `9092`, admin `9644` |

Credential default:

```text
MYSQL_USER=archkit_user
MYSQL_PASSWORD=archkit_password
MYSQL_ROOT_PASSWORD=rootpassword
```

### 11.1 Equal Resource Benchmark

File:

```text
infrastructure/docker/docker-compose.apps.equal.yml
```

Tujuan:

- Membandingkan monolith dan hybrid ketika total resource aplikasi dikontrol.
- Memperlihatkan architectural tax dari gateway, network hop, service boundary, dan broker.

Resource utama:

| Arsitektur | Resource |
| --- | --- |
| Monolith | 2.0 CPU, 2 GB RAM |
| Hybrid | Gateway 0.8 CPU + 3 service x 0.4 CPU, sekitar 2 GB RAM total |

Port:

- Monolith: host `3000`.
- Hybrid gateway: host `4000`.

### 11.2 Horizontal Scale Benchmark

File:

```text
infrastructure/docker/docker-compose.apps.scale.yml
```

Tujuan:

- Menguji potensi scale-out hybrid.
- Hybrid diberi beberapa replica per service.
- Monolith diposisikan sebagai saturation baseline dengan resource lebih ketat.

Resource utama:

| Arsitektur | Resource |
| --- | --- |
| Monolith | 0.35 CPU, 384 MB RAM, DB terbatas |
| Hybrid | Gateway 2.5 CPU + 4 replica per service domain |

Catatan metodologis:

- Skenario scale bukan equal-resource comparison.
- Skenario ini menguji klaim utama microservices: kemampuan menggunakan tambahan resource lewat horizontal scaling.

## 12. Laboratory

Lokasi:

```text
laboratory/
```

Laboratory adalah subproject untuk menjalankan eksperimen dan menghasilkan laporan.

### 12.1 Script Laboratory

File:

```text
laboratory/package.json
```

Script penting:

| Script | Fungsi |
| --- | --- |
| `npm run db:refresh` | Menghapus isi tabel dari semua database eksperimen. |
| `npm run seed:monolith` | Stub seed monolith. Saat ini mencetak simulasi sukses. |
| `npm run seed:hybrid` | Stub seed hybrid. Saat ini mencetak simulasi sukses. |
| `npm run test:equal:us1` | Load test equal product lifecycle. |
| `npm run test:equal:us2` | Load test equal inventory sync. |
| `npm run test:equal:us3` | Load test equal sales transaction. |
| `npm run test:scale:us1` | Load test scale product lifecycle. |
| `npm run test:scale:us2` | Load test scale inventory sync. |
| `npm run test:scale:us3` | Load test scale sales transaction. |
| `npm run lab:report:equal` | Generate laporan benchmark equal. |
| `npm run lab:report:scale` | Generate laporan benchmark scale. |
| `npm run bottleneck:report:equal` | Generate laporan bottleneck equal. |
| `npm run bottleneck:report:scale` | Generate laporan bottleneck scale. |
| `npm run lab:tradeoff` | Generate laporan trade-off/ROI. |
| `npm run state-rehydration:report` | Generate laporan state rehydration. |

### 12.2 Skenario Artillery

Lokasi:

```text
laboratory/scenarios/
```

Skenario utama:

| File | Skenario | Deskripsi |
| --- | --- | --- |
| `equal-product-lifecycle.yml` | Equal Product CRUD | Create produk, get by id, patch, get list. |
| `equal-inventory-sync.yml` | Equal Inventory Sync | Create produk, tambah stok, baca stok, kurangi stok, baca stok. |
| `equal-sales-transaction.yml` | Equal Sales Transaction | Create produk, isi stok, transaksi sales, baca transaksi, baca stok. |
| `scale-product-lifecycle.yml` | Scale Product CRUD | Versi high-load product lifecycle. |
| `scale-inventory-sync.yml` | Scale Inventory Sync | Versi high-load inventory sync. |
| `scale-sales-transaction.yml` | Scale Sales Transaction | Versi high-load sales transaction. |
| `us1-product-lifecycle.yml` | US1 baseline | Skenario awal product lifecycle. |
| `us2-inventory-sync.yml` | US2 baseline | Skenario awal inventory sync. |
| `us3-sales-transaction.yml` | US3 baseline | Skenario awal sales transaction. |

Target default skenario adalah:

```text
http://localhost:3000
```

Untuk hybrid Docker benchmark, target harus dioverride:

```bash
-t http://localhost:4000
```

### 12.3 Pola Penyimpanan Hasil

Raw result Artillery disimpan sebagai JSON di:

```text
laboratory/results/
```

Konvensi nama file:

```text
{architecture}-{phase}-{scenario}-{timestamp}.json
```

Contoh:

```text
monolith-equal-product_crud-1782191759.json
hybrid-scale-sales_transaction-1782196945.json
```

Loader membaca nama file untuk menentukan:

- arsitektur (`MONOLITH` atau `HYBRID`);
- fase (`EQUAL` atau `SCALE`);
- skenario (`PRODUCT_CRUD`, `INVENTORY_SYNC`, `SALES_TRANSACTION`);
- run id.

### 12.4 Metrics Loader

Lokasi:

```text
laboratory/src/metrics/loader.ts
```

Tugas:

- Membaca file JSON Artillery.
- Memvalidasi struktur dengan Zod schema.
- Mengambil summary response time.
- Mengambil throughput dari `http.request_rate`.
- Menghitung success rate dari HTTP 200 dan 201.
- Mengambil failure rate.
- Mengambil jumlah virtual users.
- Mengambil timeline intermediate jika ada.

Metrik yang dihasilkan:

| Metric | Makna |
| --- | --- |
| `throughput` | Request per second dari Artillery. |
| `latency_p50` | Median latency. |
| `latency_p95` | Latency percentile 95. |
| `latency_p99` | Latency percentile 99. |
| `success_rate` | Rasio HTTP 200/201 terhadap total request. |
| `failure_rate` | Rasio request gagal. |
| `vusers_created` | Jumlah virtual users dibuat. |
| `vusers_failed` | Jumlah virtual users gagal. |
| `session_length_p95` | P95 durasi sesi virtual user. |
| `consistency_lag_ms` | Counter lag konsistensi jika tersedia. |
| `rehydration_time_ms` | Counter rehidrasi jika tersedia. |

### 12.5 Metrics Aggregator

Lokasi:

```text
laboratory/src/metrics/aggregator.ts
```

Tugas:

- Memfilter hasil valid.
- Mengelompokkan hasil per skenario.
- Memilih run terbaru untuk monolith dan hybrid.
- Mengambil metrik developer dari Git history.
- Menggabungkan metrik performa, arsitektural, dan developer.

Metrik developer yang diekstrak:

| Metric | Sumber | Makna |
| --- | --- | --- |
| `scs_files_touched` | `git log --numstat` | Banyak file yang tersentuh per arsitektur. |
| `scs_loc_churn` | `git log --numstat` | Total baris tambah + hapus. |
| `scs_commit_type_dist` | subject commit | Distribusi tipe Conventional Commit. |
| `scs_avg_files_per_commit` | file per commit | Granularitas rata-rata commit. |
| `scs_max_files_single_commit` | file per commit | Perubahan paling besar dalam satu commit. |

Jika ekstraksi Git gagal, aggregator menyediakan fallback angka default agar report tetap bisa dibuat. Untuk interpretasi akademik, pembaca harus memperhatikan apakah metrik berasal dari Git aktual atau fallback.

### 12.6 Reporter

Lokasi:

```text
laboratory/src/reporters/
```

Reporter utama:

| File | Fungsi |
| --- | --- |
| `automated-reporter.ts` | Membuat laporan benchmark utama. |
| `graph-reporter.ts` | Membuat grafik dari metrik. |
| `graph-generator.ts` | Utilitas grafik. |
| `bottleneck-reporter.ts` | Analisis bottleneck dan anomali. |
| `tradeoff-reporter.ts` | Analisis trade-off dan ROI. |
| `traceability-logger.ts` | Mencatat traceability hasil agregasi. |
| `generate-all-graphs.ts` | Membuat kumpulan grafik. |

Output laporan:

```text
laboratory/reports/
```

Contoh file:

- `BENCHMARK_REPORT_EQUAL_*.md`
- `BENCHMARK_REPORT_SCALE_*.md`
- `BOTTLENECK_REPORT_EQUAL_*.md`
- `BOTTLENECK_REPORT_SCALE_*.md`
- `TRADEOFF_REPORT_*.md`
- `STATE_REHYDRATION_REPORT_*.md`
- `BENCHMARK_REPORT_TRACE.md`

## 13. Cara Reproduksi Eksperimen

Panduan paling rinci ada di:

```text
laboratory/guide.md
```

Ringkasan prosedur:

### 13.1 Install dependency

```bash
npm install
```

### 13.2 Start infrastruktur dasar

```bash
docker compose -f infrastructure/docker/docker-compose.yml up -d
```

### 13.3 Build image aplikasi

```bash
docker compose \
  -f infrastructure/docker/docker-compose.yml \
  -f infrastructure/docker/docker-compose.apps.equal.yml \
  build
```

### 13.4 Jalankan equal resource benchmark

```bash
docker compose \
  -f infrastructure/docker/docker-compose.yml \
  -f infrastructure/docker/docker-compose.apps.equal.yml \
  up -d
```

Contoh monolith equal:

```bash
cd laboratory
npm run test:equal:us1 -- -o results/monolith-equal-product_crud-$(date +%s).json
```

Contoh hybrid equal:

```bash
cd laboratory
npm run test:equal:us1 -- -t http://localhost:4000 -o results/hybrid-equal-product_crud-$(date +%s).json
```

### 13.5 Jalankan scale benchmark

```bash
docker compose \
  -f infrastructure/docker/docker-compose.yml \
  -f infrastructure/docker/docker-compose.apps.scale.yml \
  up -d \
  --scale product-service=4 \
  --scale inventory-service=4 \
  --scale sales-service=4
```

### 13.6 Generate report

```bash
cd laboratory
npm run lab:report:equal
npm run lab:report:scale
npm run bottleneck:report:equal
npm run bottleneck:report:scale
npm run lab:tradeoff
```

## 14. Testing

Setiap aplikasi NestJS memiliki test unit/e2e.

### 14.1 Monolith

Lokasi test:

```text
apps/monolith/src/**/*.spec.ts
apps/monolith/test/*.e2e-spec.ts
```

Script:

| Script | Fungsi |
| --- | --- |
| `npm run test --workspace=apps/monolith` | Unit test. |
| `npm run test:e2e --workspace=apps/monolith` | E2E test. |
| `npm run test:product --workspace=apps/monolith` | Test domain product. |
| `npm run test:inventory --workspace=apps/monolith` | Test domain inventory. |
| `npm run test:sales --workspace=apps/monolith` | Test domain sales. |
| `npm run test:perf --workspace=apps/monolith` | Test performa e2e. |

### 14.2 Hybrid

Lokasi test:

```text
apps/hybrid/apps/api-gateway/test/
apps/hybrid/apps/product-service/test/
apps/hybrid/apps/inventory-service/test/
apps/hybrid/apps/sales-service/test/
```

Script tiap service:

```bash
npm run test --workspace=apps/hybrid/apps/product-service
npm run test:e2e --workspace=apps/hybrid/apps/product-service
```

Pola yang sama berlaku untuk `api-gateway`, `inventory-service`, dan `sales-service`.

## 15. Diagram Arsitektur

Diagram tersedia dalam format Mermaid, SVG, Structurizr DSL, dan PlantUML.

### 15.1 Monolith

Lokasi:

```text
apps/monolith/docs/diagrams/
```

Isi:

- C4 Level 1 System Context Monolith.
- C4 Level 2 Container Monolith.
- C4 Level 3 Component Product Module.
- C4 Level 3 Component Inventory Module.
- C4 Level 3 Component Sales Module.

### 15.2 Hybrid

Lokasi:

```text
apps/hybrid/docs/diagrams/
```

Isi:

- C4 Level 1 System Context Hybrid.
- C4 Level 2 Container Hybrid.
- C4 Level 3 Component Product Service.
- C4 Level 3 Component Inventory Service.
- C4 Level 3 Component Sales Service.

### 15.3 Blueprint Penelitian

Lokasi:

```text
specs/018-refine-pos-benchmark/blueprints/
```

Berisi PlantUML/SVG tambahan untuk konteks benchmark, flow sales, dan inventory synchronization.

## 16. Specs dan Traceability

Folder `specs/` berisi riwayat pengembangan berbasis spesifikasi. Setiap folder biasanya memuat:

- `spec.md`: kebutuhan fitur atau perubahan.
- `plan.md`: rencana implementasi.
- `research.md`: catatan riset teknis.
- `data-model.md`: rancangan model data.
- `quickstart.md`: panduan menjalankan fitur.
- `tasks.md`: daftar pekerjaan.
- `contracts/`: kontrak API, event, atau infrastruktur.

Contoh spesifikasi penting:

| Folder | Fokus |
| --- | --- |
| `000-pos-architecture-benchmark` | Fondasi benchmark POS. |
| `005-scs-baseline--product-domain` | Domain product baseline. |
| `006-inventory-domain` | Domain inventory. |
| `007-scs-baseline--sales-domain` | Domain sales. |
| `009-scs-hybrid-setup-turbo` | Setup hybrid monorepo. |
| `012-scs-hybrid-setup-kafka` | Setup Kafka/Redpanda. |
| `014-scs-hybrid--product-service` | Product service hybrid. |
| `015-scs-hybrid--inventory-service` | Inventory service hybrid. |
| `016-scs-hybrid--sales-service` | Sales service hybrid. |
| `018-refine-pos-benchmark` | Refinement benchmark dan kontrak. |
| `019-perf-profile-generation` | Profil performa. |

Nilai penelitian dari folder ini:

- Menunjukkan proses evolusi implementasi.
- Membantu pembaca memahami kenapa keputusan desain tertentu muncul.
- Menjadi artefak traceability dari requirement ke implementasi.

## 17. Laporan dan Hasil

Ada dua lokasi laporan:

```text
reports/
laboratory/reports/
```

`reports/ARCHITECTURAL_PERFORMANCE_PROFILE.md` berisi profil ringkas performa lintas load, termasuk:

- latency vs load;
- throughput vs load;
- success rate vs load;
- status healthy/degrading/critical;
- observasi degradasi.

`laboratory/reports/` berisi laporan dari generator laboratory, termasuk laporan equal, scale, bottleneck, tradeoff, traceability, dan state rehydration.

Cara membaca hasil:

1. Mulai dari benchmark report equal untuk memahami overhead arsitektur ketika resource dikontrol.
2. Lanjut ke benchmark report scale untuk melihat dampak horizontal scaling.
3. Baca bottleneck report untuk melihat anomali seperti timeout dan failure rate.
4. Baca tradeoff report untuk menghubungkan performa dengan kompleksitas.
5. Gunakan raw JSON di `laboratory/results` jika ingin melakukan validasi ulang.

## 18. Metrik Penelitian

### 18.1 Dimensi Teknis dan Kinerja

| Metric | Definisi |
| --- | --- |
| Throughput | Banyak request per detik. |
| Latency p50 | Median waktu response. |
| Latency p95 | 95% request selesai di bawah nilai ini. |
| Latency p99 | 99% request selesai di bawah nilai ini. |
| Success rate | Rasio request sukses HTTP 200/201. |
| Failure rate | Rasio request gagal. |
| VUsers created/failed | Banyak virtual user dibuat dan gagal. |

### 18.2 Dimensi Arsitektural

| Metric | Definisi |
| --- | --- |
| Consistency lag | Selisih waktu command dengan read model atau efek event. |
| Rehydration time | Waktu membangun ulang state dari data/event jika tersedia. |
| Storage footprint | Ukuran penyimpanan data atau event jika dihitung. |
| Bottleneck signal | Timeout, latency spike, throughput drop. |

### 18.3 Dimensi Developer

| Metric | Definisi |
| --- | --- |
| Files touched | Banyak file yang berubah dalam area arsitektur tertentu. |
| LOC churn | Total baris tambah dan hapus. |
| Commit type distribution | Distribusi tipe commit seperti feat, fix, refactor. |
| Avg files per commit | Rata-rata jumlah file per commit. |
| Max files single commit | Jumlah file terbanyak dalam satu commit. |

## 19. Keterbatasan Implementasi

Beberapa hal penting untuk interpretasi akademik:

- Implementasi adalah vertical slice, bukan sistem POS produksi penuh.
- Product, inventory, dan sales cukup merepresentasikan interaksi domain, tetapi belum mencakup pembayaran, customer, discount, audit penuh, dan reporting bisnis.
- Seed script di `laboratory/src/scripts/seed.ts` saat ini bersifat stub/simulasi. Data benchmark pada skenario Artillery dibuat dinamis melalui request create product.
- Hybrid menggunakan fire-and-forget Kafka emit. Ini menguntungkan latency command, tetapi membuka ruang inconsistency sementara.
- Cache in-memory tidak persistent antar restart dan tidak shared antar replica.
- Docker Compose resource limit pada non-Swarm environment dapat memiliki perilaku berbeda tergantung versi Docker. Interpretasi resource harus memperhatikan lingkungan eksekusi.
- Beberapa kontrak DTO tidak 100% identik antara monolith, gateway, dan service domain. Hal ini harus dicatat bila membahas parity API.
- Beberapa metrik arsitektural hanya tersedia jika counter terkait dicatat pada raw result.

## 20. Glosarium

| Istilah | Arti |
| --- | --- |
| Monolith | Aplikasi tunggal yang menjalankan beberapa domain dalam satu proses dan satu database. |
| Hybrid/SCS | Pendekatan service terpisah per domain, tetapi tetap mempertahankan API terpadu melalui gateway. |
| CQRS | Pemisahan command/write dan query/read. |
| Event-driven | Komunikasi antar service menggunakan event asynchronous. |
| Eventual consistency | Data antar service akan konsisten setelah propagasi event selesai, bukan seketika. |
| Read model | Representasi data yang dioptimalkan untuk query. |
| Product cache | Salinan data produk di sales-service untuk menghindari dependensi synchronous ke product-service. |
| Redpanda | Broker Kafka-compatible yang digunakan untuk event. |
| Artillery | Tool load testing berbasis skenario YAML. |
| p95 latency | Nilai latency yang mencakup 95% request tercepat. |
| Architectural tax | Biaya tambahan dari pilihan arsitektur, misalnya network hop, service boundary, dan sinkronisasi. |
| Scale-out | Menambah replica service untuk menaikkan kapasitas. |

## 21. Rekomendasi Urutan Baca Untuk Pembaca Skripsi

1. `readme.md` untuk ringkasan repository.
2. `docs/PROJECT_DOCUMENTATION.md` untuk dokumentasi lengkap.
3. `docs/research.md` untuk konteks proposal/skripsi.
4. `apps/monolith/docs/diagrams` untuk arsitektur baseline.
5. `apps/hybrid/docs/diagrams` untuk arsitektur eksperimen.
6. `docs/openapi.yaml` untuk kontrak API.
7. `laboratory/guide.md` untuk prosedur eksperimen.
8. `laboratory/scenarios/*.yml` untuk memahami beban uji.
9. `laboratory/results/*.json` untuk raw data.
10. `laboratory/reports/*.md` dan `reports/*.md` untuk hasil analisis.

## 22. Ringkasan Nilai Penelitian

Repository ini memungkinkan pembaca melihat penelitian sebagai artefak yang dapat ditelusuri:

```text
Teori arsitektur
-> spesifikasi kebutuhan
-> implementasi monolith
-> implementasi hybrid
-> kontrak API/event
-> skenario benchmark
-> raw result
-> agregasi metrik
-> laporan analisis
-> kesimpulan skripsi
```

Dengan demikian, pembaca tidak hanya melihat hasil akhir, tetapi juga dapat memeriksa bagaimana hasil tersebut diperoleh dan bagian kode mana yang memengaruhi metrik penelitian.
