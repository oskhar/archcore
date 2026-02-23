import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from 'src/constants';

@Controller('item')
export class ProductController {
  constructor(
    @Inject(MICROSERVICES_CLIENTS.PRODUCTS_SERVICE)
    private readonly productService: ClientProxy,
  ) {}
  @Post()
  create(@Body() payload: unknown) {
    return this.productService.send('product.createItem', payload);
  }

  @Get()
  findAll() {
    return this.productService.send('product.findAllItems', {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.send('product.findOneItem', id);
  }
}
