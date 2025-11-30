import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { ItemSeeder } from './seeders/item.seeder';
import { Item } from 'src/domain/product/item/entities/item.entity';

config(); // load env if needed

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '3306'),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: [Item],
});

(async () => {
  try {
    await AppDataSource.initialize();

    console.log('🔗 Connected to database.');

    // run seeder
    const itemSeeder = new ItemSeeder(AppDataSource);
    await itemSeeder.run();

    console.log('🌱 Seeding completed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
})();
