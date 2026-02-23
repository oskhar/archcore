import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { FindAllItemDto } from '../dto/find-all-item.dto';
import { Item } from '../entities/item.entity';

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  lastPage: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export class FindAllItemQuery extends Query<PaginatedResult<Item>> {
  constructor(
    public readonly itemRepo: Repository<Item>,
    public readonly filter: FindAllItemDto,
  ) {
    super();
  }
}

@QueryHandler(FindAllItemQuery)
export class FindAllItemHandler implements IQueryHandler<FindAllItemQuery> {
  async execute(q: FindAllItemQuery): Promise<PaginatedResult<Item>> {
    const {
      page,
      limit,
      search,
      minPrice,
      maxPrice,
      createdFrom,
      createdTo,
      sortBy,
      sortOrder,
    } = q.filter;

    const qBuilder = q.itemRepo.createQueryBuilder(`item`);

    if (search) {
      qBuilder.andWhere(
        '(item.name ILIKE :search OR item.description ILIKE :search OR item.sku ILIKE :search)',
        { search: `%${search}%` },
      );
    }
    if (minPrice !== undefined)
      qBuilder.andWhere('item.price >= :minPrice', { minPrice });
    if (maxPrice !== undefined)
      qBuilder.andWhere('item.price <= :maxPrice', { maxPrice });
    if (createdFrom)
      qBuilder.andWhere('item.created_at >= :createdFrom', {
        createdFrom,
      });
    if (createdTo)
      qBuilder.andWhere('item.created_at <= :createdTo', {
        createdTo,
      });

    qBuilder.orderBy(`item.${sortBy}`, sortOrder);
    qBuilder.skip((page - 1) * limit).take(limit);

    const [data, total] = await qBuilder.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        limit,
      },
    };
  }
}
