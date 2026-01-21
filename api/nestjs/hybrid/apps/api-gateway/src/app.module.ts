import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from './constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MICROSERVICES_CLIENTS.PRODUCTS_SERVICE,
        transport: Transport.TCP,
        options: {
          port: 4001,
        },
      },
      {
        name: MICROSERVICES_CLIENTS.INVENTORIES_SERVICE,
        transport: Transport.TCP,
        options: {
          port: 4002,
        },
      },
      {
        name: MICROSERVICES_CLIENTS.SALES_SERVICE,
        transport: Transport.TCP,
        options: {
          port: 4003,
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
