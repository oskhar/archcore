import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('ProductController (e2e)', () => {
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
    await dataSource.getRepository('product').clear();
  });

  it('should create a product (POST /products)', () => {
    return request(app.getHttpServer())
      .post('/products')
      .send({ 
        name: 'Hybrid Product', 
        description: 'Hybrid Desc',
        price: 20.5,
        category: 'Electronics'
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBeDefined();
        expect(res.body.name).toEqual('Hybrid Product');
      });
  });

  it('should get all products (GET /products)', async () => {
    await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Product 1', price: 10, category: 'C1' });
    
    return request(app.getHttpServer())
      .get('/products')
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBeGreaterThan(0);
      });
  });
});
