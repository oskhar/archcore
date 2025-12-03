import { AbstractEntity } from 'src/database/abstract.entity';
import { Item } from 'src/domain/product/item/entities/item.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('stock')
export class Stock extends AbstractEntity<Stock> {
  @ManyToOne(() => Item)
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @Column()
  quantity: number;

  @Column({ type: 'enum', enum: ['in', 'out'] })
  type: string;
}
