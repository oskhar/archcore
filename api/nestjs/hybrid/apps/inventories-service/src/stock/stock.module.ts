import { Module } from '@nestjs/common';
import { StockController } from './stock.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { EventStore } from './entities/event-store.entity';
import { CreateStockHandler } from './commands/create-stock.command';
import { FindAllStockHandler } from './queries/find-all-stock.query';
import { StockProjection } from 'src/projections/stock.projection';
import { FindOneStockHandler } from './queries/find-one-stock.query';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MICROSERVICES_CLIENTS.PRODUCTS_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
          },
          consumer: {
            groupId: 'api-gateway-products-consumer',
          },
        },
      },
    ]),
    CqrsModule,
    TypeOrmModule.forFeature([Stock, EventStore]),
  ],
  controllers: [StockController],
  providers: [
    CreateStockHandler,
    FindAllStockHandler,
    FindOneStockHandler,
    StockProjection,
  ],
})
export class StockModule {}
