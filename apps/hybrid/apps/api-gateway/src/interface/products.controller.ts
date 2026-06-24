import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  CreateProductSchema,
  UpdateProductSchema,
  CreateProductDto,
  UpdateProductDto,
} from './dto/product.dto';

@Controller('products')
export class ProductsController {
  private readonly productServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.productServiceUrl = this.configService.get<string>(
      'PRODUCT_SERVICE_URL',
      process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001',
    );
  }

  @Post()
  @UsePipes(new ZodValidationPipe(CreateProductSchema))
  async create(@Body() body: CreateProductDto) {
    const { data } = await firstValueFrom(
      this.httpService.post(`${this.productServiceUrl}/products`, body),
    );
    return data;
  }

  @Get()
  async findAll() {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.productServiceUrl}/products`),
    );
    return data;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.productServiceUrl}/products/${id}`),
    );
    return data;
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(UpdateProductSchema))
  async update(@Param('id') id: string, @Body() body: UpdateProductDto) {
    const { data } = await firstValueFrom(
      this.httpService.patch(`${this.productServiceUrl}/products/${id}`, body),
    );
    return data;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await firstValueFrom(
      this.httpService.delete(`${this.productServiceUrl}/products/${id}`),
    );
  }
}
