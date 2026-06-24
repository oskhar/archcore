import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InventoryRepository } from '../repositories/inventory.repository';

@Controller()
export class SalesEventConsumer {
  private readonly logger = new Logger(SalesEventConsumer.name);

  constructor(private readonly inventoryRepository: InventoryRepository) {}

  @MessagePattern('sales.transaction-completed')
  async handleSaleCompleted(@Payload() data: any) {
    const event = typeof data === 'string' ? JSON.parse(data) : data;

    if (event.items && Array.isArray(event.items) && event.items.length > 0) {
      // Parallel stock deduction: semua items diproses bersamaan.
      // Sebelum: N items → N sequential await = N × DB latency
      // Sesudah: N items → Promise.all → ~1 × DB latency (concurrent)
      await Promise.all(
        event.items.map(async (item: { productId: string; quantity: number }) => {
          await this.inventoryRepository.adjustStockOnly(item.productId, -item.quantity);
          this.logger.log(`Reduced stock for product ${item.productId} by ${item.quantity}`);
        })
      );
      this.logger.log(`Processed ${event.items.length} stock adjustments in parallel for transaction ${event.transactionId}`);
    }
  }
}

