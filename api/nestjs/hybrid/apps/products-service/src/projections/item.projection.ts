import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemCreatedEvent } from 'src/events/item-created.event';
import { Item } from 'src/items/entities/item.entity';
import { Repository } from 'typeorm';

@EventsHandler(ItemCreatedEvent)
export class ItemProjection implements IEventHandler<ItemCreatedEvent> {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepo: Repository<Item>,
  ) {}

  async handle(event: ItemCreatedEvent) {
    await this.itemRepo.save({
      id: event.aggregateId,
      sku: event.sku,
      name: event.name,
      description: event.description,
      price: event.price,
    });
  }
}
