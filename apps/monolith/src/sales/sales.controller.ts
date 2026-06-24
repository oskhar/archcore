import { Controller, Get, Post, Body, Param, UsePipes } from '@nestjs/common';
import { SalesService } from './sales.service';
import type { CreateTransactionDto } from './dto/create-transaction.dto';
import { CreateTransactionSchema } from './dto/sales.schema';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post('transaction')
  @UsePipes(new ZodValidationPipe(CreateTransactionSchema))
  createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    return this.salesService.createTransaction(createTransactionDto);
  }

  @Get('transactions/:id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }
}
