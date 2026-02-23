import { Injectable } from '@nestjs/common';
import type { CreateItemDto } from './dto/create-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { FindAllItemDto } from './dto/find-all-item.dto';
import { PaginatedResult } from 'src/common/dto/pagination.dto';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) { }
  async create(createItemDto: CreateItemDto) {
    console.log(createItemDto);
    const item = this.itemRepository.create(createItemDto);
    await this.itemRepository.save(item);

    return item;
  }

  async findAll(query: FindAllItemDto): Promise<PaginatedResult<Item>> {
    const { page, limit, search, minPrice, maxPrice, createdFrom, createdTo, sortBy, sortOrder } = query;
    const queryBuilder = this.itemRepository.createQueryBuilder('item');

    if (search) {
      queryBuilder.andWhere('(item.name LIKE :search OR item.description LIKE :search OR item.sku LIKE :search)', { search: `%${search}%` });
    }
    if (minPrice !== undefined) {
      queryBuilder.andWhere('item.price >= :minPrice', { minPrice });
    }
    if (maxPrice !== undefined) {
      queryBuilder.andWhere('item.price <= :maxPrice', { maxPrice });
    }
    if (createdFrom) {
      queryBuilder.andWhere('item.created_at >= :createdFrom', { createdFrom });
    }
    if (createdTo) {
      queryBuilder.andWhere('item.created_at <= :createdTo', { createdTo });
    }

    queryBuilder.orderBy(`item.${sortBy}`, sortOrder as 'ASC' | 'DESC');
    queryBuilder.skip((page - 1) * limit).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  findOne(id: number) {
    return this.itemRepository.findOne({ where: { id } });
  }
}
