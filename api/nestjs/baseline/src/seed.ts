import { NestFactory } from '@nestjs/core';
import { ItemSeeder } from './database/seeders/item.seeder';
import { SeederModule } from './database/seeders/seeder.module';

async function bootstrap() {
  // Membuat Application Context (bukan full HTTP server)
  const appContext = await NestFactory.createApplicationContext(SeederModule);

  try {
    const itemSeeder = appContext.get(ItemSeeder);

    // Jalankan seeding (contoh: buat 100 data)
    await itemSeeder.seed(1000000);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    // Tutup koneksi database setelah selesai
    await appContext.close();
  }
}

bootstrap();
