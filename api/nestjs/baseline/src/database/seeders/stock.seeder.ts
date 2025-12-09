import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Item } from 'src/domain/product/item/entities/item.entity';
import { Stock } from 'src/domain/inventory/stock/entities/stock.entity';

@Injectable()
export class StockSeeder {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async seed(count: number = 50) {
    console.log(`📦 Start seeding ${count} stock entries...`);

    const items = await this.itemRepository.find();

    if (items.length === 0) {
      console.error('❌ No items found. Seed items first.');
      return;
    }

    for (let i = 0; i < count; i++) {
      const randomItem = faker.helpers.arrayElement(items);

      await this.stockRepository.save({
        item: randomItem,
        quantity: faker.number.int({ min: 1, max: 200 }),
        type: faker.helpers.arrayElement(['in', 'out']),
      });
    }

    console.log(`✅ Successfully seeded ${count} stock entries!`);
  }
}
