import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inject, NotFoundException } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Product } from '../../../domain/entities/product.entity';

export class DeleteProductCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteProductCommand)
export class DeleteProductHandler implements ICommandHandler<DeleteProductCommand> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async execute(command: DeleteProductCommand): Promise<void> {
    const { id } = command;
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.productRepository.remove(product);

    this.kafkaClient.emit('product.deleted', JSON.stringify({ id, deletedAt: new Date() }));
  }
}
