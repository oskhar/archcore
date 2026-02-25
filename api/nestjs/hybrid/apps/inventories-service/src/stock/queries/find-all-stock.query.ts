import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { Stock } from '../entities/stock.entity';
import { Repository } from 'typeorm';
import { FindAllStockDto } from '../dto/find-all-stock.dto';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

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

export class FindAllStockQuery extends Query<PaginatedResult<Stock>> {
  constructor(
    public readonly productService: ClientProxy,
    public readonly stockRepo: Repository<Stock>,
    public readonly filter: FindAllStockDto,
  ) {
    super();
  }
}

@QueryHandler(FindAllStockQuery)
export class FindAllStockHandler implements IQueryHandler<FindAllStockQuery> {
  async execute(q: FindAllStockQuery): Promise<PaginatedResult<Stock>> {
    const {
      page,
      limit,
      search,
      minQuantity,
      maxQuantity,
      type,
      createdFrom,
      createdTo,
      sortBy,
      sortOrder,
    } = q.filter;

    const qBuilder = q.stockRepo.createQueryBuilder('stock');

    if (minQuantity !== undefined) {
      qBuilder.andWhere('stock.quantity >= :minQuantity', { minQuantity });
    }

    if (maxQuantity !== undefined) {
      qBuilder.andWhere('stock.quantity <= :maxQuantity', { maxQuantity });
    }

    if (type) {
      qBuilder.andWhere('stock.type = :type', { type });
    }

    if (createdFrom) {
      qBuilder.andWhere('stock.created_at >= :createdFrom', {
        createdFrom,
      });
    }

    if (createdTo) {
      qBuilder.andWhere('stock.created_at <= :createdTo', { createdTo });
    }

    const sortField =
      sortBy === 'quantity' ? 'stock.quantity' : 'stock.created_at';

    qBuilder.orderBy(sortField, sortOrder);

    qBuilder.skip((page - 1) * limit).take(limit);

    const [stocks, total] = await qBuilder.getManyAndCount();

    const data = await Promise.all(
      stocks.map(async (stock) => {
        const item = await firstValueFrom(
          q.productService.send('product.findOneItem', {
            id: stock.item_id,
            search,
          }),
        );

        return {
          ...stock,
          item,
        };
      }),
    );

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
}
