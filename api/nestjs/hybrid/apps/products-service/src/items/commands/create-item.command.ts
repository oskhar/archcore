import {
  Command,
  CommandHandler,
  EventBus,
  ICommandHandler,
} from '@nestjs/cqrs';
import { CreateItemDto } from '../dto/create-item.dto';
import { Repository } from 'typeorm';
import { ItemAggregate } from 'src/aggregates/item.aggregate';
import { EventStore } from '../entities/event-store.entity';

export class CreateItemCommand extends Command<string> {
  constructor(
    public readonly eventRepo: Repository<EventStore>,
    public readonly payload: CreateItemDto,
  ) {
    super();
  }
}

@CommandHandler(CreateItemCommand)
export class CreateItemHandler implements ICommandHandler<CreateItemCommand> {
  constructor(private readonly eBus: EventBus) {}
  /**
   * @param c CreateItemCommand
   * @returns Item
   */
  async execute(c: CreateItemCommand): Promise<string> {
    const aggregate = ItemAggregate.create(
      c.payload.sku,
      c.payload.name,
      c.payload.description,
      c.payload.price,
    );
    const events = aggregate.getEvents();
    for (const event of events) {
      const payload = {
        ...event,
      };
      await c.eventRepo.save({
        aggregate_id: event.aggregateId,
        aggregate_type: 'Item',
        event_type: event.constructor.name,
        payload,
        version: event.version,
      });

      this.eBus.publish(event);
    }

    return events[0].aggregateId;
  }
}
