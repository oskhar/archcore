import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InventoryRepository } from '../repositories/inventory.repository';

@Controller()
export class ProductEventConsumer {
  private readonly logger = new Logger(ProductEventConsumer.name);

  constructor(private readonly inventoryRepository: InventoryRepository) {}

  @MessagePattern('product.created')
  async handleProductCreated(@Payload() data: any) {
    this.logger.log(`Received product.created event: ${JSON.stringify(data)}`);
    
    const product = typeof data === 'string' ? JSON.parse(data) : data;
    const productId = product.id;

    if (productId) {
      const existing = await this.inventoryRepository.findByProductId(productId);
      if (!existing) {
        await this.inventoryRepository.create(productId);
        this.logger.log(`Initialized inventory for product: ${productId}`);
      }
    }
  }

  @MessagePattern('product.deleted')
  async handleProductDeleted(@Payload() data: any) {
    this.logger.log(`Received product.deleted event: ${JSON.stringify(data)}`);
    const event = typeof data === 'string' ? JSON.parse(data) : data;
    const productId = event.id;
    if (productId) {
      await this.inventoryRepository.deleteByProductId(productId);
      this.logger.log(`Removed inventory for deleted product: ${productId}`);
    }
  }
}
