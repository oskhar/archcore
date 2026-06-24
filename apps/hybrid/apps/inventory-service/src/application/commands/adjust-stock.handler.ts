import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InventoryRepository } from '../../infrastructure/repositories/inventory.repository';
import { InventoryProducer } from '../../infrastructure/kafka/inventory.producer';

export class AdjustStockCommand {
  constructor(
    public readonly productId: string,
    public readonly delta: number,
  ) {}
}

@CommandHandler(AdjustStockCommand)
export class AdjustStockHandler implements ICommandHandler<AdjustStockCommand> {
  constructor(
    private readonly repository: InventoryRepository,
    // Dedicated Kafka producer dengan proper lifecycle (OnModuleInit)
    // Menghindari reconnect overhead vs raw kafkaClient.emit()
    private readonly inventoryProducer: InventoryProducer,
  ) {}

  async execute(command: AdjustStockCommand) {
    const { productId, delta } = command;
    const inventory = await this.repository.adjustStock(productId, delta);

    // Fire-and-forget: HTTP response tidak menunggu Kafka emit.
    this.inventoryProducer.emitInventoryUpdated({
      productId: inventory.productId,
      newQuantity: inventory.quantity,
      delta,
      timestamp: new Date().toISOString(),
    });

    return inventory;
  }
}
