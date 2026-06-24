import { Controller, Get, Post, Patch, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProductCommand } from '../../application/commands/create-product.handler';
import { UpdateProductCommand } from '../../application/commands/update-product.handler';
import { DeleteProductCommand } from '../../application/commands/delete-product.handler';
import { GetProductsQuery } from '../../application/queries/get-products.handler';
import { GetProductByIdQuery } from '../../application/queries/get-product-by-id.handler';

@Controller('products')
export class ProductController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Body() body: any) {
    return this.commandBus.execute(
      new CreateProductCommand(body.name, body.price, body.category, body.description),
    );
  }

  @Get()
  async findAll() {
    return this.queryBus.execute(new GetProductsQuery());
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.queryBus.execute(new GetProductByIdQuery(id));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.commandBus.execute(
      new UpdateProductCommand(id, body.name, body.price, body.category, body.description),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteProductCommand(id));
  }
}
