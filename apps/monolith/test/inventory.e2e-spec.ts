import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TestHelper } from './test-helper';

describe('InventoryController (e2e)', () => {
  let app: INestApplication;
  const testHelper = new TestHelper();

  beforeAll(async () => {
    app = await testHelper.createApplication();
  });

  afterAll(async () => {
    await testHelper.closeApplication();
  });

  beforeEach(async () => {
    await testHelper.cleanupDatabase();
  });

  it('should adjust and retrieve stock for a product', async () => {
    // 1. Create a product
    const createProductRes = await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'E2E Test Product', price: 9.99, category: 'Test' })
      .expect(201);

    const productId = createProductRes.body.id;

    // 2. Adjust stock (initial)
    await request(app.getHttpServer())
      .post('/inventory/adjust')
      .send({ productId, delta: 10 })
      .expect(201)
      .expect((res) => {
        expect(res.body.productId).toBe(productId);
        expect(res.body.quantity).toBe(10);
      });

    // 3. Get quantity
    await request(app.getHttpServer())
      .get(`/inventory/${productId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.quantity).toBe(10);
      });

    // 4. Adjust stock again
    await request(app.getHttpServer())
      .post('/inventory/adjust')
      .send({ productId, delta: -5 })
      .expect(201)
      .expect((res) => {
        expect(res.body.quantity).toBe(5);
      });

    // 5. Final check
    await request(app.getHttpServer())
      .get(`/inventory/${productId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.quantity).toBe(5);
      });
  });

  it('should return 404 when adjusting stock for non-existent product', async () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000';
    await request(app.getHttpServer())
      .post('/inventory/adjust')
      .send({ productId: nonExistentId, delta: 10 })
      .expect(404);
  });

  it('should handle concurrent stock adjustments correctly', async () => {
    // 1. Create a product
    const createProductRes = await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Concurrent Product', price: 10, category: 'Test' })
      .expect(201);
    const productId = createProductRes.body.id;

    // 2. Run concurrent adjustments
    await Promise.all([
      request(app.getHttpServer()).post('/inventory/adjust').send({ productId, delta: 10 }),
      request(app.getHttpServer()).post('/inventory/adjust').send({ productId, delta: 10 }),
      request(app.getHttpServer()).post('/inventory/adjust').send({ productId, delta: 10 }),
    ]);

    // 3. Verify total quantity
    await request(app.getHttpServer())
      .get(`/inventory/${productId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.quantity).toBe(30);
      });
  });

  it('should return 400 when stock is insufficient', async () => {
    // 1. Create a product
    const createProductRes = await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Insufficient Stock Product', price: 10, category: 'Test' })
      .expect(201);
    const productId = createProductRes.body.id;

    // 2. Adjust initial stock
    await request(app.getHttpServer())
      .post('/inventory/adjust')
      .send({ productId, delta: 5 })
      .expect(201);

    // 3. Try to adjust by more than current stock (negative delta)
    await request(app.getHttpServer())
      .post('/inventory/adjust')
      .send({ productId, delta: -10 })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toBe('Insufficient stock');
      });

    // 4. Verify quantity remains unchanged
    await request(app.getHttpServer())
      .get(`/inventory/${productId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.quantity).toBe(5);
      });
  });
});
