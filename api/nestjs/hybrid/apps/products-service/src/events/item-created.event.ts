import { DomainEvent } from './domain.event';

export class ItemCreatedEvent implements DomainEvent {
  constructor(
    public readonly aggregateId: string,
    public readonly sku: string,
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly version: number,
    public readonly occurredAt: Date = new Date(),
  ) {}
}
