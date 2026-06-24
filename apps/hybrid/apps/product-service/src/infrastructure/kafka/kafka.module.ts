import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'product-client',
            brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
            // Retry config: coba ulang koneksi hingga 8x dengan exponential backoff
            retry: {
              initialRetryTime: 100,
              retries: 8,
            },
            // Connection timeout: batas waktu tunggu koneksi ke broker
            connectionTimeout: 10000,
          },
          consumer: {
            groupId: 'product-consumer',
            // Heartbeat interval lebih pendek untuk deteksi failure lebih cepat
            heartbeatInterval: 3000,
            // Session timeout lebih panjang untuk tolerasi GC pause di load test
            sessionTimeout: 30000,
          },
          producer: {
            allowAutoTopicCreation: true,
            // lingerMs: 2ms — lebih responsif dari 5ms, masih cukup untuk batch pada burst load
            // Pada traffic tinggi, beberapa Kafka sends digabungkan menjadi 1 batch.
            lingerMs: 2,
            // batchSize: 64KB — naikkan dari 32KB untuk absorb lebih banyak messages per batch
            batchSize: 65536,
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class KafkaModule {}
