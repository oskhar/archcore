import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  SalesTransaction,
  TransactionStatus,
} from './entities/sales-transaction.entity';
import { SalesItem } from './entities/sales-item.entity';
import { ProductService } from '../product/product.service';
import { InventoryService } from '../inventory/inventory.service';
import type { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(SalesTransaction)
    private readonly transactionRepository: Repository<SalesTransaction>,
    @InjectRepository(SalesItem)
    private readonly itemRepository: Repository<SalesItem>,
    private readonly productService: ProductService,
    private readonly inventoryService: InventoryService,
    private readonly dataSource: DataSource,
  ) {}

  async createTransaction(
    dto: CreateTransactionDto,
  ): Promise<SalesTransaction> {
    return await this.dataSource.transaction(async (manager) => {
      let totalPrice = 0;
      const salesItems: SalesItem[] = [];

      // 1. Validate all products and calculate total price
      for (const item of dto.items) {
        const product = await this.productService.findOne(item.productId);
        const unitPrice = Number(product.price);
        totalPrice += unitPrice * item.quantity;

        const salesItem = manager.create(SalesItem, {
          productId: item.productId,
          quantity: item.quantity,
          unitPrice,
        });
        salesItems.push(salesItem);

        // 2. Reduce inventory
        await this.inventoryService.adjustStock(
          {
            productId: item.productId,
            delta: -item.quantity,
          },
          manager,
        );
      }

      // 3. Create transaction
      const transaction = manager.create(SalesTransaction, {
        totalPrice,
        status: TransactionStatus.COMPLETED,
      });

      const savedTransaction = await manager.save(transaction);

      // 4. Save items with transaction ID
      for (const salesItem of salesItems) {
        salesItem.transactionId = savedTransaction.id;
        await manager.save(salesItem);
      }

      return (await manager.findOne(SalesTransaction, {
        where: { id: savedTransaction.id },
        relations: ['items'],
      })) as SalesTransaction;
    });
  }

  async findOne(id: string): Promise<SalesTransaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID "${id}" not found`);
    }

    return transaction;
  }
}
