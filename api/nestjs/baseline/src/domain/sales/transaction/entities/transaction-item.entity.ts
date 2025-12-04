import { AbstractEntity } from 'src/database/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Transaction } from './transaction.entity';
import { Item } from 'src/domain/product/item/entities/item.entity';

@Entity('transaction_item')
export class TransactionItem extends AbstractEntity<TransactionItem> {
  @ManyToOne(() => Transaction)
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @ManyToOne(() => Item)
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @Column()
  total: number;
}
