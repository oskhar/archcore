import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { SalesTransaction, TransactionStatus } from '../../domain/entities/sales-transaction.entity';
import { SalesItem } from '../../domain/entities/sales-item.entity';

@Injectable()
export class SalesRepository {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(SalesTransaction)
    private readonly transactionRepository: Repository<SalesTransaction>,
    @InjectRepository(SalesItem)
    private readonly itemRepository: Repository<SalesItem>,
  ) {}

  async createTransaction(totalPrice: number, items: Partial<SalesItem>[]): Promise<SalesTransaction> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Step 1: Insert transaction header
      const transaction = queryRunner.manager.create(SalesTransaction, {
        totalPrice,
        status: TransactionStatus.COMPLETED,
      });
      const savedTransaction = await queryRunner.manager.save(transaction);

      // Step 2: Bulk insert items menggunakan 1 raw query alih-alih N individual saves.
      // Untuk 3 items: 1 round-trip vs 3 round-trips sebelumnya.
      // TypeORM insert() dengan array → batch INSERT VALUES (...), (...), (...)
      const salesItemEntities = items.map((item) =>
        queryRunner.manager.create(SalesItem, {
          ...item,
          transactionId: savedTransaction.id,
        }),
      );

      // TypeORM insert() menghasilkan 1 bulk INSERT, bukan N individual INSERTs
      await queryRunner.manager.insert(SalesItem, salesItemEntities);

      await queryRunner.commitTransaction();

      // Bangun response dari data di memori — hindari SELECT ulang setelah commit.
      savedTransaction.items = salesItemEntities as SalesItem[];
      return savedTransaction;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findTransactionById(id: string): Promise<SalesTransaction | null> {
    return this.transactionRepository.findOne({
      where: { id },
      relations: ['items'],
    });
  }
}

