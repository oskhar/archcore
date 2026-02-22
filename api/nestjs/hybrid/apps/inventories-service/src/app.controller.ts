import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import type { CreateStockDto } from './dtos/create-stock.dto';

@Controller()
export class AppController {
  constructor(private readonly stockService: AppService) {}

  /**
   * CREATE STOCK
   * Pattern: stock.create
   */
  @MessagePattern('stock.create')
  create(@Payload() payload: CreateStockDto) {
    return payload;
  }

  /**
   * GET ALL STOCK
   * Pattern: stock.findAll
   */
  @MessagePattern('stock.findAll')
  findAll() {
    return '';
  }

  /**
   * GET STOCK BY ID
   * Pattern: stock.findOne
   */
  @MessagePattern('stock.findOne')
  findOne(@Payload() payload: { id: number }) {
    return payload;
  }
}
