import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InventoryRepository } from '../../infrastructure/repositories/inventory.repository';
import { InventoryReadCacheService } from '../../infrastructure/cache/inventory-read-cache.service';

export class GetStockQuery {
  constructor(public readonly productId: string) {}
}

@QueryHandler(GetStockQuery)
export class GetStockHandler implements IQueryHandler<GetStockQuery> {
  constructor(
    private readonly repository: InventoryRepository,
    private readonly readCache: InventoryReadCacheService,
  ) {}

  async execute(query: GetStockQuery) {
    const { productId } = query;

    // Cache-first: O(1) lookup. Repository.findByProductId sudah cache-aware,
    // tapi kita check di sini juga untuk short-circuit sebelum masuk repository layer.
    const cached = this.readCache.get(productId);
    if (cached) return cached;

    const inventory = await this.repository.findByProductId(productId);

    if (!inventory) {
      return { productId, quantity: 0 };
    }

    return inventory;
  }
}
