import { Injectable, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

/**
 * Dedicated Kafka producer untuk inventory-service.
 *
 * Menggunakan OnModuleInit untuk memastikan koneksi Kafka tersedia
 * sebelum ada request pertama masuk. Pattern ini konsisten dengan
 * SalesProducer dan menghindari reconnect overhead pada hot path.
 */
@Injectable()
export class InventoryProducer implements OnModuleInit {
  private readonly logger = new Logger(InventoryProducer.name);

  constructor(
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
    this.logger.log('InventoryProducer connected to Kafka');
  }

  /**
   * Fire-and-forget emit untuk inventory update event.
   * HTTP response tidak menunggu Kafka — eventual consistency.
   */
  emitInventoryUpdated(payload: {
    productId: string;
    newQuantity: number;
    delta: number;
    timestamp: string;
  }): void {
    this.kafkaClient.emit('inventory.updated', JSON.stringify(payload));
  }
}
