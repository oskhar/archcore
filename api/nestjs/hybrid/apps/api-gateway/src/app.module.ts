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
        transport: Transport.TCP,
        options: {
          host: process.env.PRODUCTS_SERVICE_HOST || 'localhost',
          port: 4001,
        },
      },
      {
        name: MICROSERVICES_CLIENTS.INVENTORIES_SERVICE,
        transport: Transport.TCP,
        options: {
          host: process.env.INVENTORIES_SERVICE_HOST || 'localhost',
          port: 4002,
        },
      },
      {
        name: MICROSERVICES_CLIENTS.SALES_SERVICE,
        transport: Transport.TCP,
        options: {
          host: process.env.SALES_SERVICE_HOST || 'localhost',
          port: 4003,
        },
      },
    ]),
  ],
  controllers: [CheckController, ProductController],
  providers: [],
})
export class AppModule {}
