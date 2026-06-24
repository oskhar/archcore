import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { KafkaModule } from './infrastructure/kafka/kafka.module';
import { Product } from './domain/entities/product.entity';
import { CreateProductHandler } from './application/commands/create-product.handler';
import { UpdateProductHandler } from './application/commands/update-product.handler';
import { DeleteProductHandler } from './application/commands/delete-product.handler';
import { GetProductsHandler } from './application/queries/get-products.handler';
import { GetProductByIdHandler } from './application/queries/get-product-by-id.handler';
import { HealthController } from './interface/health.controller';
import { ProductController } from './interface/controllers/product.controller';
import { ProductProducer } from './infrastructure/kafka/product.producer';
import { ProductReadCacheService } from './infrastructure/cache/product-read-cache.service';

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
        port: configService.get<number>('DB_PORT', 3307),
        username: configService.get<string>('DB_USERNAME', 'archkit_user'),
        password: configService.get<string>('DB_PASSWORD', 'archkit_password'),
        database: configService.get<string>('DB_DATABASE', 'archkit_product'),
        entities: [Product],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        // Logging di-disable di production untuk mengurangi I/O overhead
        logging: configService.get<string>('NODE_ENV') !== 'production',
        extra: {
          // Pool size dari env agar bisa di-tune per skenario (equal vs scale)
          connectionLimit: configService.get<number>('DB_POOL_SIZE', 50),
          waitForConnections: true,
          // queueLimit 0 = unlimited; set eksplisit untuk dapat error cepat jika overload
          queueLimit: 200,
          // TCP keepalive mencegah koneksi idle drop dari MySQL
          enableKeepAlive: true,
          keepAliveInitialDelay: 0,
          // connectTimeout: batas waktu establish koneksi baru (ms)
          connectTimeout: 10000,
          // acquireTimeout: batas waktu tunggu koneksi dari pool sebelum error
          acquireTimeout: 10000,
        },
        migrations: ['dist/migrations/*.js'],
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Product]),
    CqrsModule,
    KafkaModule,
  ],
  controllers: [HealthController, ProductController],
  providers: [
    // In-memory TTL read cache — shared singleton di seluruh handlers
    ProductReadCacheService,
    CreateProductHandler,
    UpdateProductHandler,
    DeleteProductHandler,
    GetProductsHandler,
    GetProductByIdHandler,
    ProductProducer,
  ],
})
export class AppModule {}


