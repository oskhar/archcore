import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { Stock } from '../entities/stock.entity';
import { Repository } from 'typeorm';

export class FindOneStockQuery extends Query<Stock> {
  constructor(
    public readonly stockRepo: Repository<Stock>,
    public readonly id: string,
  ) {
    super();
  }
}

@QueryHandler(FindOneStockQuery)
export class FindOneStockHandler implements IQueryHandler<FindOneStockQuery> {
  /**
   * @param q
   * @returns Stock
   */
  async execute(q: FindOneStockQuery): Promise<Stock> {
    return await q.stockRepo.findOneByOrFail({ id: q.id });
  }
}
