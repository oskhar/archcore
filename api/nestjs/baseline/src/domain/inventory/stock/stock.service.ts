import { Injectable } from '@nestjs/common';
import type { CreateStockDto } from './dto/create-stock.dto';

@Injectable()
export class StockService {
  create(createStockDto: CreateStockDto) {
    return 'This action adds a new stock';
  }

  findAll() {
    return `This action returns all stock`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stock`;
  }
}
