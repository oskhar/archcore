import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { StockService } from './stock.service';
import type { CreateStockDto } from './dto/create-stock.dto';
import { FindAllStockSchema } from './dto/find-all-stock.dto';
import type { FindAllStockDto } from './dto/find-all-stock.dto';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) { }

  @Post()
  create(@Body() createStockDto: CreateStockDto) {
    return this.stockService.create(createStockDto);
  }

  @Get()
  findAll(@Query(new ZodValidationPipe(FindAllStockSchema)) query: FindAllStockDto) {
    return this.stockService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockService.findOne(+id);
  }
}
