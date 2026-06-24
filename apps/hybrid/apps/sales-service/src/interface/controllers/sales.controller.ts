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
import { CreateSaleCommand } from '../../application/commands/create-sale.handler';
import { GetSaleQuery } from '../../application/queries/get-sale.handler';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { CreateSaleSchema, CreateSaleDto } from '../dtos/create-sale.dto';

@Controller('sales')
export class SalesController {
  private readonly logger = new Logger(SalesController.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('transaction')
  @UsePipes(new ZodValidationPipe(CreateSaleSchema))
  async create(@Body() body: CreateSaleDto) {
    this.logger.log('Creating sale transaction');
    return this.commandBus.execute(new CreateSaleCommand(body.items));
  }

  @Get('transactions/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.log(`Fetching sale transaction: ${id}`);
    return this.queryBus.execute(new GetSaleQuery(id));
  }
}
