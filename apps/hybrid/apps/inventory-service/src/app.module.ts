import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { HealthController } from './interface/health.controller';
import { ConnectivityController } from './interface/connectivity.controller';
import { Inventory } from './domain/entities/inventory.entity';
import { KafkaModule } from './infrastructure/kafka/kafka.module';
import { InventoryController } from './interface/controllers/inventory.controller';
import { InventoryRepository } from './infrastructure/repositories/inventory.repository';
import { AdjustStockHandler } from './application/commands/adjust-stock.handler';
import { GetStockHandler } from './application/queries/get-stock.handler';
import { ProductEventConsumer } from './infrastructure/kafka/product-event.consumer';
import { SalesEventConsumer } from './infrastructure/kafka/sales-event.consumer';
import { InventoryProducer } from './infrastructure/kafka/inventory.producer';
import { InventoryReadCacheService } from './infrastructure/cache/inventory-read-cache.service';

const Handlers = [AdjustStockHandler, GetStockHandler];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3308),
        username: configService.get<string>('DB_USERNAME', 'archkit_user'),
        password: configService.get<string>('DB_PASSWORD', 'archkit_password'),
        database: configService.get<string>('DB_DATABASE', 'archkit_inventory'),
        entities: [Inventory],
        // Fix: hanya synchronize di luar production untuk menghindari
        // schema check overhead saat container pertama kali start
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        // Logging off di production: query log adalah I/O overhead saat load test
        logging: configService.get<string>('NODE_ENV') !== 'production',
        extra: {
          // Pool size dari env agar bisa di-tune per skenario (equal vs scale)
          connectionLimit: configService.get<number>('DB_POOL_SIZE', 50),
          waitForConnections: true,
          queueLimit: 200,
          // TCP keepalive dengan delay 0 untuk koneksi yang paling responsif
          enableKeepAlive: true,
          keepAliveInitialDelay: 0,
          connectTimeout: 10000,
          acquireTimeout: 10000,
        },
        migrations: ['dist/migrations/*.js'],
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Inventory]),
    CqrsModule,
    KafkaModule,
  ],
  controllers: [
    HealthController,
    ConnectivityController,
    InventoryController,
    ProductEventConsumer,
    SalesEventConsumer,
  ],
  providers: [
    // In-memory read cache — eliminasi DB round-trip untuk GET /inventory/:id burst reads
    InventoryReadCacheService,
    InventoryRepository,
    // Dedicated Kafka producer dengan proper lifecycle
    InventoryProducer,
    ...Handlers,
  ],
})
export class AppModule {}
