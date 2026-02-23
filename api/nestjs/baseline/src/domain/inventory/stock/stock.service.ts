import { Injectable } from '@nestjs/common';
import type { CreateStockDto } from './dto/create-stock.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { Repository } from 'typeorm';
import { FindAllStockDto } from './dto/find-all-stock.dto';
import { PaginatedResult } from 'src/common/dto/pagination.dto';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
  ) { }

  async create(createStockDto: CreateStockDto) {
    const { item_id } = createStockDto;

    const item = await this.stockRepository.findOne({ where: { id: item_id } });
    if (!item) {
      throw new Error('Item not found');
    }

    const stock = this.stockRepository.create({
      ...createStockDto,
    });
    await this.stockRepository.save(stock);

    return stock;
  }

  async findAll(query: FindAllStockDto): Promise<PaginatedResult<Stock>> {
    const { page, limit, search, minQuantity, maxQuantity, type, createdFrom, createdTo, sortBy, sortOrder } = query;
    const queryBuilder = this.stockRepository.createQueryBuilder('stock');

    queryBuilder.leftJoinAndSelect('stock.item', 'item');

    if (search) {
      queryBuilder.andWhere('item.name LIKE :search', { search: `%${search}%` });
    }
    if (minQuantity !== undefined) {
      queryBuilder.andWhere('stock.quantity >= :minQuantity', { minQuantity });
    }
    if (maxQuantity !== undefined) {
      queryBuilder.andWhere('stock.quantity <= :maxQuantity', { maxQuantity });
    }
    if (type) {
      queryBuilder.andWhere('stock.type = :type', { type });
    }
    if (createdFrom) {
      queryBuilder.andWhere('stock.created_at >= :createdFrom', { createdFrom });
    }
    if (createdTo) {
      queryBuilder.andWhere('stock.created_at <= :createdTo', { createdTo });
    }

    const sortField = sortBy === 'quantity' ? 'stock.quantity' : 'stock.created_at';
    queryBuilder.orderBy(sortField, sortOrder as 'ASC' | 'DESC');

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  findOne(id: number) {
    return this.stockRepository.findOne({ where: { id } });
  }
}
