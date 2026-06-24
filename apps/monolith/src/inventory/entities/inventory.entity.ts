import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Product } from '../../product/entities/product.entity';

@Entity('inventory')
export class Inventory extends BaseEntity {
  @Column({ type: 'uuid', unique: true })
  productId: string;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'timestamp', nullable: true })
  lastSyncAt: Date;

  @OneToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;
}
