import { Injectable } from '@nestjs/common';
import type { CreateStockDto } from './dto/create-stock.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
  ) {}

  async create(createStockDto: CreateStockDto) {
    const stock = this.stockRepository.create(createStockDto);
    await this.stockRepository.save(stock);

    return stock;
  }

  findAll() {
    // declare params for filter
    const filter = {
      page: 1,
      limit: 50,
      sort: 'id',
      order: 'ASC',
    };

    return this.stockRepository.find({
      skip: filter.page * filter.limit - filter.limit,
      take: filter.limit,
      order: {
        [filter.sort]: filter.order,
      },
    });
  }

  findOne(id: number) {
    return this.stockRepository.findOne({ where: { id } });
  }
}
