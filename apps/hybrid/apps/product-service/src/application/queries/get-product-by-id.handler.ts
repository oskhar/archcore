import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import { ProductReadCacheService } from '../../infrastructure/cache/product-read-cache.service';

export class GetProductByIdQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetProductByIdQuery)
export class GetProductByIdHandler implements IQueryHandler<GetProductByIdQuery> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly readCache: ProductReadCacheService,
  ) {}

  async execute(query: GetProductByIdQuery): Promise<Product> {
    // Hot path: cek per-ID cache dulu (TTL 15 detik, O(1))
    const cached = this.readCache.getById(query.id);
    if (cached !== undefined) {
      return cached;
    }

    // Cache miss: query DB
    const product = await this.productRepository.findOneBy({ id: query.id });
    if (!product) {
      throw new NotFoundException(`Product with ID "${query.id}" not found`);
    }

    // Populate cache — request berikutnya untuk ID yang sama tidak akan hit DB
    this.readCache.setById(product);
    return product;
  }
}
