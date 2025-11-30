import { faker } from '@faker-js/faker';
import { Item } from 'src/domain/product/item/entities/item.entity';
import { DataSource } from 'typeorm';

export class ItemSeeder {
  constructor(private readonly dataSource: DataSource) {}

  async run() {
    const repo = this.dataSource.getRepository(Item);

    const exists = await repo.count();
    if (exists > 0) {
      console.log(`⚠️ Items already seeded (${exists} found). Skipping.`);
      return;
    }

    const items: Item[] = [];

    for (let i = 0; i < 20; i++) {
      const item = repo.create({
        sku: faker.string.uuid(),
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: Number(faker.commerce.price({ min: 5, max: 300 })),
      });

      items.push(item);
    }

    await repo.save(items);

    console.log(`✔️ Seeded ${items.length} items.`);
  }
}
