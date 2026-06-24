import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity('inventory')
export class Inventory extends BaseEntity {
  @Column({ type: 'varchar', length: 36 })
  @Index({ unique: true })
  productId!: string;

  @Column({ type: 'int', default: 0 })
  quantity!: number;

  @Column({ type: 'timestamp', nullable: true })
  lastSyncAt!: Date;
}
