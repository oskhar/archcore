import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('InventoryController (e2e)', () => {
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

  it('/inventory/adjust (POST)', () => {
    return request(app.getHttpServer())
      .post('/inventory/adjust')
      .send({ productId, delta: 10 })
      .expect(201)
      .then((response) => {
        expect(response.body.productId).toBe(productId);
        expect(response.body.quantity).toBe(10);
      });
  });

  it('/inventory/:productId (GET)', () => {
    return request(app.getHttpServer())
      .get(`/inventory/${productId}`)
      .expect(200)
      .then((response) => {
        expect(response.body.productId).toBe(productId);
        expect(response.body.quantity).toBe(10);
      });
  });

  it('/inventory/adjust (POST) second time', () => {
    return request(app.getHttpServer())
      .post('/inventory/adjust')
      .send({ productId, delta: -5 })
      .expect(201)
      .then((response) => {
        expect(response.body.productId).toBe(productId);
        expect(response.body.quantity).toBe(5);
      });
  });
});
