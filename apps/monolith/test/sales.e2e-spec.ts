import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TestHelper } from './test-helper';

describe('SalesController (e2e)', () => {
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

  it('should create a sales transaction and reduce inventory', async () => {
    // 1. Create a product
    const productRes = await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Sales Test Product', price: 100, category: 'Test' })
      .expect(201);

    const productId = productRes.body.id;

    // 2. Add initial stock
    await request(app.getHttpServer())
      .post('/inventory/adjust')
      .send({ productId, delta: 10 })
      .expect(201);

    // 3. Create transaction
    const transactionRes = await request(app.getHttpServer())
      .post('/sales/transaction')
      .send({
        items: [{ productId, quantity: 3 }],
      })
      .expect(201);

    const transactionId = transactionRes.body.id;
    expect(Number(transactionRes.body.totalPrice)).toBe(300.00);
    expect(transactionRes.body.items).toHaveLength(1);
    expect(transactionRes.body.items[0].productId).toBe(productId);
    expect(transactionRes.body.items[0].quantity).toBe(3);

    // 4. Verify inventory reduction
    await request(app.getHttpServer())
      .get(`/inventory/${productId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.quantity).toBe(7);
      });

    // 5. Retrieve transaction
    await request(app.getHttpServer())
      .get(`/sales/transactions/${transactionId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(transactionId);
        expect(Number(res.body.totalPrice)).toBe(300.00);
        expect(res.body.items).toHaveLength(1);
      });
  });

  it('should return 400 when stock is insufficient for a transaction', async () => {
    // 1. Create a product
    const productRes = await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Limited Product', price: 100, category: 'Test' })
      .expect(201);
    const productId = productRes.body.id;

    // 2. Add minimal stock
    await request(app.getHttpServer())
      .post('/inventory/adjust')
      .send({ productId, delta: 5 })
      .expect(201);

    // 3. Try to create a transaction for more than available stock
    await request(app.getHttpServer())
      .post('/sales/transaction')
      .send({
        items: [{ productId, quantity: 10 }],
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toBe('Insufficient stock');
      });

    // 4. Verify inventory remains unchanged
    await request(app.getHttpServer())
      .get(`/inventory/${productId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.quantity).toBe(5);
      });
  });

  it('should return 400 for empty items', async () => {
    await request(app.getHttpServer())
      .post('/sales/transaction')
      .send({ items: [] })
      .expect(400);
  });

  it('should return 404 for non-existent product', async () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000';
    await request(app.getHttpServer())
      .post('/sales/transaction')
      .send({
        items: [{ productId: nonExistentId, quantity: 1 }],
      })
      .expect(404);
  });
});
