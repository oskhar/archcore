import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('SalesFlow (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  beforeEach(async () => {
    await dataSource.getRepository('product_cache').clear();
    await dataSource.getRepository('sales_transactions').clear();
  });

  it('should process a sale and emit event', async () => {
    // 1. Manually seed product cache (simulating product.created event)
    const productId = '00000000-0000-0000-0000-000000000001';
    await dataSource.getRepository('product_cache').save({
      id: productId,
      name: 'Cached Product',
      price: 50.00
    });

    // 2. Create sale
    const response = await request(app.getHttpServer())
      .post('/sales/transaction')
      .send({
        items: [{ productId, quantity: 2 }]
      })
      .expect(201);

    expect(response.body.id).toBeDefined();
    expect(Number(response.body.totalPrice)).toEqual(100.00);
  });
});
