import { Controller, Inject } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { type CreateStockDto } from './dto/create-stock.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { Repository } from 'typeorm';
import { EventStore } from './entities/event-store.entity';
import { CreateStockCommand } from './commands/create-stock.command';
import { type FindAllStockDto } from './dto/find-all-stock.dto';
import { FindAllStockQuery } from './queries/find-all-stock.query';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { FindOneStockQuery } from './queries/find-one-stock.query';

@Controller()
export class StockController {
  constructor(
    private readonly cBus: CommandBus,
    private readonly qBus: QueryBus,
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    @InjectRepository(EventStore)
    private readonly eventRepository: Repository<EventStore>,
    @Inject(MICROSERVICES_CLIENTS.PRODUCTS_SERVICE)
    private readonly productService: ClientKafka,
  ) {}

  @MessagePattern('inventory.createStock')
  create(@Payload() payload: CreateStockDto) {
    return this.cBus.execute(
      new CreateStockCommand(this.eventRepository, payload),
    );
  }

  @MessagePattern('inventory.findAllStock')
  findAll(@Payload() filter: FindAllStockDto) {
    return this.qBus.execute(
      new FindAllStockQuery(this.stockRepository, filter, this.productService),
    );
  }

  @MessagePattern('inventory.findOneStock')
  findOne(@Payload() id: string) {
    return this.qBus.execute(new FindOneStockQuery(this.stockRepository, id));
  }
}
