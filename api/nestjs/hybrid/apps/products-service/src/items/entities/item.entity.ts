import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity('item')
export class Item {
  @Column()
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  sku: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;
}
