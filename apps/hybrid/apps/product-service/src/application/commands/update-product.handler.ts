import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import { ProductProducer } from '../../infrastructure/kafka/product.producer';
import { ProductReadCacheService } from '../../infrastructure/cache/product-read-cache.service';

export class UpdateProductCommand {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly price?: number,
    public readonly category?: string,
    public readonly description?: string,
  ) {}
}

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly productProducer: ProductProducer,
    private readonly readCache: ProductReadCacheService,
  ) {}

  async execute(command: UpdateProductCommand): Promise<Product> {
    const { id, ...updates } = command;
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    // Eliminasi extra DB round-trip: merge di memori, lalu save 1 kali.
    if (updates.name !== undefined) product.name = updates.name;
    if (updates.price !== undefined) product.price = updates.price;
    if (updates.category !== undefined) product.category = updates.category;
    if (updates.description !== undefined) product.description = updates.description;

    const updatedProduct = await this.productRepository.save(product);

    // Invalidasi stale cache → set versi terbaru langsung agar GET tidak hit DB
    this.readCache.invalidate(id);
    this.readCache.setById(updatedProduct);

    // Fire-and-forget: propagate update ke sales-service cache via Kafka.
    this.productProducer.emitProductUpdated(updatedProduct);

    return updatedProduct;
  }
}

