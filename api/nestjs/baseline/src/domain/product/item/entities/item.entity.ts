import { AbstractEntity } from 'src/database/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity('item')
export class Item extends AbstractEntity<Item> {
  @Column()
  sku: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;
}
