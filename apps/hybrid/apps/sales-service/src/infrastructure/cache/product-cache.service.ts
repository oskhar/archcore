import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCache } from '../../domain/entities/product-cache.entity';

interface CachedProduct {
  id: string;
  name: string;
  price: number;
}

/**
 * In-memory cache untuk product reference data di sales-service.
 *
 * Alasan:
 * - ProductCache table adalah denormalized read model — data jarang berubah
 * - DB lookup per item pada hot path (create-sale) adalah bottleneck utama
 * - Cache di-populate via Kafka events (eventual consistency)
 * - Warm-up dari DB saat startup memastikan cache tidak kosong
 *
 * Trade-off:
 * - Data stale maksimal 1 Kafka propagation delay (~few ms pada Redpanda)
 * - Memory overhead minimal: 1 product ~150 bytes, 10k products ~1.5MB
 * - Tidak persistent antar restart (diatasi dengan warm-up dari DB)
 */
@Injectable()
export class ProductCacheService implements OnApplicationBootstrap {
  private readonly logger = new Logger(ProductCacheService.name);
  private readonly cache = new Map<string, CachedProduct>();

  constructor(
    @InjectRepository(ProductCache)
    private readonly productCacheRepository: Repository<ProductCache>,
  ) {}

  /**
   * Warm-up cache dari DB saat aplikasi pertama kali naik.
   * Ini memastikan cache tidak kosong bahkan setelah container restart.
   */
  async onApplicationBootstrap(): Promise<void> {
    try {
      const products = await this.productCacheRepository.find();
      for (const p of products) {
        this.cache.set(p.id, {
          id: p.id,
          name: p.name,
          price: Number(p.price),
        });
      }
      this.logger.log(`Cache warm-up complete: ${this.cache.size} products loaded`);
    } catch (err) {
      this.logger.error('Cache warm-up failed, falling back to DB lookups', err);
    }
  }

  /**
   * O(1) in-memory lookup. Jauh lebih cepat dari DB query.
   */
  get(id: string): CachedProduct | undefined {
    return this.cache.get(id);
  }

  /**
   * Set/update entry di cache. Dipanggil oleh ProductEventConsumer.
   */
  set(product: CachedProduct): void {
    this.cache.set(product.id, {
      id: product.id,
      name: product.name,
      price: Number(product.price),
    });
  }

  /**
   * Hapus entry dari cache saat product dihapus.
   */
  delete(id: string): void {
    this.cache.delete(id);
  }

  /**
   * Berapa banyak product yang ada di cache (untuk diagnostics).
   */
  size(): number {
    return this.cache.size;
  }
}
