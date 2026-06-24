import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Product } from '../../../domain/entities/product.entity';

export class GetProductByIdQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetProductByIdQuery)
export class GetProductByIdHandler implements IQueryHandler<GetProductByIdQuery> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async execute(query: GetProductByIdQuery): Promise<Product> {
    const { id } = query;
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }
}
