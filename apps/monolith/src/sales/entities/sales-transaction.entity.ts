import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { SalesItem } from './sales-item.entity';

export enum TransactionStatus {
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Entity('sales_transactions')
export class SalesTransaction extends BaseEntity {
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.COMPLETED,
  })
  status: TransactionStatus;

  @OneToMany(() => SalesItem, (item) => item.transaction, { cascade: true })
  items: SalesItem[];
}
