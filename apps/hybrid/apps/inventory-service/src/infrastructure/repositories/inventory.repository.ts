import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Inventory } from '../../domain/entities/inventory.entity';
import { InventoryReadCacheService } from '../cache/inventory-read-cache.service';

@Injectable()
export class InventoryRepository {
  constructor(
    @InjectRepository(Inventory)
    private readonly repository: Repository<Inventory>,
    private readonly dataSource: DataSource,
    // In-memory read cache — eliminasi DB round-trip untuk GET /inventory/:id burst reads
    private readonly readCache: InventoryReadCacheService,
  ) {}

  async findByProductId(productId: string): Promise<Inventory | null> {
    // Cache-first: O(1) lookup sebelum DB round-trip
    const cached = this.readCache.get(productId);
    if (cached) return cached;

    const inventory = await this.repository.findOne({ where: { productId } });

    // Populate cache dari DB result
    if (inventory) {
      this.readCache.set(inventory);
    }

    return inventory;
  }

  /**
   * Atomic adjustStock menggunakan INSERT ... ON DUPLICATE KEY UPDATE.
   *
   * Sebelumnya: SELECT → mutate in-memory → SAVE = 2 DB round-trips
   * Sesudah   : 1 atomic query = 1 DB round-trip
   *
   * Keuntungan:
   * - Tidak ada race condition antar concurrent requests (atomic di DB level)
   * - Tidak perlu SELECT dulu untuk cek keberadaan record
   * - Throughput lebih tinggi saat banyak concurrent stock adjustments
   *
   * Returns the updated Inventory entity (requires 1 extra SELECT after upsert).
   * Gunakan adjustStockOnly jika return value tidak diperlukan.
   */
  async adjustStock(productId: string, delta: number): Promise<Inventory> {
    // Invalidasi cache SEBELUM write — force fresh read dari DB berikutnya
    this.readCache.invalidate(productId);

    await this.dataSource.query(
      `INSERT INTO inventory (id, productId, quantity, lastSyncAt, createdAt, updatedAt)
       VALUES (UUID(), ?, ?, NOW(), NOW(), NOW())
       ON DUPLICATE KEY UPDATE
         quantity = quantity + ?,
         lastSyncAt = NOW(),
         updatedAt = NOW()`,
      [productId, delta, delta],
    );

    // Single SELECT setelah atomic write — hanya 1 query total
    const inventory = await this.repository.findOne({ where: { productId } });
    if (!inventory) {
      throw new Error(`Failed to retrieve inventory for product: ${productId}`);
    }

    // Populate cache dengan nilai terbaru dari DB
    this.readCache.set(inventory);

    return inventory;
  }

  /**
   * Fire-and-forget variant: atomic upsert TANPA follow-up SELECT.
   *
   * Digunakan oleh SalesEventConsumer di mana return value tidak diperlukan.
   * Lebih cepat: 1 DB round-trip vs 2 pada adjustStock.
   * 50% lebih sedikit DB round-trips per sale item.
   */
  async adjustStockOnly(productId: string, delta: number): Promise<void> {
    // Invalidasi cache — berikutnya GET akan hit DB untuk nilai terbaru
    this.readCache.invalidate(productId);

    await this.dataSource.query(
      `INSERT INTO inventory (id, productId, quantity, lastSyncAt, createdAt, updatedAt)
       VALUES (UUID(), ?, ?, NOW(), NOW(), NOW())
       ON DUPLICATE KEY UPDATE
         quantity = quantity + ?,
         lastSyncAt = NOW(),
         updatedAt = NOW()`,
      [productId, delta, delta],
    );
  }

  async save(inventory: Inventory): Promise<Inventory> {
    const saved = await this.repository.save(inventory);
    // Invalidasi cache agar data stale tidak tersisa
    this.readCache.invalidate(inventory.productId);
    return saved;
  }

  async create(productId: string): Promise<Inventory> {
    // Gunakan upsert untuk menghindari race condition
    await this.adjustStock(productId, 0);
    const inventory = await this.repository.findOne({ where: { productId } });
    return inventory!;
  }

  async deleteByProductId(productId: string): Promise<void> {
    this.readCache.invalidate(productId);
    await this.repository.delete({ productId });
  }
}

