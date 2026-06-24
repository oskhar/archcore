import { Injectable, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Product } from '../../domain/entities/product.entity';

@Injectable()
export class ProductProducer implements OnModuleInit {
  private readonly logger = new Logger(ProductProducer.name);

  constructor(
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    // CATATAN: Tidak perlu subscribeToResponseOf karena semua method di sini
    // menggunakan fire-and-forget (emit), bukan request-reply (send).
    // subscribeToResponseOf hanya dibutuhkan untuk ClientKafka.send() pattern.
    await this.kafkaClient.connect();
    this.logger.log('ProductProducer connected to Kafka');
  }

  /**
   * Fire-and-forget emit setelah product berhasil disimpan ke DB.
   * Digunakan oleh CreateProductHandler.
   */
  emitProductCreated(product: Product): void {
    this.kafkaClient.emit('product.created', JSON.stringify(product));
  }

  /**
   * Fire-and-forget emit setelah product berhasil diupdate.
   * Digunakan oleh UpdateProductHandler untuk menjaga sales-service cache tetap segar.
   */
  emitProductUpdated(product: Product): void {
    this.kafkaClient.emit('product.updated', JSON.stringify(product));
  }

  /**
   * Fire-and-forget emit setelah product berhasil dihapus.
   * Digunakan oleh DeleteProductHandler agar sales-service menghapus entry dari cache.
   */
  emitProductDeleted(productId: string): void {
    this.kafkaClient.emit('product.deleted', JSON.stringify({ id: productId }));
  }
}
