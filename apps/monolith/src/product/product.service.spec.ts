import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';

describe('ProductService', () => {
  let service: ProductService;

  const mockProductRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const dto = { name: 'Test Product', price: 10.5 };
      const product = { id: 'uuid', ...dto };
      mockProductRepository.create.mockReturnValue(product);
      mockProductRepository.save.mockResolvedValue(product);

      const result = await service.create(dto);
      expect(result).toEqual(product);
      expect(mockProductRepository.create).toHaveBeenCalledWith(dto);
      expect(mockProductRepository.save).toHaveBeenCalledWith(product);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const products = [{ id: 'uuid', name: 'Test', price: 10 }];
      mockProductRepository.find.mockResolvedValue(products);

      const result = await service.findAll();
      expect(result).toEqual(products);
      expect(mockProductRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const product = { id: 'uuid', name: 'Test', price: 10 };
      mockProductRepository.findOneBy.mockResolvedValue(product);

      const result = await service.findOne('uuid');
      expect(result).toEqual(product);
      expect(mockProductRepository.findOneBy).toHaveBeenCalledWith({
        id: 'uuid',
      });
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const dto = { name: 'Updated' };
      mockProductRepository.update.mockResolvedValue({ affected: 1 });
      const updatedProduct = { id: 'uuid', name: 'Updated', price: 10 };
      mockProductRepository.findOneBy.mockResolvedValue(updatedProduct);

      const result = await service.update('uuid', dto);
      expect(result).toEqual(updatedProduct);
      expect(mockProductRepository.update).toHaveBeenCalledWith('uuid', dto);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      mockProductRepository.delete.mockResolvedValue({ affected: 1 });
      await service.remove('uuid');
      expect(mockProductRepository.delete).toHaveBeenCalledWith('uuid');
    });
  });
});
