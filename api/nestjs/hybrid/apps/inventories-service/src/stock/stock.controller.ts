import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { StockService } from './stock.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@Controller()
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @MessagePattern('createStock')
  create(@Payload() createStockDto: CreateStockDto) {
    return this.stockService.create(createStockDto);
  }

  @MessagePattern('findAllStock')
  findAll() {
    return this.stockService.findAll();
  }

  @MessagePattern('findOneStock')
  findOne(@Payload() id: number) {
    return this.stockService.findOne(id);
  }

  @MessagePattern('updateStock')
  update(@Payload() updateStockDto: UpdateStockDto) {
    return this.stockService.update(updateStockDto.id, updateStockDto);
  }

  @MessagePattern('removeStock')
  remove(@Payload() id: number) {
    return this.stockService.remove(id);
  }
}
