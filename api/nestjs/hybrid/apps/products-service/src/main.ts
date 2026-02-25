import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ZodValidationPipe } from 'nestjs-zod';

async function bootstrap() {
  const appPort = process.env.APP_PORT || 4001;
  const appHost = process.env.APP_HOST || 'localhost';
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
        },
        consumer: {
          groupId: 'products-consumer',
        },
      },
    },
  );
  app.useGlobalPipes(new ZodValidationPipe());
  await app.listen();
  console.log(`Product service is running on ${appHost}:${appPort}`);
}
bootstrap();
