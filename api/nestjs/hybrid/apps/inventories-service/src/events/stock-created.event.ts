import { DomainEvent } from './domain.event';

export class StockCreatedEvent implements DomainEvent {
  constructor(
    public readonly aggregateId: string,
    public readonly item_id: string,
    public readonly quantity: number,
    public readonly type: string,
    public readonly version: number,
    public readonly occurredAt: Date = new Date(),
  ) {}
}
