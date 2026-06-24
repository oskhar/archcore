import { Controller, Get, Post, Body, Param, UsePipes } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import type { AdjustStockDto } from './dto/adjust-stock.dto';
import { AdjustStockSchema } from './dto/inventory.schema';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('adjust')
  @UsePipes(new ZodValidationPipe(AdjustStockSchema))
  adjustStock(@Body() adjustStockDto: AdjustStockDto) {
    return this.inventoryService.adjustStock(adjustStockDto);
  }

  @Get(':productId')
  async getQuantity(@Param('productId') productId: string) {
    const quantity = await this.inventoryService.getQuantity(productId);
    return { productId, quantity };
  }
}
