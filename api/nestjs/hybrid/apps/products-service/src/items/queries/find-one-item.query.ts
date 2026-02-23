import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { Item } from '../entities/item.entity';

export class FindOneItemQuery extends Query<Item> {
  constructor(
    public readonly itemRepo: Repository<Item>,
    public readonly id: string,
  ) {
    super();
  }
}

@QueryHandler(FindOneItemQuery)
export class FindOneItemHandler implements IQueryHandler<FindOneItemQuery> {
  /**
   * @param q
   * @returns Item
   */
  async execute(q: FindOneItemQuery): Promise<Item> {
    return await q.itemRepo.findOneByOrFail({ id: q.id });
  }
}
