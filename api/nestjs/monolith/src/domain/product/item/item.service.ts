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

    return item;
  }

  findAll() {
    // declare params for filter
    const filter = {
      page: 1,
      limit: 50,
      sort: 'id',
      order: 'ASC',
    };

    return this.itemRepository.find({
      skip: filter.page * filter.limit - filter.limit,
      take: filter.limit,
      order: {
        [filter.sort]: filter.order,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} item`;
  }
}
