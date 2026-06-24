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
    bodyParser: true,
  });

  // Disable X-Powered-By header untuk keamanan & kurangi response overhead
  app.getHttpAdapter().getInstance().disable('x-powered-by');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'sales-client',
        brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
        retry: { initialRetryTime: 100, retries: 8 },
        connectionTimeout: 10000,
      },
      consumer: {
        groupId: 'sales-consumer',
        heartbeatInterval: 3000,
        sessionTimeout: 30000,
      },
    },
  });

  await app.startAllMicroservices();
  const port = process.env.PORT ?? 3003;
  await app.listen(port);
  logger.log(`Sales Service running on port ${port}`);
}
bootstrap();

