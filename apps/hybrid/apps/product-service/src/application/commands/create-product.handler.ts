import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../domain/entities/product.entity';
import { ProductProducer } from '../../infrastructure/kafka/product.producer';
import { ProductReadCacheService } from '../../infrastructure/cache/product-read-cache.service';

export class CreateProductCommand {
  constructor(
    public readonly name: string,
    public readonly price: number,
    public readonly category: string,
    public readonly description?: string,
  ) {}
}

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly productProducer: ProductProducer,
    private readonly readCache: ProductReadCacheService,
  ) {}

  async execute(command: CreateProductCommand): Promise<Product> {
    const { name, price, category, description } = command;
    const product = this.productRepository.create({ name, price, category, description });
    const savedProduct = await this.productRepository.save(product);

    // Invalidasi list cache (product baru → list sudah stale)
    // Set by-ID cache agar GET berikutnya tidak hit DB
    this.readCache.invalidateAll();
    this.readCache.setById(savedProduct);

    // Fire-and-forget: Kafka event dikirim setelah DB save, tanpa blocking response HTTP.
    // Ini menurunkan latency create product secara signifikan.
    this.productProducer.emitProductCreated(savedProduct);

    return savedProduct;
  }
}

