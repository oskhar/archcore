import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseUUIDPipe,
  UsePipes,
  Logger,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AdjustStockCommand } from '../../application/commands/adjust-stock.handler';
import { GetStockQuery } from '../../application/queries/get-stock.handler';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { AdjustStockSchema, AdjustStockDto } from '../dtos/adjust-stock.dto';

@Controller('inventory')
export class InventoryController {
  private readonly logger = new Logger(InventoryController.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('adjust')
  @UsePipes(new ZodValidationPipe(AdjustStockSchema))
  async adjust(@Body() body: AdjustStockDto) {
    this.logger.log(`Adjusting stock for product ${body.productId}: ${body.delta}`);
    return this.commandBus.execute(new AdjustStockCommand(body.productId, body.delta));
  }

  @Get(':productId')
  async findOne(@Param('productId', ParseUUIDPipe) productId: string) {
    this.logger.log(`Fetching stock for product: ${productId}`);
    const result = await this.queryBus.execute(new GetStockQuery(productId));
    return {
      productId: result.productId,
      quantity: result.quantity,
    };
  }
}
