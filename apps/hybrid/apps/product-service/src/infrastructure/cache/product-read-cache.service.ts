import { Injectable, Logger } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

/**
 * In-memory TTL cache untuk product read operations di product-service.
 *
 * Strategi:
 * - List cache (GET /products): TTL 3 detik — data sering berubah, tapi 3 detik
 *   masih cukup untuk absorb burst reads bersamaan tanpa DB storm.
 * - Single-item cache (GET /products/:id): TTL 15 detik — individual products
 *   jarang berubah di window singkat; reduce DB pressure pada repeated lookups.
 *
 * Invalidasi:
 * - Di-trigger langsung dari command handlers (create/update/delete) pada process
 *   yang sama, sehingga tidak ada stale read di single-replica mode.
 * - Di scale mode (3 replicas), replicas lain akan serve dari cache TTL masing-masing.
 *   Ini adalah eventual consistency yang wajar dalam distributed system.
 *
 * Memory overhead:
 * - 1 product ~300 bytes, 10k products = ~3MB untuk list cache
 * - Tidak ada persistent state antar restart (tidak diperlukan untuk read cache)
 */
@Injectable()
export class ProductReadCacheService {
  private readonly logger = new Logger(ProductReadCacheService.name);

  // Cache untuk list endpoint (GET /products)
  private listCacheData: Product[] | null = null;
  private listCacheExpiresAt = 0;

  // Cache untuk single-item endpoint (GET /products/:id)
  private readonly byIdCache = new Map<string, CacheEntry<Product>>();

  // TTL constants
  private readonly LIST_TTL_MS = 3_000;   // 3 detik
  private readonly BY_ID_TTL_MS = 15_000; // 15 detik

  // ── List Cache ────────────────────────────────────────────────────────────

  getList(): Product[] | undefined {
    if (!this.listCacheData || Date.now() > this.listCacheExpiresAt) {
      this.listCacheData = null;
      return undefined;
    }
    return this.listCacheData;
  }

  setList(data: Product[]): void {
    this.listCacheData = data;
    this.listCacheExpiresAt = Date.now() + this.LIST_TTL_MS;
    this.logger.debug(`List cache set: ${data.length} products, TTL ${this.LIST_TTL_MS}ms`);
  }

  // ── By-ID Cache ───────────────────────────────────────────────────────────

  getById(id: string): Product | undefined {
    const entry = this.byIdCache.get(id);
    if (!entry || Date.now() > entry.expiresAt) {
      this.byIdCache.delete(id);
      return undefined;
    }
    return entry.data;
  }

  setById(product: Product): void {
    this.byIdCache.set(product.id, {
      data: product,
      expiresAt: Date.now() + this.BY_ID_TTL_MS,
    });
    this.logger.debug(`By-ID cache set: ${product.id}, TTL ${this.BY_ID_TTL_MS}ms`);
  }

  // ── Invalidation ──────────────────────────────────────────────────────────

  /**
   * Invalidasi cache untuk product tertentu + seluruh list cache.
   * Dipanggil saat product di-update atau di-delete.
   */
  invalidate(id: string): void {
    this.byIdCache.delete(id);
    this.listCacheData = null;
    this.logger.debug(`Cache invalidated for product: ${id}`);
  }

  /**
   * Invalidasi seluruh cache (list + semua by-id).
   * Dipanggil saat product baru di-create (list pasti stale).
   */
  invalidateAll(): void {
    this.byIdCache.clear();
    this.listCacheData = null;
    this.logger.debug('All product read cache invalidated');
  }

  /**
   * Cache stats untuk diagnostics.
   */
  stats(): { listCached: boolean; byIdCount: number } {
    return {
      listCached: this.listCacheData !== null && Date.now() <= this.listCacheExpiresAt,
      byIdCount: this.byIdCache.size,
    };
  }
}
