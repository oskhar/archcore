import { Injectable, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

export interface SaleCompletedPayload {
  transactionId: string;
  items: { productId: string; quantity: number }[];
  timestamp: string;
}

@Injectable()
export class SalesProducer implements OnModuleInit {
  private readonly logger = new Logger(SalesProducer.name);

  constructor(
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    // CATATAN: Tidak perlu subscribeToResponseOf karena emitSaleCompleted
    // menggunakan fire-and-forget (emit), bukan request-reply (send).
    // subscribeToResponseOf HANYA diperlukan untuk ClientKafka.send() pattern.
    await this.kafkaClient.connect();
    this.logger.log('SalesProducer connected to Kafka');
  }

  emitSaleCompleted(payload: SaleCompletedPayload): void {
    // Fire-and-forget: respons HTTP tidak menunggu Kafka selesai.
    // Jika Kafka gagal, transaksi sudah tersimpan di DB — consistency dijaga
    // melalui eventual consistency pattern.
    this.kafkaClient.emit('sales.transaction-completed', JSON.stringify(payload));
  }
}
