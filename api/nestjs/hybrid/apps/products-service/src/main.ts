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
      transport: Transport.TCP,
      options: {
        host: appHost,
        port: Number(appPort),
      },
    },
  );
  app.useGlobalPipes(new ZodValidationPipe());
  await app.listen();
  console.log(`Product service is running on ${appHost}:${appPort}`);
}
bootstrap();
