import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UsePipes,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { CreateTransactionSchema, CreateTransactionDto } from './dto/sales.dto';

@Controller('sales')
export class SalesController {
  private readonly salesServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.salesServiceUrl = this.configService.get<string>(
      'SALES_SERVICE_URL',
      'http://localhost:3003',
    );
  }

  @Post('transaction')
  @UsePipes(new ZodValidationPipe(CreateTransactionSchema))
  async create(@Body() body: CreateTransactionDto) {
    const { data } = await firstValueFrom(
      this.httpService.post(`${this.salesServiceUrl}/sales/transaction`, body),
    );
    return data;
  }

  @Get('transactions/:id')
  async findOne(@Param('id') id: string) {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.salesServiceUrl}/sales/transactions/${id}`),
    );
    return data;
  }
}
