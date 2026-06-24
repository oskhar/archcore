import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

config({ path: join(__dirname, '../../../../.env') });

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'archkit_user',
  password: process.env.DB_PASSWORD || 'archkit_password',
  database: process.env.DB_NAME || 'archkit_monolith',
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../migrations/*{.ts,.js}')],
  synchronize: false,  extra: {
    connectionLimit: 10,
  },
};

export default new DataSource(dataSourceOptions);
