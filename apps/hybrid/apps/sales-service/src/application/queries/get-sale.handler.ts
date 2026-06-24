import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SalesRepository } from '../../infrastructure/repositories/sales.repository';
import { SalesReadCacheService } from '../../infrastructure/cache/sales-read-cache.service';

export class GetSaleQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(GetSaleQuery)
export class GetSaleHandler implements IQueryHandler<GetSaleQuery> {
  constructor(
    private readonly salesRepository: SalesRepository,
    private readonly salesReadCache: SalesReadCacheService,
  ) {}

  async execute(query: GetSaleQuery) {
    const { id } = query;

    // Cache-first: transaksi immutable — aman di-cache 60 detik
    const cached = this.salesReadCache.get(id);
    if (cached) return cached;

    // Cache miss: hit DB lalu populate cache untuk request berikutnya
    const transaction = await this.salesRepository.findTransactionById(id);
    if (transaction) {
      this.salesReadCache.set(transaction);
    }

    return transaction;
  }
}
