import { AbstractEntity } from 'src/database/base-entity.entity';
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
