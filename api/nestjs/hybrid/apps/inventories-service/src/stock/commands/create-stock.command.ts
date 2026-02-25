import { Repository } from 'typeorm';
import { EventStore } from '../entities/event-store.entity';
import { InjectRepository } from '@nestjs/typeorm';
import type { CreateStockDto } from '../dto/create-stock.dto';
import {
  Command,
  CommandHandler,
  EventBus,
  ICommandHandler,
} from '@nestjs/cqrs';
import { StockAggregate } from 'src/aggregates/stock.aggregate';

export class CreateStockCommand extends Command<string> {
  constructor(
    @InjectRepository(EventStore)
    public readonly eventRepo: Repository<EventStore>,
    public readonly payload: CreateStockDto,
  ) {
    super();
  }
}

@CommandHandler(CreateStockCommand)
export class CreateStockHandler implements ICommandHandler<CreateStockCommand> {
  constructor(private readonly eBus: EventBus) {}
  /**
   * @param c CreateStockCommand
   * @returns Stock
   */
  async execute(c: CreateStockCommand): Promise<string> {
    const aggregate = StockAggregate.create(c.payload);
    const events = aggregate.getEvents();
    const eventEntities = events.map((event) => ({
      aggregate_id: event.aggregateId,
      aggregate_type: 'Stock',
      event_type: event.constructor.name,
      payload: { ...event },
      version: event.version,
    }));

    await c.eventRepo.save(eventEntities);
    this.eBus.publishAll([...events]);

    return events[0].aggregateId;
  }
}
