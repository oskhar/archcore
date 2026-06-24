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
            clientId: 'inventory-client',
            brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
            // Retry config: coba ulang koneksi hingga 8x dengan exponential backoff
            retry: {
              initialRetryTime: 100,
              retries: 8,
            },
            connectionTimeout: 10000,
          },
          consumer: {
            groupId: 'inventory-consumer',
            // Heartbeat interval pendek untuk deteksi failure lebih cepat
            heartbeatInterval: 3000,
            // Session timeout panjang untuk tolerasi GC pause saat load test
            sessionTimeout: 30000,
          },
          producer: {
            allowAutoTopicCreation: true,
            // lingerMs 2ms — inventory events dikirim cepat
            lingerMs: 2,
            // batchSize 64KB untuk absorb concurrent stock adjustments
            batchSize: 65536,
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class KafkaModule {}

