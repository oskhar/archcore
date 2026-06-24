import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCache } from '../../domain/entities/product-cache.entity';
import { ProductCacheService } from '../cache/product-cache.service';

@Controller()
export class ProductEventConsumer {
  private readonly logger = new Logger(ProductEventConsumer.name);

  constructor(
    @InjectRepository(ProductCache)
    private readonly productCacheRepository: Repository<ProductCache>,
    // In-memory cache — diperbarui setiap kali ada Kafka event
    private readonly productCacheService: ProductCacheService,
  ) {}

  @MessagePattern('product.created')
  async handleProductCreated(@Payload() data: any) {
    const product = typeof data === 'string' ? JSON.parse(data) : data;

    // 1. Persist ke DB (untuk warm-up setelah restart)
    await this.productCacheRepository.save({
      id: product.id,
      name: product.name,
      price: product.price,
    });

    // 2. Update in-memory cache (O(1) write, dipakai untuk create-sale hot path)
    this.productCacheService.set({
      id: product.id,
      name: product.name,
      price: Number(product.price),
    });

    this.logger.log(`Product cached: ${product.id} (name=${product.name}, price=${product.price})`);
  }

  @MessagePattern('product.updated')
  async handleProductUpdated(@Payload() data: any) {
    const product = typeof data === 'string' ? JSON.parse(data) : data;

    // 1. Persist ke DB
    await this.productCacheRepository.save({
      id: product.id,
      name: product.name,
      price: product.price,
    });

    // 2. Update in-memory cache
    this.productCacheService.set({
      id: product.id,
      name: product.name,
      price: Number(product.price),
    });

    this.logger.log(`Product cache updated: ${product.id}`);
  }

  @MessagePattern('product.deleted')
  async handleProductDeleted(@Payload() data: any) {
    const event = typeof data === 'string' ? JSON.parse(data) : data;
    const productId = event.id;

    if (productId) {
      // 1. Hapus dari DB
      await this.productCacheRepository.delete(productId);

      // 2. Hapus dari in-memory cache
      this.productCacheService.delete(productId);

      this.logger.log(`Product removed from cache: ${productId}`);
    }
  }
}
