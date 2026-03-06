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

@Controller('stock')
export class InventoryController implements OnModuleInit {
  constructor(
    @Inject(MICROSERVICES_CLIENTS.INVENTORIES_SERVICE)
    private readonly inventoryService: ClientKafka,
  ) {}

  async onModuleInit() {
    this.inventoryService.subscribeToResponseOf('inventory.createItem');
    this.inventoryService.subscribeToResponseOf('inventory.findAllItems');
    this.inventoryService.subscribeToResponseOf('inventory.findOneItem');
    await this.inventoryService.connect();
  }

  @Post()
  create(@Body() payload: unknown) {
    return this.inventoryService.send('inventory.createItem', payload);
  }

  @Get()
  findAll() {
    return this.inventoryService.send('inventory.findAllItems', {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryService.send('inventory.findOneItem', id);
  }
}
