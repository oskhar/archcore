import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ItemsService } from './items.service';
import type { CreateItemDto } from './dto/create-item.dto';

@Controller()
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @MessagePattern('createItem')
  create(@Payload() createItemDto: CreateItemDto) {
    return this.itemsService.create(createItemDto);
  }

  @MessagePattern('findAllItems')
  findAll() {
    return this.itemsService.findAll();
  }

  @MessagePattern('findOneItem')
  findOne(@Payload() id: number) {
    return this.itemsService.findOne(id);
  }
}
