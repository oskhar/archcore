import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../domain/entities/product.entity';
import { ProductReadCacheService } from '../../infrastructure/cache/product-read-cache.service';

export class GetProductsQuery {
  constructor(public readonly limit: number = 1000) {}
}

@QueryHandler(GetProductsQuery)
export class GetProductsHandler implements IQueryHandler<GetProductsQuery> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly readCache: ProductReadCacheService,
  ) {}

  async execute(query: GetProductsQuery): Promise<Product[]> {
    // Hot path: cek in-memory cache dulu (O(1), zero DB round-trip)
    const cached = this.readCache.getList();
    if (cached !== undefined) {
      return cached;
    }

    // Cache miss: query DB, select hanya kolom yang diperlukan
    const products = await this.productRepository.find({
      select: ['id', 'name', 'price', 'category', 'description', 'createdAt', 'updatedAt'],
      take: query.limit,
      order: { createdAt: 'DESC' },
    });

    // Populate cache untuk request berikutnya (TTL 3 detik)
    this.readCache.setList(products);
    return products;
  }
}

