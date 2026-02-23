export interface DomainEvent {
  aggregateId: string;
  version: number;
  occurredAt: Date;
}
