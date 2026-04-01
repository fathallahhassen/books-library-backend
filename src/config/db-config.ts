import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import BookEntity from '../books/entities/book.entity';
import { DatabaseConfig } from './config.type';

dotenvConfig({ path: `.env.development` });

const dbOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT
    ? parseInt(process.env.DATABASE_PORT, 10)
    : 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [BookEntity],
  synchronize: process.env.NODE_ENV === 'development',
};

export default registerAs<DatabaseConfig>(
  'database',
  () => dbOptions as DatabaseConfig,
);

export const connectionSource = new DataSource(dbOptions);
