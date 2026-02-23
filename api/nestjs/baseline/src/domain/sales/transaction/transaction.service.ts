import { Injectable } from '@nestjs/common';
import type { CreateTransactionDto } from './dto/create-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { TransactionItem } from './entities/transaction-item.entity';
import { Item } from 'src/domain/product/item/entities/item.entity';
import { FindAllTransactionDto } from './dto/find-all-transaction.dto';
import { PaginatedResult } from 'src/common/dto/pagination.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionItem)
    private readonly transactionItemRepository: Repository<TransactionItem>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) { }

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

  async findAll(query: FindAllTransactionDto): Promise<PaginatedResult<Transaction>> {
    const { page, limit, search, minTotalAmount, maxTotalAmount, status, createdFrom, createdTo, sortBy, sortOrder } = query;
    const queryBuilder = this.transactionRepository.createQueryBuilder('transaction');

    if (search) {
      queryBuilder.andWhere('transaction.transaction_number LIKE :search', { search: `%${search}%` });
    }
    if (minTotalAmount !== undefined) {
      queryBuilder.andWhere('transaction.total_amount >= :minTotalAmount', { minTotalAmount });
    }
    if (maxTotalAmount !== undefined) {
      queryBuilder.andWhere('transaction.total_amount <= :maxTotalAmount', { maxTotalAmount });
    }
    if (status) {
      queryBuilder.andWhere('transaction.status = :status', { status });
    }
    if (createdFrom) {
      queryBuilder.andWhere('transaction.created_at >= :createdFrom', { createdFrom });
    }
    if (createdTo) {
      queryBuilder.andWhere('transaction.created_at <= :createdTo', { createdTo });
    }

    queryBuilder.orderBy(`transaction.${sortBy}`, sortOrder as 'ASC' | 'DESC');
    queryBuilder.skip((page - 1) * limit).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  findOne(id: number) {
    return this.transactionRepository.findOne({ where: { id } });
  }
}
