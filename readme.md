# ArchCore: Repositori Pendukung Penelitian Arsitektur Backend POS

Repositori ini berisi artefak pendukung penelitian skripsi tentang evaluasi multi-dimensi pola arsitektur backend modern pada aplikasi data-intensive dengan studi kasus Point of Sale (POS). Program yang tersedia membandingkan dua pendekatan implementasi:

1. **Monolith** sebagai baseline pembanding.
2. **Hybrid / Self-Contained Services (SCS)** berbasis beberapa service, CQRS, event-driven synchronization, Kafka/Redpanda, dan database per service.

Dokumentasi lengkap untuk pembaca skripsi tersedia di:

- [Dokumentasi Lengkap Project](docs/PROJECT_DOCUMENTATION.md)
- [Panduan Laboratory dan Benchmark](laboratory/guide.md)
- [OpenAPI Specification](docs/openapi.yaml)
- [Dokumen Proposal/Penelitian](docs/research.md)
- [Laporan Profil Performa Arsitektur](reports/ARCHITECTURAL_PERFORMANCE_PROFILE.md)

## Ringkasan Struktur

| Path | Fungsi |
| --- | --- |
| `apps/monolith` | Implementasi backend POS monolith dengan NestJS, TypeORM, MySQL, modul product, inventory, dan sales. |
| `apps/hybrid` | Implementasi hybrid/SCS yang terdiri dari API Gateway, product-service, inventory-service, sales-service, paket kontrak, dan konfigurasi shared. |
| `laboratory` | Skenario load test Artillery, loader hasil, agregator metrik, dan generator laporan benchmark. |
| `infrastructure/docker` | Docker Compose untuk database, Redpanda/Kafka, skenario equal resource, dan skenario scale-out. |
| `docs` | Dokumen penelitian, OpenAPI, dan dokumentasi project. |
| `reports` | Laporan hasil benchmark dan profil performa. |
| `specs` | Riwayat spesifikasi, rencana implementasi, kontrak, task, dan keputusan desain per iterasi. |

## Teknologi Utama

- Node.js dan TypeScript.
- NestJS 11 untuk aplikasi backend.
- TypeORM 0.3 dengan MySQL 8.0.
- Kafka-compatible broker menggunakan Redpanda.
- `@nestjs/cqrs` pada service hybrid.
- Zod untuk validasi request DTO.
- Artillery untuk load testing.
- TurboRepo/npm workspaces untuk orkestrasi monorepo.
- Docker Compose untuk lingkungan eksperimen.

## Cara Cepat Menjalankan

Install dependency dari root:

```bash
npm install
```

Jalankan infrastruktur database dan Redpanda:

```bash
docker compose -f infrastructure/docker/docker-compose.yml up -d
```

Jalankan monolith secara lokal:

```bash
npm run start:monolith
```

Jalankan seluruh aplikasi hybrid secara lokal:

```bash
npm run start:hybrid
```

Untuk benchmark yang digunakan dalam penelitian, ikuti urutan rinci pada [laboratory/guide.md](laboratory/guide.md), karena prosedur tersebut mengatur port, resource budget, pembersihan database, skenario equal, skenario scale, dan generator laporan.

## Endpoint Utama

Kedua arsitektur menyediakan permukaan API POS yang setara:

| Method | Endpoint | Fungsi |
| --- | --- | --- |
| `POST` | `/products` | Membuat produk. |
| `GET` | `/products` | Mengambil daftar produk. |
| `GET` | `/products/:id` | Mengambil detail produk. |
| `PATCH` | `/products/:id` | Memperbarui produk. |
| `DELETE` | `/products/:id` | Menghapus produk. |
| `POST` | `/inventory/adjust` | Menambah atau mengurangi stok. |
| `GET` | `/inventory/:productId` | Mengambil kuantitas stok produk. |
| `POST` | `/sales/transaction` | Membuat transaksi penjualan. |
| `GET` | `/sales/transactions/:id` | Mengambil detail transaksi penjualan. |
| `GET` | `/health` | Health check service. |
| `GET` | `/diagnostics/ping` | Endpoint diagnostik konektivitas. |

Port default:

- Monolith: `http://localhost:3000`
- Hybrid API Gateway pada Docker benchmark: `http://localhost:4000`
- Product Service: `http://localhost:3001`
- Inventory Service: `http://localhost:3002`
- Sales Service: `http://localhost:3003`

## Alur Benchmark

Benchmark dibagi menjadi dua kelompok:

1. **Equal Resource Benchmark**: monolith dan hybrid dibandingkan dengan total resource aplikasi yang dikontrol agar architectural tax hybrid terlihat.
2. **Horizontal Scale Benchmark**: hybrid diberi replica per service untuk menunjukkan potensi scale-out, sedangkan monolith dipakai sebagai saturation baseline.

Skenario load test:

- `product_crud`: lifecycle create, read, update, list produk.
- `inventory_sync`: create produk, adjust stok, read stok, adjust stok negatif, read ulang.
- `sales_transaction`: create produk, isi stok, create transaksi, read transaksi, read stok.

Output benchmark disimpan di `laboratory/results`, kemudian diringkas menjadi laporan di `laboratory/reports`.

## Catatan Untuk Pembaca Skripsi

Repositori ini bukan hanya source code aplikasi, tetapi juga artefak reproduksibilitas penelitian. Untuk memahami hubungan antara kode, eksperimen, dan hasil skripsi, gunakan urutan baca berikut:

1. Baca [docs/PROJECT_DOCUMENTATION.md](docs/PROJECT_DOCUMENTATION.md) untuk pemahaman lengkap program.
2. Baca diagram C4 di `apps/monolith/docs/diagrams` dan `apps/hybrid/docs/diagrams`.
3. Baca [laboratory/guide.md](laboratory/guide.md) untuk prosedur eksperimen.
4. Baca laporan di `laboratory/reports` dan `reports`.
5. Gunakan `docs/openapi.yaml` untuk memeriksa kontrak API.

