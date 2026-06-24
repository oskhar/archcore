import { Injectable, Logger } from '@nestjs/common';
import { Inventory } from '../../domain/entities/inventory.entity';

/**
 * In-memory TTL cache untuk inventory read operations.
 *
 * Strategi:
 * - Single-item cache (GET /inventory/:productId): TTL 5 detik.
 *   Inventory berubah sering (setiap sale dikurangi), tapi 5 detik cukup
 *   untuk absorb burst reads bersamaan tanpa DB storm.
 *
 * Invalidasi:
 * - Di-trigger dari repository setiap kali adjustStock / adjustStockOnly dipanggil.
 * - Dengan demikian, setelah stock dikurangi, read berikutnya pasti hit DB
 *   untuk mendapatkan nilai terbaru — tidak ada stale read yang signifikan.
 *
 * Keuntungan performa:
 * - GET /inventory/:id: eliminasi DB round-trip untuk request burst (hot path)
 * - Setiap hit cache menghemat ~2-5ms (DB query latency pada low contention)
 * - Pada stress test (96 RPS × 5 requests/scenario), potensi 480 DB queries/detik
 *   direduksi drastis menjadi hanya cache miss queries.
 */
@Injectable()
export class InventoryReadCacheService {
  private readonly logger = new Logger(InventoryReadCacheService.name);

  private readonly cache = new Map<string, { data: Inventory; expiresAt: number }>();

  // 5 detik — cukup pendek untuk konsistensi eventual yang wajar
  private readonly TTL_MS = 5_000;

  /**
   * Ambil inventory dari cache. Return undefined jika tidak ada atau expired.
   */
  get(productId: string): Inventory | undefined {
    const entry = this.cache.get(productId);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(productId);
      return undefined;
    }
    return entry.data;
  }

  /**
   * Simpan inventory ke cache dengan TTL.
   */
  set(inventory: Inventory): void {
    this.cache.set(inventory.productId, {
      data: inventory,
      expiresAt: Date.now() + this.TTL_MS,
    });
    this.logger.debug(`Cache set: productId=${inventory.productId}, qty=${inventory.quantity}`);
  }

  /**
   * Invalidasi cache untuk productId tertentu.
   * Dipanggil setiap kali stock diubah (adjustStock/adjustStockOnly).
   */
  invalidate(productId: string): void {
    this.cache.delete(productId);
    this.logger.debug(`Cache invalidated: productId=${productId}`);
  }

  /**
   * Cache stats untuk diagnostics endpoint.
   */
  size(): number {
    return this.cache.size;
  }
}
