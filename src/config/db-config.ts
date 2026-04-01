import { registerAs } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

import BookEntity from '../books/entities/book.entity';
import { DatabaseConfig } from './config.type';

export default registerAs<DatabaseConfig>('database', () => {
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

  return dbOptions as DatabaseConfig;
});
