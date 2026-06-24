import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InventoryService } from './inventory.service';
import { Inventory } from './entities/inventory.entity';
import { ProductService } from '../product/product.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('InventoryService', () => {
  let service: InventoryService;
  let productService: ProductService;

  const mockInventoryRepository = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    increment: jest.fn(),
  };

  const mockProductService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: getRepositoryToken(Inventory),
          useValue: mockInventoryRepository,
        },
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('adjustStock', () => {
    it('should create new inventory record if it does not exist', async () => {
      const dto = { productId: 'p-uuid', delta: 10 };
      const product = { id: 'p-uuid', name: 'Test' } as any;
      const inventory = { id: 'i-uuid', productId: 'p-uuid', quantity: 10 };

      mockProductService.findOne.mockResolvedValue(product);
      mockInventoryRepository.findOneBy.mockResolvedValue(null);
      mockInventoryRepository.create.mockReturnValue({
        productId: 'p-uuid',
        quantity: 10,
      });
      mockInventoryRepository.save.mockResolvedValue(inventory);

      const result = await service.adjustStock(dto);
      expect(result).toEqual(inventory);
      expect(mockProductService.findOne).toHaveBeenCalledWith('p-uuid');
      expect(mockInventoryRepository.create).toHaveBeenCalledWith({
        productId: 'p-uuid',
        quantity: 10,
      });
      expect(mockInventoryRepository.save).toHaveBeenCalled();
    });

    it('should increment existing inventory quantity', async () => {
      const dto = { productId: 'p-uuid', delta: 5 };
      const product = { id: 'p-uuid', name: 'Test' } as any;
      const existingInventory = {
        id: 'i-uuid',
        productId: 'p-uuid',
        quantity: 10,
      };
      const updatedInventory = {
        id: 'i-uuid',
        productId: 'p-uuid',
        quantity: 15,
      };

      mockProductService.findOne.mockResolvedValue(product);
      mockInventoryRepository.findOneBy
        .mockResolvedValueOnce(existingInventory)
        .mockResolvedValueOnce(updatedInventory);
      mockInventoryRepository.increment.mockResolvedValue({ affected: 1 });

      const result = await service.adjustStock(dto);
      expect(result).toEqual(updatedInventory);
      expect(mockInventoryRepository.increment).toHaveBeenCalledWith(
        { productId: 'p-uuid' },
        'quantity',
        5,
      );
    });

    it('should throw NotFoundException if product does not exist', async () => {
      const dto = { productId: 'p-uuid', delta: 5 };
      mockProductService.findOne.mockRejectedValue(new NotFoundException());

      await expect(service.adjustStock(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if stock is insufficient', async () => {
      const dto = { productId: 'p-uuid', delta: -15 };
      const product = { id: 'p-uuid', name: 'Test' } as any;
      const existingInventory = {
        id: 'i-uuid',
        productId: 'p-uuid',
        quantity: 10,
      };

      mockProductService.findOne.mockResolvedValue(product);
      mockInventoryRepository.findOneBy.mockResolvedValue(existingInventory);

      await expect(service.adjustStock(dto)).rejects.toThrow(BadRequestException);
      await expect(service.adjustStock(dto)).rejects.toThrow('Insufficient stock');
    });

    it('should throw BadRequestException if stock record does not exist and delta is negative', async () => {
      const dto = { productId: 'p-uuid', delta: -10 };
      const product = { id: 'p-uuid', name: 'Test' } as any;

      mockProductService.findOne.mockResolvedValue(product);
      mockInventoryRepository.findOneBy.mockResolvedValue(null);

      await expect(service.adjustStock(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getQuantity', () => {
    it('should return the quantity for a product', async () => {
      const inventory = { productId: 'p-uuid', quantity: 10 };
      mockInventoryRepository.findOneBy.mockResolvedValue(inventory);

      const result = await service.getQuantity('p-uuid');
      expect(result).toEqual(10);
    });

    it('should return 0 if no inventory record found', async () => {
      mockInventoryRepository.findOneBy.mockResolvedValue(null);
      const result = await service.getQuantity('p-uuid');
      expect(result).toEqual(0);
    });
  });
});
