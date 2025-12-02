import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { SeederModule } from './database/seeders/seeder.module';

async function bootstrap() {
  // Menggunakan SeederModule karena sudah memuat konfigurasi Database
  const appContext = await NestFactory.createApplicationContext(SeederModule);

  try {
    const dataSource = appContext.get(DataSource);

    console.log('🧨 Warning: This will DROP all tables and data.');
    console.log('🔄 Refreshing database schema...');

    // MAGIC LINE: true = dropSchema: true
    // Ini menghapus semua tabel dalam database dan membuatnya ulang berdasarkan Entity
    // Tidak perlu truncate satu per satu.
    await dataSource.synchronize(true);

    console.log('✨ Database is now Fresh (Empty & Synced)!');
  } catch (error) {
    console.error('❌ Database refresh failed:', error);
  } finally {
    await appContext.close();
  }
}

bootstrap();
