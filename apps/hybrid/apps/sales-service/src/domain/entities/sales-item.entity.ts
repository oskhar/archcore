import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { SalesTransaction } from './sales-transaction.entity';

@Entity('sales_items')
export class SalesItem extends BaseEntity {
  @Column({ name: 'transaction_id' })
  transactionId!: string;

  @Column({ name: 'product_id' })
  productId!: string;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice!: number;

  @ManyToOne(() => SalesTransaction, (transaction) => transaction.items)
  @JoinColumn({ name: 'transaction_id' })
  transaction!: SalesTransaction;
}
