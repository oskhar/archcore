import { randomUUID } from 'crypto';
import { ItemCreatedEvent } from '../events/item-created.event';
import { DomainEvent } from 'src/events/domain.event';

export class ItemAggregate {
  private _id!: string;
  private version = 0;

  private events: DomainEvent[] = [];

  static create(sku: string, name: string, description: string, price: number) {
    const agg = new ItemAggregate();
    const id = randomUUID();

    agg.apply(new ItemCreatedEvent(id, sku, name, description, price, 1));

    return agg;
  }

  private apply(event: DomainEvent) {
    this.version = event.version;
    this.events.push(event);
  }

  getEvents(): readonly DomainEvent[] {
    return this.events;
  }
}
