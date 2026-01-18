import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const appPort = process.env.APP_PORT || 4001;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: Number(appPort),
      },
    },
  );
  await app.listen();
  console.log(`Product service is running on ${appPort}`);
}
bootstrap();
