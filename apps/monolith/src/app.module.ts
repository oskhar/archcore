import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './config/database.config';
import { ProductModule } from './product/product.module';
import { InventoryModule } from './inventory/inventory.module';
import { SalesModule } from './sales/sales.module';
import { HealthController } from './common/health.controller';
import { DiagnosticsController } from './common/diagnostics.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        config.get<TypeOrmModuleOptions>('database')!,
    }),
    ProductModule,
    InventoryModule,
    SalesModule,
  ],
  controllers: [AppController, HealthController, DiagnosticsController],
  providers: [AppService],
})
export class AppModule {}
