import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('SalesController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const productId = '550e8400-e29b-41d4-a716-446655440000';

  it('/sales/transaction (POST) - fails if product not in cache', () => {
    return request(app.getHttpServer())
      .post('/sales/transaction')
      .send({
        items: [{ productId, quantity: 2 }],
      })
      .expect(400);
  });
});
