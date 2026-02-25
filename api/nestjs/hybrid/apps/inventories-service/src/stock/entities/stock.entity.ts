import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity('stock')
export class Stock {
  @Column()
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  item_id: string;

  @Column()
  quantity: number;

  @Column({ type: 'enum', enum: ['in', 'out'] })
  type: string;
}
