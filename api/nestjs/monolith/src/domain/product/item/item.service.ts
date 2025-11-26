import { Injectable } from '@nestjs/common';
import type { CreateItemDto } from './dto/create-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}
  async create(createItemDto: CreateItemDto) {
    const item = this.itemRepository.create(createItemDto);
    await this.itemRepository.save(item);

    return {
      id: item.id,
      sku: item.sku,
      name: item.name,
    };
  }

  findAll() {
    return `This action returns all item`;
  }

  findOne(id: number) {
    return `This action returns a #${id} item`;
  }
}
