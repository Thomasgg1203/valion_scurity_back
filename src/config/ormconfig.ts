import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';
// Load environment variables from .env file
const basePath = path.resolve(__dirname, '..', '..');

export const ormConfig: DataSourceOptions = {
  type: 'postgres',

  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,

  synchronize: false,
  logging: false,

  entities: [path.join(basePath, '/**/*.entity{.ts,.js}')],

  migrations: [path.join(basePath, '/infrastructure/database/migrations/*{.ts,.js}')],
};

export const AppDataSource = new DataSource(ormConfig);
