import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { StockCreatedEvent } from 'src/events/stock-created.event';
import { Stock } from 'src/stock/entities/stock.entity';
import { Repository } from 'typeorm';

@EventsHandler(StockCreatedEvent)
export class StockProjection implements IEventHandler<StockCreatedEvent> {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepo: Repository<Stock>,
  ) {}

  async handle(event: StockCreatedEvent) {
    await this.stockRepo.save({
      id: event.aggregateId,
      ...event.payload,
    });
  }
}
