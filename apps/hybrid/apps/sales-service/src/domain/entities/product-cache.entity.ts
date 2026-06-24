import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('product_cache')
export class ProductCache {
  @PrimaryColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;
}
