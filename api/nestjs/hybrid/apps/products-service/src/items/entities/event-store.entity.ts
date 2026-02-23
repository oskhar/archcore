import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('event_store')
export class EventStore {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  aggregate_id: string;

  @Column()
  aggregate_type: string;

  @Column()
  event_type: string;

  @Column('json')
  payload: Record<string, unknown>;

  @Column()
  version: number;

  @CreateDateColumn()
  created_at: Date;
}
