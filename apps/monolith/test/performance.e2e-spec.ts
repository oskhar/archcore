import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TestHelper } from './test-helper';

describe('Performance Baseline (e2e)', () => {
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

  it('should process 1000 transactions and record baseline', async () => {
    // 1. Setup: Create a product and initial stock
    const productRes = await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Performance Product', price: 10 })
      .expect(201);
    const productId = productRes.body.id;

    await request(app.getHttpServer())
      .post('/inventory/adjust')
      .send({ productId, delta: 2000 })
      .expect(201);

    const transactionCount = 1000;
    const start = Date.now();

    // 2. Execute 1000 transactions sequentially to measure single-threaded performance
    for (let i = 0; i < transactionCount; i++) {
      await request(app.getHttpServer())
        .post('/sales/transaction')
        .send({
          items: [{ productId, quantity: 1 }],
        })
        .expect(201);
    }

    const end = Date.now();
    const totalTime = end - start;
    const avgTime = totalTime / transactionCount;

    console.log(`--- PERFORMANCE BASELINE ---`);
    console.log(`Total time for ${transactionCount} transactions: ${totalTime}ms`);
    console.log(`Average time per transaction: ${avgTime.toFixed(2)}ms`);
    console.log(`Transactions per second: ${(1000 / avgTime).toFixed(2)}`);
    console.log(`-----------------------------`);

    expect(totalTime).toBeGreaterThan(0);
  }, 300000); // Increase timeout for 1000 requests (5 minutes)
});
