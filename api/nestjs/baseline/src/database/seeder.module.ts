import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { seeders } from './seeders';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [...seeders],
  exports: [...seeders],
})
export class SeederModule {}
