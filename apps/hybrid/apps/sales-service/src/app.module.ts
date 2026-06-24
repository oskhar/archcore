import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { HealthController } from './interface/health.controller';
import { SalesTransaction } from './domain/entities/sales-transaction.entity';
import { SalesItem } from './domain/entities/sales-item.entity';
import { ProductCache } from './domain/entities/product-cache.entity';
import { KafkaModule } from './infrastructure/kafka/kafka.module';
import { ProductEventConsumer } from './infrastructure/kafka/product-event.consumer';
import { SalesProducer } from './infrastructure/kafka/sales.producer';
import { SalesController } from './interface/controllers/sales.controller';
import { SalesRepository } from './infrastructure/repositories/sales.repository';
import { CreateSaleHandler } from './application/commands/create-sale.handler';
import { GetSaleHandler } from './application/queries/get-sale.handler';
import { ProductCacheService } from './infrastructure/cache/product-cache.service';
import { SalesReadCacheService } from './infrastructure/cache/sales-read-cache.service';

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
        port: configService.get<number>('DB_PORT', 3309),
        username: configService.get<string>('DB_USERNAME', 'archkit_user'),
        password: configService.get<string>('DB_PASSWORD', 'archkit_password'),
        database: configService.get<string>('DB_DATABASE', 'archkit_sales'),
        entities: [SalesTransaction, SalesItem, ProductCache],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        // Logging off di production: setiap query log adalah I/O overhead
        logging: configService.get<string>('NODE_ENV') !== 'production',
        extra: {
          // Pool size dari env agar bisa di-tune per skenario (equal vs scale)
          connectionLimit: configService.get<number>('DB_POOL_SIZE', 50),
          waitForConnections: true,
          queueLimit: 200,
          enableKeepAlive: true,
          keepAliveInitialDelay: 0,
          connectTimeout: 10000,
          acquireTimeout: 10000,
        },
        migrations: ['dist/migrations/*.js'],
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([SalesTransaction, SalesItem, ProductCache]),
    CqrsModule,
    KafkaModule,
  ],
  controllers: [HealthController, ProductEventConsumer, SalesController],
  providers: [
    SalesRepository,
    SalesProducer,
    CreateSaleHandler,
    GetSaleHandler,
    // In-memory product cache — warm-up dari DB saat startup, diperbarui via Kafka events
    ProductCacheService,
    // In-memory read cache untuk GET /sales/transactions/:id — transaksi immutable, TTL 60s
    SalesReadCacheService,
  ],
})
export class AppModule {}

