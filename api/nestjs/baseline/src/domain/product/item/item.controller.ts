import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ItemService } from './item.service';
import type { CreateItemDto } from './dto/create-item.dto';
import { FindAllItemSchema } from './dto/find-all-item.dto';
import type { FindAllItemDto } from './dto/find-all-item.dto';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) { }

  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemService.create(createItemDto);
  }

  @Get()
  findAll(@Query(new ZodValidationPipe(FindAllItemSchema)) query: FindAllItemDto) {
    return this.itemService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(+id);
  }
}
