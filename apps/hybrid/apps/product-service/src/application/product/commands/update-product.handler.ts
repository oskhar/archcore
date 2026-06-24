import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inject, NotFoundException } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Product } from '../../../domain/entities/product.entity';

export class UpdateProductCommand {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly price?: number,
  ) {}
}

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async execute(command: UpdateProductCommand): Promise<Product> {
    const { id, name, price } = command;
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;

    const updatedProduct = await this.productRepository.save(product);

    this.kafkaClient.emit('product.updated', JSON.stringify(updatedProduct));

    return updatedProduct;
  }
}
