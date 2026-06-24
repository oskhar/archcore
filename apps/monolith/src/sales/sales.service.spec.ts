import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SalesService } from './sales.service';
import { SalesTransaction, TransactionStatus } from './entities/sales-transaction.entity';
import { SalesItem } from './entities/sales-item.entity';
import { ProductService } from '../product/product.service';
import { InventoryService } from '../inventory/inventory.service';
import { DataSource, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('SalesService', () => {
  let service: SalesService;
  let productService: ProductService;
  let inventoryService: InventoryService;

  const mockTransactionRepository = {
    findOne: jest.fn(),
  };

  const mockItemRepository = {
    save: jest.fn(),
  };

  const mockProductService = {
    findOne: jest.fn(),
  };

  const mockInventoryService = {
    adjustStock: jest.fn(),
  };

  const mockQueryRunner = {
    connect: jest.fn(),
    release: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    manager: {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    },
  };

  const mockDataSource = {
    transaction: jest.fn(),
    createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesService,
        {
          provide: getRepositoryToken(SalesTransaction),
          useValue: mockTransactionRepository,
        },
        {
          provide: getRepositoryToken(SalesItem),
          useValue: mockItemRepository,
        },
        {
          provide: ProductService,
          useValue: mockProductService,
        },
        {
          provide: InventoryService,
          useValue: mockInventoryService,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<SalesService>(SalesService);
    productService = module.get<ProductService>(ProductService);
    inventoryService = module.get<InventoryService>(InventoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTransaction', () => {
    it('should create a complete transaction with inventory adjustment', async () => {
      const dto = {
        items: [{ productId: 'p1', quantity: 2 }],
      };
      const product = { id: 'p1', name: 'Test Product', price: 10 };
      const savedTransaction = { id: 't1', totalPrice: 20, status: TransactionStatus.COMPLETED };
      const salesItem = { id: 'si1', productId: 'p1', quantity: 2, unitPrice: 10, transactionId: 't1' };

      mockDataSource.transaction.mockImplementation(async (cb) => {
        return await cb(mockQueryRunner.manager);
      });

      mockProductService.findOne.mockResolvedValue(product);
      mockQueryRunner.manager.create.mockReturnValueOnce(salesItem).mockReturnValueOnce(savedTransaction);
      mockQueryRunner.manager.save.mockResolvedValueOnce(savedTransaction).mockResolvedValueOnce(salesItem);
      mockQueryRunner.manager.findOne.mockResolvedValue({ ...savedTransaction, items: [salesItem] });

      const result = await service.createTransaction(dto);

      expect(result.id).toEqual('t1');
      expect(result.totalPrice).toEqual(20);
      expect(mockInventoryService.adjustStock).toHaveBeenCalledWith(
        {
          productId: 'p1',
          delta: -2,
        },
        mockQueryRunner.manager,
      );
    });
  });

  describe('findOne', () => {
    it('should return a transaction', async () => {
      const transaction = { id: 't1', totalPrice: 20 };
      mockTransactionRepository.findOne.mockResolvedValue(transaction);

      const result = await service.findOne('t1');
      expect(result).toEqual(transaction);
    });

    it('should throw NotFoundException', async () => {
      mockTransactionRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('t1')).rejects.toThrow(NotFoundException);
    });
  });
});
