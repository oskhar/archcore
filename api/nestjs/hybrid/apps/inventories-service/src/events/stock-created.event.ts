import { CreateStockDto } from 'src/stock/dto/create-stock.dto';
import { DomainEvent } from './domain.event';

export class StockCreatedEvent implements DomainEvent {
  constructor(
    public readonly aggregateId: string,
    public readonly payload: CreateStockDto,
    public readonly version: number,
    public readonly occurredAt: Date = new Date(),
  ) {}
}
