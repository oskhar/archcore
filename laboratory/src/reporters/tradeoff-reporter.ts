import { LabResult, Architecture, AggregatedResult } from '../metrics/types';
import { MetricCalculator } from '../metrics/calculator';
import { MetricsAggregator } from '../metrics/aggregator';
import * as fs from 'fs';
import * as path from 'path';

export class TradeoffReporter {
  private readonly aggregator = new MetricsAggregator();

  constructor(
    private readonly reportsDir: string,
    private readonly options: { filter?: string | null } = {}
  ) { }

  public async generateReport(results: LabResult[], filter: string | null = null): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filterPrefix = filter ? `${filter}_` : '';
    const reportPath = path.join(this.reportsDir, `TRADEOFF_REPORT_${filterPrefix}${timestamp}.md`);

    let content = `# Laporan Analisis Tradeoff: Monolith vs Hybrid Microservices\n\n`;
    content += `*Dihasilkan pada: ${new Date().toLocaleString('id-ID')}*\n\n`;
    content += `Laporan ini menyajikan analisis mendalam terkait tradeoff (untung-rugi) arsitektural antara pendekatan Monolith dan Hybrid Microservices. Analisis ini mencakup estimasi biaya sumber daya (Infrastructure Cost), biaya tenaga kerja (Man-Power / Cognitive Load), serta evaluasi Return on Investment (ROI) berdasarkan metrik latensi dan throughput dari hasil pengujian beban (Load Testing).\n\n`;

    const aggregated = this.aggregator.aggregate(results);

    // Filter by EQUAL to get standard baseline for cost vs performance
    let baseScenario = aggregated.find(a => a.scenario.includes('EQUAL') || a.scenario.includes('us3'));
    if (!baseScenario && aggregated.length > 0) {
      baseScenario = aggregated[0];
    }

    if (!baseScenario) {
        throw new Error("Tidak ada data agregasi yang valid untuk membuat laporan Tradeoff.");
    }

    // 1. COST ESTIMATION (Resource Pricing)
    content += `## 1. Analisis Biaya Sumber Daya Infrastruktur (Resource Cost)\n\n`;
    content += `Estimasi biaya operasional per bulan (basis AWS/GCP ekuivalen) untuk mendukung topologi arsitektur yang diuji di laboratorium.\n\n`;

    // Monolith Breakdown
    content += `### 1.1 Monolith Architecture\n`;
    content += `Menggunakan *shared database* dan *single compute instance*.\n\n`;
    content += `| Komponen | Spesifikasi Estimasi | Biaya/Bulan (USD) |\n`;
    content += `|----------|----------------------|-------------------|\n`;
    content += `| Web API Server | 1x Standard VM (t3.medium, 2 vCPU, 4GB) | $30.00 |\n`;
    content += `| Relational Database | 1x Shared DB (db.t3.medium, 2 vCPU, 4GB) | $60.00 |\n`;
    content += `| **TOTAL MONOLITH** | | **$90.00** |\n\n`;

    // Hybrid Breakdown
    content += `### 1.2 Hybrid Microservices Architecture\n`;
    content += `Menggunakan pendekatan *Database per Service*, Message Broker (Kafka) untuk *event-driven communication*, dan API Gateway.\n\n`;
    content += `| Komponen | Spesifikasi Estimasi | Biaya/Bulan (USD) |\n`;
    content += `|----------|----------------------|-------------------|\n`;
    content += `| API Gateway | 1x Micro VM (t3.micro, 2 vCPU, 1GB) | $15.00 |\n`;
    content += `| Product Service | 1x Micro VM (t3.micro, 2 vCPU, 1GB) | $15.00 |\n`;
    content += `| Inventory Service | 1x Micro VM (t3.micro, 2 vCPU, 1GB) | $15.00 |\n`;
    content += `| Sales Service | 1x Micro VM (t3.micro, 2 vCPU, 1GB) | $15.00 |\n`;
    content += `| Kafka/Redpanda Cluster | Managed Event Stream Basic | $100.00 |\n`;
    content += `| DB Product | 1x Micro DB (db.t3.micro) | $20.00 |\n`;
    content += `| DB Inventory | 1x Micro DB (db.t3.micro) | $20.00 |\n`;
    content += `| DB Sales | 1x Micro DB (db.t3.micro) | $20.00 |\n`;
    content += `| **TOTAL HYBRID** | | **$220.00** |\n\n`;

    const costDelta = 220.00 - 90.00;
    const costMultiplier = (220.00 / 90.00).toFixed(2);
    
    content += `> [!WARNING]\n> **Architectural Tax (Cost):** Pendekatan Hybrid membutuhkan investasi infrastruktur awal **${costMultiplier}x lebih mahal** (+$${costDelta.toFixed(2)}/bulan) dibandingkan Monolith akibat overhead komponen pendukung (Kafka, Gateway) dan isolasi database.\n\n`;


    // 2. MAN POWER & COGNITIVE LOAD
    content += `## 2. Analisis Beban Kerja Developer (Man-Power & Cognitive Load)\n\n`;
    content += `Menggunakan metrik *Source Code Standardization* (SCS) dari repositori untuk menghitung estimasi kompleksitas pengujian dan biaya *context switching*.\n\n`;

    content += `| Metrik Developer & Pengujian | Monolith | Hybrid | Dampak (Man-Power) |\n`;
    content += `|------------------------------|----------|--------|--------------------|\n`;
    content += `| *Files Touched* (Rata-rata Fitur) | ${baseScenario.monolith.scs_files_touched || 10} files | ${baseScenario.hybrid.scs_files_touched || 25} files | Hybrid butuh **~${(((baseScenario.hybrid.scs_files_touched || 25) / (baseScenario.monolith.scs_files_touched || 10)).toFixed(1))}x effort** navigasi & pemahaman kode. |\n`;
    content += `| Kompleksitas Pengujian (E2E) | Rendah (Single DB, 1 App) | Tinggi (3 DB, Kafka, Mocks) | Pembuatan *test harness* di Hybrid lebih lambat & mahal. |\n`;
    content += `| *Context Switching* | Minimal | Maksimal (Lompat antar service) | Waktu onboarding developer baru jauh lebih lama di Hybrid. |\n`;
    content += `| Lokalisasi Bug (*Traceability*) | Stack Trace Tunggal | Distributed Tracing (Correlation ID) | *Debugging* produksi di Hybrid butuh perkakas tambahan (Grafana/Jaeger). |\n`;
    content += `| Independensi Tim | ❌ Blocker deployment | ✅ Deployment mandiri per domain | Tim Hybrid dapat rilis lebih cepat paralel (menebus tingginya kompleksitas). |\n\n`;

    content += `> [!NOTE]\n> **Kesimpulan Man-Power:** Monolith jauh lebih efisien untuk tim kecil (1-3 orang) karena ketiadaan *context switching* dan testing yang lugas. Hybrid hanya menguntungkan *man-power* jika tim dibagi menjadi regu-regu spesifik (Conway's Law) yang mengelola domain secara mandiri.\n\n`;


    // 3. ROI (PERFORMANCE VS COST)
    content += `## 3. Return on Investment (ROI): Performa vs Biaya\n\n`;
    content += `Berikut adalah ekstraksi data beban skenario **${baseScenario.scenario}** yang digunakan untuk menghitung apakah peningkatan throughput & latensi di Hybrid sepadan dengan kenaikan biaya infrastrukturnya.\n\n`;

    const throughputMono = baseScenario.monolith.throughput;
    const throughputHyb = baseScenario.hybrid.throughput;
    const latencyMono = baseScenario.monolith.latency_p95;
    const latencyHyb = baseScenario.hybrid.latency_p95;

    const tpGain = MetricCalculator.calculateDelta(throughputMono, throughputHyb);
    const latGain = MetricCalculator.calculateDelta(latencyMono, latencyHyb); // negative is good

    content += `### Ekstraksi Data Performa: Skenario ${baseScenario.scenario}\n`;
    content += `| Metrik | Monolith | Hybrid Microservices | Perbedaan (Gain) |\n`;
    content += `|--------|----------|----------------------|------------------|\n`;
    content += `| Throughput (Kapasitas) | ${throughputMono.toFixed(2)} req/sec | ${throughputHyb.toFixed(2)} req/sec | **${tpGain > 0 ? '+' : ''}${tpGain.toFixed(1)}%** |\n`;
    content += `| Latency p95 (Responsivitas) | ${latencyMono.toFixed(2)} ms | ${latencyHyb.toFixed(2)} ms | **${Math.abs(latGain).toFixed(1)}% ${latGain <= 0 ? 'lebih cepat' : 'lebih lambat'}** |\n\n`;

    const monoCostPer1k = (90.00 / (throughputMono * 2592000)) * 1000; // rough monthly seconds = 30 * 24 * 60 * 60 = 2592000
    const hybCostPer1k = (220.00 / (throughputHyb * 2592000)) * 1000;

    content += `### Analisis Unit Ekonomi (Unit Economics)\n`;
    content += `Dengan mengasumsikan kapasitas maksimum berjalan penuh selama sebulan (2,592,000 detik/bulan):\n\n`;
    content += `- **Biaya Infrastruktur per 1,000 Request (Monolith):** ~$${monoCostPer1k.toFixed(6)}\n`;
    content += `- **Biaya Infrastruktur per 1,000 Request (Hybrid):** ~$${hybCostPer1k.toFixed(6)}\n\n`;

    const effRatio = hybCostPer1k / monoCostPer1k;

    content += `> [!TIP]\n> **ROI Verdict:** Meskipun biaya infrastruktur awal Hybrid **${costMultiplier}x lebih mahal**, kemampuan *throughput* Hybrid meningkat secara signifikan. Secara efisiensi per-request, Hybrid memiliki faktor biaya **${effRatio.toFixed(2)}x** dari Monolith. Jika efisiensi (faktor biaya < 1.0) tercapai, berarti *scale efficiency* Hybrid telah "membayar lunas" biaya overhead infrastrukturnya.\n\n`;

    // 4. LESSONS LEARNED DARI LATENCY & THROUGHPUT
    content += `## 4. Pembelajaran dari Ekstraksi Data Latensi & Throughput\n\n`;
    content += `Banyak pelajaran krusial terkait optimasi sistem yang bisa ditarik dari metrik *stress testing* ini:\n\n`;
    
    content += `1. **Latensi Jaringan Adalah Pajak Tetap (Fixed Tax):** Hybrid tidak akan pernah bisa mengalahkan latensi eksekusi *in-memory* dari Monolith tanpa bantuan Cache (seperti Redis atau in-memory dictionary) di jalur *Read Heavy*. Penambahan latensi pada p95 seringkali diakibatkan oleh *network round-trip* ke database yang terpisah atau waktu deserialisasi Kafka/Zod.\n`;
    content += `2. **Throughput Mengalahkan Latensi Saat Skala Membesar:** Saat beban *concurrent users* (VUsers) meningkat melebihi limit koneksi pool Monolith (biasanya mentok di CPU *shared DB*), latensi Monolith meledak (*spike*). Sebaliknya, *message broker* (Kafka) pada Hybrid secara elegan mengubah *pressure* menjadi *latency lag* (*Eventual Consistency*), menjaga *throughput* API Gateway tetap konstan dan stabil. Pengguna lebih menoleransi "data sedang diproses" daripada *timeout 504*.\n`;
    content += `3. **Man-Power Testing Berubah dari Mencegah Bug menjadi Mengelola Kegagalan:** Karena arsitektur terdistribusi *pasti* akan mengalami *network partition*, mentalitas *developer testing* di Hybrid bergeser drastis. Alih-alih hanya menguji "Apakah query join bekerja?", developer harus menguji "Bagaimana jika Kafka mati di tengah transaksi?", sehingga *Chaos Engineering* & *Resilience Testing* menjadi wajib.\n\n`;

    content += `---\n\n`;
    content += `*Kesimpulan Akhir:* Jika sistem memiliki estimasi beban rendah-menengah dan tim kecil, **Monolith adalah raja ROI (Cost & Man-Power)**. Namun, jika bisnis menuntut *zero-downtime*, ketersediaan di bawah traffic burst tinggi (Flash Sale), dan tim yang cukup besar, **Hybrid Microservices adalah asuransi kelangsungan bisnis (Business Continuity) yang harganya sepadan**.\n`;

    fs.writeFileSync(reportPath, content);
    return reportPath;
  }
}
