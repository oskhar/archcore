# archkit Laboratory Guide: Benchmark Execution & Reporting

Panduan ini menjelaskan alur lengkap dari setup infrastruktur hingga menghasilkan seluruh laporan penelitian. Ikuti urutan ini secara sekuensial untuk memastikan isolasi dan keadilan pengujian antara arsitektur **Monolith (Baseline)** dan **Hybrid Microservices (Experimental)**.

---

## Daftar Isi

1. [Setup Infrastruktur](#1-setup-infrastruktur)
2. [Phase B: Equal Resource Benchmark](#2-phase-b-equal-resource-benchmark)
3. [Phase C: Horizontal Scale Benchmark](#3-phase-c-horizontal-scale-benchmark)
4. [Generate Semua Report](#4-generate-semua-report)
5. [Interpretasi Hasil](#5-interpretasi-hasil)
6. [Parameter Penelitian](#6-parameter-penelitian)
7. [Data Integrity & Troubleshooting](#7-data-integrity--troubleshooting)

---

## 1. Setup Infrastruktur

### 1.1 Skema Pengujian

Benchmark dijalankan dua kali menggunakan skema resource yang berbeda:

| Skema | File | Deskripsi |
|-------|------|-----------|
| **Equal** | `docker-compose.apps.equal.yml` | Total app budget dikontrol ketat. Hybrid berjalan 1 replica per service sehingga overhead gateway/network terlihat jelas. |
| **Scale** | `docker-compose.apps.scale.yml` | Hybrid diberi horizontal scale besar, sedangkan monolith sengaja diberi resource sangat terbatas sebagai saturation baseline. |

> **Distribusi Resource (Equal):**
> - Monolith: 2.0 CPU, 2GB RAM (1 proses)
> - Hybrid: Gateway 0.8 CPU + 3 services x 0.4 CPU = **2.0 CPU total**, Gateway 768MB + 3 services x 448MB = **~2.1GB**
>
> **Distribusi Resource (Scale):**
> - Monolith: 0.35 CPU, 384MB RAM, DB buffer pool 128MB, max connection 50
> - Hybrid: Gateway 2.5 CPU + 3 service group x 4 replicas x 0.75 CPU = **11.5 CPU total**

### 1.2 Start Infrastruktur Dasar

Jalankan database (MySQL per-service/monolith) dan Kafka (Redpanda) terlebih dahulu:

```bash
# Dari root direktori archkit/
docker compose -f infrastructure/docker/docker-compose.yml up -d

# Tunggu hingga semua service healthy (~30 detik)
docker compose -f infrastructure/docker/docker-compose.yml ps
```

### 1.3 Build Image Aplikasi

Build kedua arsitektur sekaligus (cukup sekali, kecuali ada perubahan kode):

```bash
# Build untuk Equal test (juga berlaku untuk Scale karena image sama)
docker compose \
  -f infrastructure/docker/docker-compose.yml \
  -f infrastructure/docker/docker-compose.apps.equal.yml \
  build
```

---

## 2. Phase B: Equal Resource Benchmark

*Mengukur konsekuensi arsitektur ketika hardware dikontrol secara ketat.*

### 2.1 Start Environment

```bash
docker compose \
  -f infrastructure/docker/docker-compose.yml \
  -f infrastructure/docker/docker-compose.apps.equal.yml \
  up -d

# Verifikasi semua container berjalan
docker compose \
  -f infrastructure/docker/docker-compose.yml \
  -f infrastructure/docker/docker-compose.apps.equal.yml \
  ps
```

### 2.2 Bersihkan & Isi Data Awal

Lakukan refresh database untuk *clean slate* sebelum setiap benchmark run:

```bash
cd laboratory/

# Refresh semua database (hapus data lama)
npm run db:refresh

# Seed 1000 produk ke Monolith dan Hybrid
npm run seed:monolith -- --items 1000
npm run seed:hybrid -- --items 1000
```

### 2.3 Jalankan Semua Skenario Pengujian

Jalankan secara **sekuensial** (tidak paralel) untuk menghindari resource contention:

```bash
cd laboratory/
```

Gunakan script environment-specific berikut agar beban Equal dan Scale tidak tercampur:

```bash
# ── Monolith (target: port 3000) ──────────────────────────────
npm run test:equal:us1 -- \
  -o results/monolith-equal-product_crud-$(date +%s).json

npm run test:equal:us2 -- \
  -o results/monolith-equal-inventory_sync-$(date +%s).json

npm run test:equal:us3 -- \
  -o results/monolith-equal-sales_transaction-$(date +%s).json

# ── Hybrid (target: port 4000 — API Gateway) ──────────────────
npm run test:equal:us1 -- \
  -t http://localhost:4000 \
  -o results/hybrid-equal-product_crud-$(date +%s).json

npm run test:equal:us2 -- \
  -t http://localhost:4000 \
  -o results/hybrid-equal-inventory_sync-$(date +%s).json

npm run test:equal:us3 -- \
  -t http://localhost:4000 \
  -o results/hybrid-equal-sales_transaction-$(date +%s).json
```

> **Penting:** Monolith berjalan di port `3000`, Hybrid API Gateway di port `4000`.

### 2.4 Stop Environment

```bash
docker compose \
  -f infrastructure/docker/docker-compose.yml \
  -f infrastructure/docker/docker-compose.apps.equal.yml \
  down
```

---

## 3. Phase C: Horizontal Scale Benchmark

*Mengukur kekuatan elastisitas microservices saat diberi kebebasan untuk horizontal scaling.*

### 3.1 Start Environment

```bash
docker compose \
  -f infrastructure/docker/docker-compose.yml \
  -f infrastructure/docker/docker-compose.apps.scale.yml \
  up -d \
  --scale product-service=4 \
  --scale inventory-service=4 \
  --scale sales-service=4

# Verifikasi semua replicas berjalan (4x per service)
docker compose \
  -f infrastructure/docker/docker-compose.yml \
  -f infrastructure/docker/docker-compose.apps.scale.yml \
  ps
```

### 3.2 Bersihkan & Isi Data Awal

```bash
cd laboratory/

npm run db:refresh
npm run seed:monolith -- --items 1000
npm run seed:hybrid -- --items 1000
```

### 3.3 Jalankan Semua Skenario Pengujian

```bash
cd laboratory/

# ── Monolith Scale Baseline (port 3000) ───────────────────────
npm run test:scale:us1 -- \
  -o results/monolith-scale-product_crud-$(date +%s).json

npm run test:scale:us2 -- \
  -o results/monolith-scale-inventory_sync-$(date +%s).json

npm run test:scale:us3 -- \
  -o results/monolith-scale-sales_transaction-$(date +%s).json

# ── Hybrid Scale (port 4000 — 4 replicas per service) ─────────
npm run test:scale:us1 -- \
  -t http://localhost:4000 \
  -o results/hybrid-scale-product_crud-$(date +%s).json

npm run test:scale:us2 -- \
  -t http://localhost:4000 \
  -o results/hybrid-scale-inventory_sync-$(date +%s).json

npm run test:scale:us3 -- \
  -t http://localhost:4000 \
  -o results/hybrid-scale-sales_transaction-$(date +%s).json
```

### 3.4 Stop Environment

```bash
docker compose \
  -f infrastructure/docker/docker-compose.yml \
  -f infrastructure/docker/docker-compose.apps.scale.yml \
  down
```

---

## 4. Generate Semua Report

Setelah semua raw data terkumpul di folder `results/`, jalankan seluruh report generation berikut. Semua output disimpan di `reports/`.

```
reports/
├── BENCHMARK_REPORT_EQUAL_[timestamp].md     ← Lab report Equal
├── BENCHMARK_REPORT_SCALE_[timestamp].md     ← Lab report Scale
├── BOTTLENECK_REPORT_EQUAL_[timestamp].md    ← Analisis bottleneck Equal
├── BOTTLENECK_REPORT_SCALE_[timestamp].md    ← Analisis bottleneck Scale
├── BENCHMARK_REPORT_TRACE.md                 ← Traceability log
└── graphs/
    ├── EQUAL-*_timeline_throughput.png
    ├── EQUAL-*_timeline_latency.png
    ├── EQUAL-*_radar_evaluation.png
    ├── SCALE-*_timeline_throughput.png
    └── ...
```

### 4.1 Lab Report — Evaluasi Multi-Dimensi

Laporan utama yang membandingkan Monolith vs Hybrid per skenario, mencakup grafik throughput, latency, complexity, dan radar chart.

```bash
cd laboratory/

# Report untuk skema Equal (Architectural Tax)
npm run lab:report:equal

# Report untuk skema Scale (Elasticity Advantage)
npm run lab:report:scale

# (Opsional) Report untuk semua data sekaligus
npm run lab:report
```

**Output:**
- `reports/BENCHMARK_REPORT_EQUAL_[timestamp].md`
- `reports/BENCHMARK_REPORT_SCALE_[timestamp].md`
- `reports/graphs/*.png` (semua visualisasi)

### 4.2 Bottleneck Report — Analisis Anomali & Root Cause

Laporan diagnosa yang menganalisis ETIMEDOUT, success rate drop, latency anomaly, dan mengklasifikasikan mana yang *architectural tax* wajar vs bug konfigurasi.

```bash
cd laboratory/

# Bottleneck report untuk skema Equal
npm run bottleneck:report:equal

# Bottleneck report untuk skema Scale
npm run bottleneck:report:scale

# (Opsional) Bottleneck report untuk semua data sekaligus
npm run bottleneck:report
```

**Output:**
- `reports/BOTTLENECK_REPORT_EQUAL_[timestamp].md`
- `reports/BOTTLENECK_REPORT_SCALE_[timestamp].md`

### 4.3 One-Shot: Generate Semua Report Sekaligus

Untuk menghasilkan semua laporan dalam satu perintah:

```bash
cd laboratory/

npm run lab:report:equal && \
npm run lab:report:scale && \
npm run bottleneck:report:equal && \
npm run bottleneck:report:scale

echo "✅ All reports generated in laboratory/reports/"
```

---

## 5. Interpretasi Hasil

### 5.1 Urutan Baca Report yang Direkomendasikan

```
1. BENCHMARK_REPORT_EQUAL   → Pahami trade-off baseline (beban setara)
2. BENCHMARK_REPORT_SCALE   → Lihat kekuatan scaling hybrid (beban tinggi)
3. BOTTLENECK_REPORT_EQUAL  → Diagnosa anomali di beban setara
4. BOTTLENECK_REPORT_SCALE  → Diagnosa anomali di beban tinggi
```

### 5.2 Ekspektasi Hasil yang Valid

| Skenario | Ekspektasi Wajar | Tanda Red Flag |
|----------|-----------------|----------------|
| **EQUAL — beban ringan/sedang** | Monolith sedikit lebih cepat (p50/p95 lebih rendah). Hybrid success rate ≥ 93%. | Success rate Hybrid < 85% → ada bug, bukan architectural tax. |
| **EQUAL — throughput** | Hybrid max -20% dari Monolith (overhead inherent). | Hybrid > -30% → bottleneck konfigurasi, bukan arsitektur. |
| **SCALE — throughput** | Hybrid +30–60% dari Monolith (horizontally scaled). | Hybrid tidak lebih tinggi → gateway bottleneck atau Kafka SMP too low. |
| **SCALE — latency p95** | Hybrid lebih tinggi (network hop), tapi Monolith mulai degradasi. | Keduanya sangat tinggi → infrastructure bottleneck (Redpanda SMP, DB pool). |

### 5.3 Visualisasi Utama

| Grafik | Cara Membacanya |
|--------|----------------|
| **Timeline Throughput** | Garis stabil = sistem sehat. Garis turun tajam = saturation point tercapai. |
| **Timeline Latency (p50, p95, p99)** | Jarak antara p50 dan p99 menunjukkan konsistensi. Gap besar = tail latency problem. |
| **Throughput Comparison Bar** | Bar Hybrid > Monolith di SCALE = skalabilitas terbukti. |
| **Radar Chart (Multi-Dimensi)** | Area luas = arsitektur lebih baik secara keseluruhan. Lihat trade-off per dimensi. |
| **Complexity vs Performance** | Titik kanan-bawah = kompleksitas tinggi, performa rendah (worst case). |

---

## 6. Parameter Penelitian

### 6.1 Skenario Benchmark

| Skenario | File | Fase | Deskripsi |
|----------|------|------|-----------|
| **US1** | `us1-product-lifecycle.yml` | Warm-up (60s) + Sustained (300s) | Product CRUD lifecycle lengkap |
| **US2** | `us2-inventory-sync.yml` | Warm-up (60s) + Sustained (240s) + Stress (60s) | Stock adjustment & sync via event |
| **US3** | `us3-sales-transaction.yml` | Warm-up (60s) + Sustained (240s) + Stress (60s) | E2E sales transaction (multi-service) |

> **Catatan:** US2 dan US3 memiliki stress phase untuk memaksa hybrid menunjukkan keunggulan elastisitasnya di bawah tekanan tinggi.

### 6.2 Parameter yang Dapat Disesuaikan

| Parameter | Lokasi | Tujuan Penelitian |
|-----------|--------|-------------------|
| `arrivalRate` | `scenarios/*.yml` | Tingkatkan untuk mencari breaking point Monolith |
| `connectionLimit` | `app.module.ts` per service | Tuning pool DB untuk throughput optimal |
| `--smp` | `docker-compose.yml` (Redpanda) | Kafka thread count (saat ini: 2) |
| `maxSockets` | `api-gateway/app.module.ts` | HTTP connection pool ke downstream services |
| `cpus` (Gateway) | `docker-compose.apps.equal.yml` | Redistribusi resource untuk fairness test |

---

## 7. Data Integrity & Troubleshooting

### 7.1 Validasi Data Sebelum Generate Report

Sebelum menjalankan report generation, pastikan folder `results/` berisi semua 12 file yang dibutuhkan:

```bash
ls laboratory/results/ | sort

# Ekspektasi (12 file):
# hybrid-equal-inventory_sync-*.json
# hybrid-equal-product_crud-*.json
# hybrid-equal-sales_transaction-*.json
# hybrid-scale-inventory_sync-*.json
# hybrid-scale-product_crud-*.json
# hybrid-scale-sales_transaction-*.json
# monolith-equal-inventory_sync-*.json
# monolith-equal-product_crud-*.json
# monolith-equal-sales_transaction-*.json
# monolith-scale-inventory_sync-*.json
# monolith-scale-product_crud-*.json
# monolith-scale-sales_transaction-*.json
```

Jika ada file yang hilang, jalankan ulang skenario yang bersangkutan saja.

### 7.2 Validasi Isi Data

Setiap file JSON hasil Artillery harus memiliki:
- `aggregate.counters["http.requests"] > 0`
- `aggregate.rates["http.request_rate"] > 0`
- `aggregate.summaries["http.response_time"]` tidak null

Jika report muncul "kosong" untuk skenario tertentu, periksa file JSON dengan:

```bash
cat laboratory/results/hybrid-equal-product_crud-*.json | \
  python3 -c "import json,sys; d=json.load(sys.stdin); \
  print('requests:', d['aggregate']['counters'].get('http.requests')); \
  print('rps:', d['aggregate']['rates'].get('http.request_rate')); \
  print('p95:', d['aggregate']['summaries'].get('http.response_time', {}).get('p95'))"
```

### 7.3 Development Metrics (Git Automation)

SCS metrics (files touched, LOC churn, commit intervals) diekstrak otomatis dari git log saat report dijalankan. Pastikan:

1. Repository ada dalam git (bukan bare directory)
2. Commit dilakukan secara **atomic** — satu logical task per commit
3. Prefix commit sesuai conventional commits: `feat:`, `fix:`, `refactor:`, dll.

### 7.4 Troubleshooting Umum

| Gejala | Kemungkinan Penyebab | Solusi |
|--------|---------------------|--------|
| Hybrid success rate < 80% | HttpModule timeout tidak dikonfigurasi | Verifikasi `api-gateway/src/app.module.ts` → `HttpModule.register({ timeout: 8000 })` |
| ETIMEDOUT > 10% | Koneksi TCP tidak di-pool | Periksa `keepAlive: true, maxSockets: 50` di HttpAgent |
| Scale tidak meningkatkan throughput | Gateway bottleneck atau SMP Redpanda terlalu rendah | Cek `cpus: '2.0'` di gateway (scale config) dan `--smp 2` di Redpanda |
| Report grafik kosong | File JSON tidak valid atau skenario tidak ada pasangannya | Jalankan `DataValidator` check manual pada file JSON |
| `subscribeToResponseOf` error | Kafka producer salah pattern | Pastikan hanya dipakai untuk `send()`, bukan `emit()` |
| TypeORM connection timeout | Pool terlalu kecil | `connectionLimit` harus ≥ 20 di semua services |
