import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateItemSchema, type CreateItemDto } from './dto/create-item.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { CreateItemCommand } from './commands/create-item.command';
import { EventStore } from './entities/event-store.entity';
import {
  FindAllItemSchema,
  type FindAllItemDto,
} from './dto/find-all-item.dto';
import { FindAllItemQuery } from './queries/find-all-item.query';
import { FindOneItemQuery } from './queries/find-one-item.query';

@Controller()
export class ItemsController {
  constructor(
    private readonly cBus: CommandBus,
    private readonly qBus: QueryBus,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(EventStore)
    private readonly eventRepository: Repository<EventStore>,
  ) {}

  @MessagePattern('product.createItem')
  create(@Payload() payload: CreateItemDto) {
    return this.cBus.execute(
      new CreateItemCommand(this.eventRepository, payload),
    );
  }

  @MessagePattern('product.findAllItems')
  findAll(@Payload() filter: FindAllItemDto) {
    return this.qBus.execute(new FindAllItemQuery(this.itemRepository, filter));
  }

  @MessagePattern('product.findOneItem')
  findOne(@Payload() id: string) {
    return this.qBus.execute(new FindOneItemQuery(this.itemRepository, id));
  }
}
