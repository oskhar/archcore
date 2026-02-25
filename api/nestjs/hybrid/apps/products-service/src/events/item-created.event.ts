import { CreateItemDto } from 'src/items/dto/create-item.dto';
import { DomainEvent } from './domain.event';

export class ItemCreatedEvent implements DomainEvent {
  constructor(
    public readonly aggregateId: string,
    public readonly payload: CreateItemDto,
    public readonly version: number,
    public readonly occurredAt: Date = new Date(),
  ) {}
}
