import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

describe('ProductController', () => {
  let controller: ProductController;

  const mockProductService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const dto = { name: 'Test', price: 10 };
      mockProductService.create.mockResolvedValue({ id: 'uuid', ...dto });

      const result = await controller.create(dto);
      expect(result).toEqual({ id: 'uuid', ...dto });
      expect(mockProductService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const products = [{ id: 'uuid', name: 'Test', price: 10 }];
      mockProductService.findAll.mockResolvedValue(products);

      const result = await controller.findAll();
      expect(result).toEqual(products);
      expect(mockProductService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return one product', async () => {
      const product = { id: 'uuid', name: 'Test', price: 10 };
      mockProductService.findOne.mockResolvedValue(product);

      const result = await controller.findOne('uuid');
      expect(result).toEqual(product);
      expect(mockProductService.findOne).toHaveBeenCalledWith('uuid');
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const dto = { name: 'Updated' };
      const product = { id: 'uuid', name: 'Updated', price: 10 };
      mockProductService.update.mockResolvedValue(product);

      const result = await controller.update('uuid', dto);
      expect(result).toEqual(product);
      expect(mockProductService.update).toHaveBeenCalledWith('uuid', dto);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      mockProductService.remove.mockResolvedValue(undefined);
      await controller.remove('uuid');
      expect(mockProductService.remove).toHaveBeenCalledWith('uuid');
    });
  });
});
