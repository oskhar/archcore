import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import { ProductProducer } from '../../infrastructure/kafka/product.producer';
import { ProductReadCacheService } from '../../infrastructure/cache/product-read-cache.service';

export class DeleteProductCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteProductCommand)
export class DeleteProductHandler implements ICommandHandler<DeleteProductCommand> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly productProducer: ProductProducer,
    private readonly readCache: ProductReadCacheService,
  ) {}

  async execute(command: DeleteProductCommand): Promise<void> {
    const result = await this.productRepository.delete(command.id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID "${command.id}" not found`);
    }

    // Invalidasi cache lokal setelah delete
    this.readCache.invalidate(command.id);

    // Fire-and-forget: propagate deletion ke semua services via Kafka.
    // sales-service akan menghapus entry dari ProductCache.
    // inventory-service akan menghapus inventory record.
    this.productProducer.emitProductDeleted(command.id);
  }
}

