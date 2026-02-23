import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockModule } from './stock/stock.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'tesdoang',
      database: process.env.DB_NAME || 'arch_inventories',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Only for development!
    }),
    StockModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
