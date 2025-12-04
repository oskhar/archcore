import { Injectable } from '@nestjs/common';
import type { CreateTransactionDto } from './dto/create-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { TransactionItem } from './entities/transaction-item.entity';
import { Item } from 'src/domain/product/item/entities/item.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionItem)
    private readonly transactionItemRepository: Repository<TransactionItem>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const transaction = this.transactionRepository.create({
      transaction_number: createTransactionDto.transaction_number,
      total_amount: createTransactionDto.total_amount,
      payment_method: createTransactionDto.payment_method,
      status: createTransactionDto.status,
    });

    await this.transactionRepository.save(transaction);

    for (const item of createTransactionDto.item) {
      const selectedItem = await this.itemRepository.findOne({
        where: { id: item.item_id },
      });
      if (!selectedItem) {
        throw new Error(`Item with id ${item.item_id} not found`);
      }

      const transactionItem = this.transactionItemRepository.create({
        transaction: transaction,
        item: selectedItem,
        price: selectedItem.price,
        quantity: item.quantity,
        total: selectedItem.price * item.quantity,
      });

      await this.transactionItemRepository.save(transactionItem);
    }

    return transaction;
  }

  findAll() {
    const filter = {
      page: 1,
      limit: 50,
      sort: 'id',
      order: 'ASC',
    };

    return this.transactionRepository.find({
      skip: filter.page * filter.limit - filter.limit,
      take: filter.limit,
      order: {
        [filter.sort]: filter.order,
      },
      relations: ['item'],
    });
  }

  findOne(id: number) {
    return this.transactionRepository.findOne({ where: { id } });
  }
}
