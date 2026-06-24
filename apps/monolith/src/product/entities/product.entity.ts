import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('products')
export class Product extends BaseEntity {
  @Column({ length: 255 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ length: 50, default: 'Uncategorized' })
  category: string;
}
