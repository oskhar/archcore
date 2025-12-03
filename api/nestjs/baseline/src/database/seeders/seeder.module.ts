import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database.module'; // Import DatabaseModule Anda yang sudah ada
import { ItemSeeder } from './item.seeder';
import { Item } from 'src/domain/product/item/entities/item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([Item]),
  ],
  providers: [ItemSeeder],
})
export class SeederModule {}
