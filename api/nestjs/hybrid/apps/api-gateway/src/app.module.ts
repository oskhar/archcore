import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from './constants';
import { CheckController } from './gate/check.controller';
import { ProductController } from './gate/product.controller';

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
      {
        name: MICROSERVICES_CLIENTS.INVENTORIES_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
          },
          consumer: {
            groupId: 'api-gateway-inventories-consumer',
          },
        },
      },
      {
        name: MICROSERVICES_CLIENTS.SALES_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
          },
          consumer: {
            groupId: 'api-gateway-sales-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [CheckController, ProductController],
  providers: [],
})
export class AppModule {}
