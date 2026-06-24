import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME || 'archkit_user',
    password: process.env.DB_PASSWORD || 'archkit_password',
    database:
      process.env.NODE_ENV === 'test'
        ? process.env.DB_NAME_TEST || 'archkit_monolith_test'
        : process.env.DB_NAME || 'archkit_monolith',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    synchronize: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test',    dropSchema: process.env.NODE_ENV === 'test',
    logging: process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test',
  }),
);
