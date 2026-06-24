import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesTransaction } from './entities/sales-transaction.entity';
import { SalesItem } from './entities/sales-item.entity';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { ProductModule } from '../product/product.module';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SalesTransaction, SalesItem]),
    ProductModule,
    InventoryModule,
  ],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
