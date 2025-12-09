import { NestFactory } from '@nestjs/core';
import { ItemSeeder } from './database/seeders/item.seeder';
import { SeederModule } from './database/seeders/seeder.module';
import { StockSeeder } from './database/seeders/stock.seeder';

async function bootstrap() {
  // Membuat Application Context (bukan full HTTP server)
  const appContext = await NestFactory.createApplicationContext(SeederModule);

  try {
    const itemSeeder = appContext.get(ItemSeeder);
    const stockSeeder = appContext.get(StockSeeder);

    await itemSeeder.seed(100);
    await stockSeeder.seed(100);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    // Tutup koneksi database setelah selesai
    await appContext.close();
  }
}

bootstrap();
