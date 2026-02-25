import { randomUUID } from 'crypto';
import { DomainEvent } from 'src/events/domain.event';
import { StockCreatedEvent } from 'src/events/stock-created.event';
import { CreateStockDto } from 'src/stock/dto/create-stock.dto';

export class StockAggregate {
  private _id: string;
  private version = 0;
  private events: DomainEvent[] = [];

  static create(payload: CreateStockDto) {
    const aggregate = new StockAggregate();
    const id = randomUUID();

    aggregate.apply(new StockCreatedEvent(id, payload, 1));

    return aggregate;
  }

  private apply(event: DomainEvent) {
    this.version = event.version;
    this.events.push(event);
  }

  getEvents(): readonly DomainEvent[] {
    return this.events;
  }
}
