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
import { AdjustStockSchema, AdjustStockDto } from './dto/inventory.dto';

@Controller('inventory')
export class InventoryController {
  private readonly inventoryServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.inventoryServiceUrl = this.configService.get<string>(
      'INVENTORY_SERVICE_URL',
      'http://localhost:3002',
    );
  }

  @Post('adjust')
  @UsePipes(new ZodValidationPipe(AdjustStockSchema))
  async adjust(@Body() body: AdjustStockDto) {
    const { data } = await firstValueFrom(
      this.httpService.post(`${this.inventoryServiceUrl}/inventory/adjust`, body),
    );
    return data;
  }

  @Get(':productId')
  async findOne(@Param('productId') productId: string) {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.inventoryServiceUrl}/inventory/${productId}`),
    );
    return data;
  }
}
