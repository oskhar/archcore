import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { ProductService } from '../product/product.service';
import type { AdjustStockDto } from './dto/adjust-stock.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    private readonly productService: ProductService,
  ) {}

  async adjustStock(
    adjustStockDto: AdjustStockDto,
    manager?: EntityManager,
  ): Promise<Inventory> {
    const { productId, delta } = adjustStockDto;

    // Verify product exists
    await this.productService.findOne(productId);

    const repo = manager
      ? manager.getRepository(Inventory)
      : this.inventoryRepository;

    // Try to find or create the inventory record
    let inventory = await repo.findOneBy({ productId });

    if (!inventory) {
      if (delta < 0) {
        throw new BadRequestException('Insufficient stock');
      }
      try {
        inventory = repo.create({
          productId,
          quantity: delta,
        });
        return await repo.save(inventory);
      } catch (error) {
        // If it failed with duplicate entry, it means another request created it just now
        // We can ignore the error and proceed to increment
        if (error.code !== 'ER_DUP_ENTRY' && error.errno !== 1062) {
          throw error;
        }
        // Reload to proceed with increment
        inventory = await repo.findOneBy({ productId });
      }
    }

    if (inventory && inventory.quantity + delta < 0) {
      throw new BadRequestException('Insufficient stock');
    }

    await repo.increment({ productId }, 'quantity', delta);
    await repo.update({ productId }, { lastSyncAt: new Date() });

    // Return updated inventory
    const updatedInventory = await repo.findOneBy({
      productId,
    });
    if (!updatedInventory) {
      throw new Error('Failed to retrieve updated inventory');
    }
    return updatedInventory;
  }

  async getQuantity(productId: string): Promise<number> {
    const inventory = await this.inventoryRepository.findOneBy({ productId });
    return inventory ? inventory.quantity : 0;
  }
}
