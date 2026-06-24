import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('InventorySync (e2e)', () => {
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
    await dataSource.getRepository('inventory').clear();
  });

  it('should adjust stock for a product', async () => {
    const productId = '00000000-0000-0000-0000-000000000001';
    
    await request(app.getHttpServer())
      .post('/inventory/adjust')
      .send({ productId, delta: 100 })
      .expect(201);

    return request(app.getHttpServer())
      .get(`/inventory/${productId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.quantity).toEqual(100);
      });
  });
});
