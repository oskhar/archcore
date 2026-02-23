import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { CreateItemHandler } from './commands/create-item.command';
import { FindAllItemHandler } from './queries/find-all-item.query';
import { FindOneItemHandler } from './queries/find-one-item.query';
import { ItemProjection } from 'src/projections/item.projection';
import { EventStore } from './entities/event-store.entity';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Item, EventStore])],
  controllers: [ItemsController],
  providers: [
    CreateItemHandler,
    FindAllItemHandler,
    FindOneItemHandler,
    ItemProjection,
  ],
})
export class ItemsModule {}
