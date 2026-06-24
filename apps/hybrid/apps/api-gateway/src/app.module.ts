import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HttpModule } from '@nestjs/axios';
import * as http from 'http';
import * as https from 'https';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './interface/health.controller';
import { DiagnosticsController } from './interface/diagnostics.controller';
import { ProductsController } from './interface/products.controller';
import { InventoryController } from './interface/inventory.controller';
import { SalesController } from './interface/sales.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    HttpModule.register({
      // Timeout 8s: cukup untuk high-load condition, fail-fast mencegah request menggantung.
      // Lebih toleran dari 5s sebelumnya karena downstream bisa lebih sibuk saat stress test.
      timeout: 8000,
      maxRedirects: 2,
      // Keep-alive: reuse TCP connections antar request (eliminasi TCP handshake overhead).
      // maxSockets 200: handle burst concurrency lebih baik — gateway adalah single entry point.
      // maxFreeSockets 50: simpan lebih banyak idle connections untuk reuse instan.
      // scheduling 'lifo': reuse koneksi yang paling baru digunakan → lebih hangat/cepat.
      httpAgent: new http.Agent({
        keepAlive: true,
        maxSockets: 200,
        maxFreeSockets: 50,
        timeout: 8000,
        scheduling: 'lifo',
      }),
      httpsAgent: new https.Agent({
        keepAlive: true,
        maxSockets: 200,
        maxFreeSockets: 50,
        timeout: 8000,
        scheduling: 'lifo',
      }),
    }),
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'gateway-client',
            brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
            connectionTimeout: 10000,
            retry: { initialRetryTime: 100, retries: 8 },
          },
          consumer: {
            groupId: 'gateway-consumer',
            heartbeatInterval: 3000,
            sessionTimeout: 30000,
          },
        },
      },
    ]),
  ],
  controllers: [
    HealthController,
    DiagnosticsController,
    ProductsController,
    InventoryController,
    SalesController,
  ],
  providers: [],
})
export class AppModule {}
