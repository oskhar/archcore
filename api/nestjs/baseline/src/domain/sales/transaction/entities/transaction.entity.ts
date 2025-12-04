import { AbstractEntity } from 'src/database/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity('transactions')
export class Transaction extends AbstractEntity<Transaction> {
  @Column()
  transaction_number: string;

  @Column()
  total_amount: number;

  @Column({ type: 'enum', enum: ['cash', 'credit_card', 'e-wallet'] })
  payment_method: string;

  @Column({ type: 'enum', enum: ['pending', 'complete', 'cancel'] })
  status: string;
}
