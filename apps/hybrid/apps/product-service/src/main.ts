import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    // Di production: kurangi log noise untuk performa I/O lebih baik
    logger: process.env.NODE_ENV === 'production'
      ? ['error', 'warn']
      : ['error', 'warn', 'log', 'debug'],
    // bodyParser dengan limit yang wajar untuk request produk
    bodyParser: true,
  });

  // Disable X-Powered-By header untuk keamanan & kurangi response overhead
  app.getHttpAdapter().getInstance().disable('x-powered-by');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'product-client',
        brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
        retry: { initialRetryTime: 100, retries: 8 },
        connectionTimeout: 10000,
      },
      consumer: {
        groupId: 'product-consumer',
        heartbeatInterval: 3000,
        sessionTimeout: 30000,
      },
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 4001,
    },
  });

  await app.startAllMicroservices();
  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  logger.log(`Product Service running on port ${port}`);
}
bootstrap();

