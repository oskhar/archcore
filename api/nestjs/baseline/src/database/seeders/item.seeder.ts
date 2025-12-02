import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Item } from 'src/domain/product/item/entities/item.entity';

@Injectable()
export class ItemSeeder {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async seed(count: number = 50) {
    console.log(`🌱 Start seeding ${count} items...`);

    for (let i = 0; i < count; i++) {
      await this.itemRepository.save({
        sku: faker.commerce.isbn(),
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price({ min: 10000, max: 1000000 })),
      });
    }

    console.log(`✅ Successfully seeded ${count} items!`);
  }
}
