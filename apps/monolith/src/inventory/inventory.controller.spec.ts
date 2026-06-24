import { Test, TestingModule } from '@nestjs/testing';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';

describe('InventoryController', () => {
  let controller: InventoryController;

  const mockInventoryService = {
    adjustStock: jest.fn(),
    getQuantity: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryController],
      providers: [
        {
          provide: InventoryService,
          useValue: mockInventoryService,
        },
      ],
    }).compile();

    controller = module.get<InventoryController>(InventoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('adjustStock', () => {
    it('should adjust stock', async () => {
      const dto = { productId: 'p-uuid', delta: 10 };
      const inventory = { id: 'i-uuid', productId: 'p-uuid', quantity: 10 };
      mockInventoryService.adjustStock.mockResolvedValue(inventory);

      const result = await controller.adjustStock(dto);
      expect(result).toEqual(inventory);
      expect(mockInventoryService.adjustStock).toHaveBeenCalledWith(dto);
    });
  });

  describe('getQuantity', () => {
    it('should return quantity', async () => {
      mockInventoryService.getQuantity.mockResolvedValue(10);

      const result = await controller.getQuantity('p-uuid');
      expect(result).toEqual({ productId: 'p-uuid', quantity: 10 });
      expect(mockInventoryService.getQuantity).toHaveBeenCalledWith('p-uuid');
    });
  });
});
