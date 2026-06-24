import { Test, TestingModule } from '@nestjs/testing';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';

describe('SalesController', () => {
  let controller: SalesController;
  let service: SalesService;

  const mockSalesService = {
    createTransaction: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesController],
      providers: [
        {
          provide: SalesService,
          useValue: mockSalesService,
        },
      ],
    }).compile();

    controller = module.get<SalesController>(SalesController);
    service = module.get<SalesService>(SalesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTransaction', () => {
    it('should call salesService.createTransaction', async () => {
      const dto = { items: [{ productId: 'p1', quantity: 2 }] };
      mockSalesService.createTransaction.mockResolvedValue({ id: 't1' });

      const result = await controller.createTransaction(dto);
      expect(result).toEqual({ id: 't1' });
      expect(mockSalesService.createTransaction).toHaveBeenCalledWith(dto);
    });
  });

  describe('findOne', () => {
    it('should call salesService.findOne', async () => {
      mockSalesService.findOne.mockResolvedValue({ id: 't1' });

      const result = await controller.findOne('t1');
      expect(result).toEqual({ id: 't1' });
      expect(mockSalesService.findOne).toHaveBeenCalledWith('t1');
    });
  });
});
