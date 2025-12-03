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

  findAll() {}

  findOne(id: number) {
    return `This action returns a #${id} stock`;
  }
}
