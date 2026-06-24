import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    // Di production: kurangi log noise — setiap log baris adalah I/O ke stdout
    logger: process.env.NODE_ENV === 'production'
      ? ['error', 'warn']
      : ['error', 'warn', 'log', 'debug'],
    // bodyParser dengan limit yang cukup untuk semua request type
    bodyParser: true,
  });

  // Disable X-Powered-By header — kurangi response size overhead
  app.getHttpAdapter().getInstance().disable('x-powered-by');

  app.useGlobalFilters(new HttpExceptionFilter());

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'gateway-client-server',
        brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
        retry: { initialRetryTime: 100, retries: 8 },
        connectionTimeout: 10000,
      },
      consumer: {
        groupId: 'gateway-consumer',
        heartbeatInterval: 3000,
        sessionTimeout: 30000,
      },
    },
  });

  await app.startAllMicroservices();
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`API Gateway running on port ${port}`);
}
bootstrap();

