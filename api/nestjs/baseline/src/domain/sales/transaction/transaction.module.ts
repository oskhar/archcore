import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionItem } from './entities/transaction-item.entity';
import { Item } from 'src/domain/product/item/entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, TransactionItem, Item])],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
