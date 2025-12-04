import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ItemModule } from './domain/product/item/item.module';
import { StockModule } from './domain/inventory/stock/stock.module';
import { TransactionModule } from './domain/sales/transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ItemModule,
    StockModule,
    TransactionModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
