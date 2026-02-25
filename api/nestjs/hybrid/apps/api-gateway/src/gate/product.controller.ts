import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from 'src/constants';

@Controller('item')
export class ProductController implements OnModuleInit {
  constructor(
    @Inject(MICROSERVICES_CLIENTS.PRODUCTS_SERVICE)
    private readonly productService: ClientKafka,
  ) {}

  async onModuleInit() {
    this.productService.subscribeToResponseOf('product.createItem');
    this.productService.subscribeToResponseOf('product.findAllItems');
    this.productService.subscribeToResponseOf('product.findOneItem');
    await this.productService.connect();
  }

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
