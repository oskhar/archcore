import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProductCache } from '../../domain/entities/product-cache.entity';
import { ProductCacheService } from '../../infrastructure/cache/product-cache.service';
import { SalesRepository } from '../../infrastructure/repositories/sales.repository';
import { SalesProducer } from '../../infrastructure/kafka/sales.producer';

export class CreateSaleCommand {
  constructor(
    public readonly items: { productId: string; quantity: number }[],
  ) {}
}

@CommandHandler(CreateSaleCommand)
export class CreateSaleHandler implements ICommandHandler<CreateSaleCommand> {
  private readonly logger = new Logger(CreateSaleHandler.name);

  constructor(
    // In-memory cache: O(1) lookup tanpa DB round-trip per item (hot path)
    private readonly productCacheService: ProductCacheService,
    private readonly salesRepository: SalesRepository,
    private readonly salesProducer: SalesProducer,
    // Fallback repository: digunakan HANYA jika ada cache miss
    @InjectRepository(ProductCache)
    private readonly productCacheRepository: Repository<ProductCache>,
  ) {}

  async execute(command: CreateSaleCommand) {
    const { items: requestItems } = command;

    // ── Fase 1: Validasi quantity (synchronous, fail fast) ─────────────────
    for (const item of requestItems) {
      if (item.quantity <= 0) {
        throw new BadRequestException(
          `Quantity for product ${item.productId} must be greater than 0.`
        );
      }
    }

    // ── Fase 2: Parallel cache lookup + batch DB fallback ──────────────────
    //
    // Strategi:
    // 1. Check semua productId di in-memory cache dulu (O(1) per ID)
    // 2. Kumpulkan semua cache miss sekaligus
    // 3. Jika ada miss → 1 batch IN query ke DB, bukan N sequential queries
    // 4. Populate cache dari hasil batch query
    //
    // Sebelum: N items cache miss → N sequential DB round-trips
    // Sesudah: N items cache miss → 1 DB round-trip (IN clause)

    const cacheMissIds: string[] = [];
    for (const item of requestItems) {
      if (!this.productCacheService.get(item.productId)) {
        cacheMissIds.push(item.productId);
      }
    }

    if (cacheMissIds.length > 0) {
      this.logger.warn(
        `Cache miss for ${cacheMissIds.length} products (${cacheMissIds.join(', ')}). ` +
        `Fetching all via single IN query (cache size: ${this.productCacheService.size()}).`
      );

      // Satu batch query untuk semua miss sekaligus — eliminasi N sequential queries
      const dbProducts = await this.productCacheRepository.findBy({
        id: In(cacheMissIds),
      });

      if (dbProducts.length !== cacheMissIds.length) {
        const foundIds = new Set(dbProducts.map(p => p.id));
        const missing = cacheMissIds.filter(id => !foundIds.has(id));
        throw new NotFoundException(
          `Products not found: ${missing.join(', ')}. ` +
          `Please create the product first via POST /products.`
        );
      }

      // Populate cache dari batch result — request berikutnya O(1)
      for (const dbProduct of dbProducts) {
        this.productCacheService.set({
          id: dbProduct.id,
          name: dbProduct.name,
          price: Number(dbProduct.price),
        });
      }
      this.logger.log(`${dbProducts.length} products loaded from DB and cached.`);
    }

    // ── Fase 3: Hitung harga (semua produk sekarang pasti di cache) ─────────
    let totalTransactionPrice = 0;
    const itemsToSave: { productId: string; quantity: number; unitPrice: number }[] = [];

    for (const item of requestItems) {
      const product = this.productCacheService.get(item.productId)!;
      const unitPrice = Number(product.price);
      totalTransactionPrice += unitPrice * item.quantity;
      itemsToSave.push({ productId: item.productId, quantity: item.quantity, unitPrice });
    }

    // ── Fase 4: Persist transaksi ke DB ────────────────────────────────────
    const transaction = await this.salesRepository.createTransaction(
      totalTransactionPrice,
      itemsToSave,
    );

    // Fire-and-forget: HTTP response tidak menunggu Kafka emit.
    // Transaksi sudah tersimpan di DB — Kafka hanya untuk event propagation ke inventory.
    this.salesProducer.emitSaleCompleted({
      transactionId: transaction.id,
      items: transaction.items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      })),
      timestamp: new Date().toISOString(),
    });

    return transaction;
  }
}
