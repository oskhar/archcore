import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { SalesTransaction } from './sales-transaction.entity';
import { Product } from '../../product/entities/product.entity';

@Entity('sales_items')
export class SalesItem extends BaseEntity {
  @Column()
  transactionId: string;

  @Column()
  productId: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @ManyToOne(() => SalesTransaction, (transaction) => transaction.items)
  @JoinColumn({ name: 'transactionId' })
  transaction: SalesTransaction;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;
}
