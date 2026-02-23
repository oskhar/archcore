import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import type { CreateTransactionDto } from './dto/create-transaction.dto';
import { FindAllTransactionSchema } from './dto/find-all-transaction.dto';
import type { FindAllTransactionDto } from './dto/find-all-transaction.dto';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @Get()
  findAll(@Query(new ZodValidationPipe(FindAllTransactionSchema)) query: FindAllTransactionDto) {
    return this.transactionService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id);
  }
}
